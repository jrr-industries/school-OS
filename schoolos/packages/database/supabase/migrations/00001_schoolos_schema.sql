-- ============================================================================
-- SchoolOS – Multi-Tenant PostgreSQL Schema + RLS
-- PostgreSQL 16 / Supabase Architecture
-- ============================================================================
-- This migration defines the complete database schema, Row-Level Security
-- policies, audit triggers, Realtime publication targets, and performance
-- indexes for the SchoolOS platform.
--
-- Conventions:
--   * UUID PKs with gen_random_uuid() defaults
--   * All tenant tables carry school_id UUID FK → schools(id) ON DELETE CASCADE
--   * RLS is enforced on every table; tenant isolation uses auth.jwt()
--   * An audit trigger logs mutations on core entities
-- ============================================================================

-- 0. Extensions -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Custom Enum Types ------------------------------------------------------
-- (Using TEXT with CHECK constraints is Prisma-friendly, but native enums
--  improve storage & readabililty for pure-SQL operations.)

DO $$ BEGIN
  CREATE TYPE school_status AS ENUM ('active', 'inactive', 'trial', 'suspended', 'deleted');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'tardy', 'excused');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE admission_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'school_admin', 'principal', 'teacher', 'staff', 'parent', 'student');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- GROUP A – PLATFORM ORCHESTRATION LEVEL (Global Scope)
-- ============================================================================

-- 2. schools ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  code          TEXT NOT NULL,
  domain        TEXT,
  status        school_status NOT NULL DEFAULT 'trial',
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  logo_url      TEXT,
  banner_url    TEXT,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  country       TEXT,
  postal_code   TEXT,
  phone         TEXT,
  email         TEXT,
  website       TEXT,
  settings      JSONB DEFAULT '{}'::jsonb,
  features      JSONB DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  version       INT NOT NULL DEFAULT 1,

  CONSTRAINT uq_schools_code UNIQUE (code),
  CONSTRAINT uq_schools_domain UNIQUE (domain)
);

COMMENT ON TABLE schools IS 'Platform-level tenant registry – each row is one school';

-- 3. subscription_plans -----------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'USD',
  interval      TEXT NOT NULL DEFAULT 'monthly',
  max_students  INT NOT NULL DEFAULT 100,
  max_teachers  INT NOT NULL DEFAULT 10,
  max_storage_gb INT NOT NULL DEFAULT 1,
  features      JSONB DEFAULT '[]'::jsonb,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  version       INT NOT NULL DEFAULT 1,

  CONSTRAINT uq_subscription_plans_slug UNIQUE (slug)
);

-- 4. subscriptions ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  plan_id           UUID NOT NULL REFERENCES subscription_plans(id),
  status            subscription_status NOT NULL DEFAULT 'trial',
  starts_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at           TIMESTAMPTZ,
  trial_ends_at     TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  auto_renew        BOOLEAN NOT NULL DEFAULT TRUE,
  payment_method    TEXT,
  payment_reference TEXT,
  metadata          JSONB DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ,
  version           INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_school_id ON subscriptions(school_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

-- 5. payments ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id   UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  amount            NUMERIC(12,2) NOT NULL,
  currency          VARCHAR(3) NOT NULL DEFAULT 'USD',
  status            payment_status NOT NULL DEFAULT 'pending',
  gateway           TEXT,
  gateway_txn_id    TEXT,
  invoice_url       TEXT,
  receipt_number    TEXT,
  paid_at           TIMESTAMPTZ,
  refunded_at       TIMESTAMPTZ,
  metadata          JSONB DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ,
  version           INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_school_id ON payments(school_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- 6. support_tickets --------------------------------------------------------
CREATE TABLE IF NOT EXISTS support_tickets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id) ON DELETE SET NULL,
  user_id       UUID,
  title         TEXT NOT NULL,
  description   TEXT,
  priority      ticket_priority NOT NULL DEFAULT 'normal',
  status        ticket_status NOT NULL DEFAULT 'open',
  assigned_to   UUID,
  category      TEXT,
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  version       INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_school_id ON support_tickets(school_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);

-- 7. audit_logs -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      UUID,
  school_id     UUID,
  action        TEXT NOT NULL,
  target_type   TEXT NOT NULL,
  target_id     UUID,
  old_payload   JSONB,
  new_payload   JSONB,
  ip_address    INET,
  user_agent    TEXT,
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_type ON audit_logs(target_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
-- BRIN index for time-range scans on the ever-growing audit table
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp_brin ON audit_logs USING BRIN (timestamp) WITH (pages_per_range = 32);

-- ============================================================================
-- GROUP B – TENANT OPERATIONS LEVEL (scoped via school_id)
-- ============================================================================

-- 8. profiles (extends auth.users) ------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  role          user_role NOT NULL DEFAULT 'staff',
  permissions   TEXT[] DEFAULT '{}',
  phone         TEXT,
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  metadata      JSONB DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_profiles_id UNIQUE (id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 9. students ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  middle_name       TEXT,
  admission_number  TEXT NOT NULL,
  roll_number       TEXT,
  date_of_birth     DATE,
  gender            TEXT,
  blood_group       TEXT,
  nationality       TEXT,
  religion          TEXT,
  caste_category    TEXT,
  aadhar_number     TEXT,
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred', 'graduated', 'dropped')),
  academic_year     TEXT,
  class_id          UUID,
  section_id        UUID,
  guardian_id       UUID,
  emergency_contact TEXT,
  medical_notes     TEXT,
  photo_url         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ,
  version           INT NOT NULL DEFAULT 1,

  CONSTRAINT uq_students_school_admission UNIQUE (school_id, admission_number)
);

CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);

-- 10. teachers --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teachers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  middle_name       TEXT,
  employee_id       TEXT NOT NULL,
  department        TEXT,
  designation       TEXT,
  qualification     TEXT,
  specializations   TEXT[] DEFAULT '{}',
  date_of_join      DATE,
  date_of_birth     DATE,
  gender            TEXT,
  blood_group       TEXT,
  nationality       TEXT,
  aadhar_number     TEXT,
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'resigned', 'terminated')),
  emergency_contact TEXT,
  photo_url         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ,
  version           INT NOT NULL DEFAULT 1,

  CONSTRAINT uq_teachers_school_employee UNIQUE (school_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_department ON teachers(department);

-- 11. parents ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS parents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  middle_name   TEXT,
  relationship  TEXT,
  occupation    TEXT,
  phone         TEXT,
  email         TEXT,
  address       TEXT,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  version       INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_parents_school_id ON parents(school_id);
CREATE INDEX IF NOT EXISTS idx_parents_user_id ON parents(user_id);

-- Student-Parent junction ------------------------------------------------
CREATE TABLE IF NOT EXISTS student_parents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  parent_id     UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  relationship  TEXT,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_student_parent UNIQUE (student_id, parent_id)
);

CREATE INDEX IF NOT EXISTS idx_student_parents_school_id ON student_parents(school_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_student_id ON student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent_id ON student_parents(parent_id);

-- 12. attendance ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  status        attendance_status NOT NULL DEFAULT 'present',
  check_in      TIMESTAMPTZ,
  check_out     TIMESTAMPTZ,
  marked_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  remarks       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_attendance_user_date UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_school_id ON attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- 13. fees ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fee_structures (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  amount        NUMERIC(12,2) NOT NULL,
  frequency     TEXT NOT NULL DEFAULT 'annual' CHECK (frequency IN ('annual', 'semi_annual', 'quarterly', 'monthly', 'one_time')),
  category      TEXT,
  due_month     INT,
  is_optional   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  version       INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_fee_structures_school_id ON fee_structures(school_id);

CREATE TABLE IF NOT EXISTS fees (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES fee_structures(id) ON DELETE SET NULL,
  amount_due      NUMERIC(12,2) NOT NULL,
  amount_paid     NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_date        DATE NOT NULL,
  paid_date       DATE,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue', 'waived')),
  late_fee        NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_mode    TEXT,
  transaction_ref TEXT,
  receipt_url     TEXT,
  remarks         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  version         INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_fees_school_id ON fees(school_id);
CREATE INDEX IF NOT EXISTS idx_fees_student_id ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_status ON fees(status);
CREATE INDEX IF NOT EXISTS idx_fees_due_date ON fees(due_date);

-- 14. leave_requests --------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  applicant_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  approver_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  leave_type      TEXT NOT NULL CHECK (leave_type IN ('sick', 'casual', 'annual', 'maternity', 'paternity', 'bereavement', 'unpaid', 'other')),
  reason          TEXT NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  duration_days   INT NOT NULL GENERATED ALWAYS AS (end_date - start_date + 1) STORED,
  status          leave_status NOT NULL DEFAULT 'pending',
  approved_at     TIMESTAMPTZ,
  remarks         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  version         INT NOT NULL DEFAULT 1,

  CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_school_id ON leave_requests(school_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_applicant_id ON leave_requests(applicant_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_start_date ON leave_requests(start_date);

-- 15. announcements ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  author_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  priority      ticket_priority NOT NULL DEFAULT 'normal',
  target_roles  user_role[] DEFAULT '{}',
  is_pinned     BOOLEAN NOT NULL DEFAULT FALSE,
  pinned_until  TIMESTAMPTZ,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  version       INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_announcements_school_id ON announcements(school_id);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);

-- 16. admissions ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  candidate_name  TEXT NOT NULL,
  date_of_birth   DATE,
  gender          TEXT,
  applying_for    TEXT,
  parent_name     TEXT,
  parent_phone    TEXT,
  parent_email    TEXT,
  address         TEXT,
  previous_school TEXT,
  academic_year   TEXT,
  status          admission_status NOT NULL DEFAULT 'pending',
  reviewed_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  remarks         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  version         INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_admissions_school_id ON admissions(school_id);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admissions(created_at DESC);

-- ============================================================================
-- AUDIT TRIGGER ENGINE
-- ============================================================================

-- 17. Generic audit trigger function ----------------------------------------
-- This function is called by per-table triggers.  It captures the old and new
-- row state and writes a structured record to audit_logs.

CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id   UUID;
  v_school_id  UUID;
  v_action     TEXT;
  v_old_data   JSONB;
  v_new_data   JSONB;
BEGIN
  -- Determine actor from JWT (falls back to NULL for internal operations)
  BEGIN
    v_actor_id := (auth.jwt() -> 'app_metadata' ->> 'user_id')::UUID;
  EXCEPTION WHEN OTHERS THEN
    v_actor_id := NULL;
  END;

  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    v_action := 'CREATE';
    v_old_data := NULL;
    v_new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    v_old_data := to_jsonb(OLD);
    v_new_data := NULL;
  ELSE
    RETURN NULL;
  END IF;

  -- Extract school_id from the row if the table has that column
  BEGIN
    IF TG_OP = 'DELETE' THEN
      v_school_id := OLD.school_id;
    ELSE
      v_school_id := NEW.school_id;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_school_id := NULL;
  END;

  INSERT INTO audit_logs (actor_id, school_id, action, target_type, target_id, old_payload, new_payload)
  VALUES (
    v_actor_id,
    v_school_id,
    v_action,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    v_old_data,
    v_new_data
  );

  RETURN NULL;
END;
$$;

-- 18. Attach audit triggers to core tables ----------------------------------
-- Each trigger fires AFTER mutation so the row is already committed.

-- Platform tables
CREATE TRIGGER trg_audit_schools AFTER INSERT OR UPDATE OR DELETE ON schools
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_subscriptions AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_support_tickets AFTER INSERT OR UPDATE OR DELETE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Tenant tables
CREATE TRIGGER trg_audit_profiles AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_students AFTER INSERT OR UPDATE OR DELETE ON students
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_teachers AFTER INSERT OR UPDATE OR DELETE ON teachers
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_parents AFTER INSERT OR UPDATE OR DELETE ON parents
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_attendance AFTER INSERT OR UPDATE OR DELETE ON attendance
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_fees AFTER INSERT OR UPDATE OR DELETE ON fees
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_leave_requests AFTER INSERT OR UPDATE OR DELETE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_announcements AFTER INSERT OR UPDATE OR DELETE ON announcements
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

CREATE TRIGGER trg_audit_admissions AFTER INSERT OR UPDATE OR DELETE ON admissions
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) ENGINE
-- ============================================================================

-- 19. Helper function to extract tenant context from JWT --------------------

CREATE OR REPLACE FUNCTION fn_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role')::user_role;
$$;

CREATE OR REPLACE FUNCTION fn_user_school_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID;
$$;

CREATE OR REPLACE FUNCTION fn_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'user_id')::UUID;
$$;

-- 20. Enable RLS on all tables ---------------------------------------------

-- Group A – Platform tables
ALTER TABLE schools             ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs          ENABLE ROW LEVEL SECURITY;

-- Group B – Tenant tables
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE students            ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents             ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance          ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures      ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees                ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions          ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES – GROUP A (Platform Orchestration)
-- ============================================================================

-- Schools: super_admins have full CRUD; others have read-only
CREATE POLICY "super_admin_all_schools"
  ON schools FOR ALL
  USING (fn_user_role() = 'super_admin')
  WITH CHECK (fn_user_role() = 'super_admin');

CREATE POLICY "all_read_schools"
  ON schools FOR SELECT
  USING (TRUE);

-- subscription_plans: super_admins full CRUD; all authenticated read
CREATE POLICY "super_admin_all_subscription_plans"
  ON subscription_plans FOR ALL
  USING (fn_user_role() = 'super_admin')
  WITH CHECK (fn_user_role() = 'super_admin');

CREATE POLICY "all_read_subscription_plans"
  ON subscription_plans FOR SELECT
  USING (auth.role() = 'authenticated');

-- subscriptions: super_admin full CRUD; tenant read own
CREATE POLICY "super_admin_all_subscriptions"
  ON subscriptions FOR ALL
  USING (fn_user_role() = 'super_admin')
  WITH CHECK (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_select_subscriptions"
  ON subscriptions FOR SELECT
  USING (school_id = fn_user_school_id());

-- payments: super_admin full CRUD; tenant read own
CREATE POLICY "super_admin_all_payments"
  ON payments FOR ALL
  USING (fn_user_role() = 'super_admin')
  WITH CHECK (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_select_payments"
  ON payments FOR SELECT
  USING (school_id = fn_user_school_id());

-- support_tickets: super_admin full CRUD; tenant CRUD own
CREATE POLICY "super_admin_all_support_tickets"
  ON support_tickets FOR ALL
  USING (fn_user_role() = 'super_admin')
  WITH CHECK (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_all_support_tickets"
  ON support_tickets FOR ALL
  USING (school_id = fn_user_school_id())
  WITH CHECK (school_id = fn_user_school_id());

-- audit_logs: super_admin read-only; tenant read own
CREATE POLICY "super_admin_select_audit_logs"
  ON audit_logs FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_select_audit_logs"
  ON audit_logs FOR SELECT
  USING (school_id = fn_user_school_id());

-- ============================================================================
-- RLS POLICIES – GROUP B (Tenant Operations)
-- ============================================================================

-- All tenant policies follow the same pattern:
--   1. super_admin bypass: SELECT only (read-only support)
--   2. Tenant boundary: school_id must match JWT
--   3. Role-based: school_admin / principal get full CRUD within their school
--                   teachers / staff get INSERT + SELECT + UPDATE (no DELETE)
--                   parents / students get SELECT only (own records)

-- 21. profiles --------------------------------------------------------------
CREATE POLICY "super_admin_select_profiles"
  ON profiles FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_profiles"
  ON profiles FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_staff_insert_select_update_profiles"
  ON profiles FOR INSERT
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "tenant_staff_select_profiles"
  ON profiles FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "tenant_staff_update_profiles"
  ON profiles FOR UPDATE
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "own_profile_select"
  ON profiles FOR SELECT
  USING (id = fn_user_id());

CREATE POLICY "own_profile_update"
  ON profiles FOR UPDATE
  USING (id = fn_user_id())
  WITH CHECK (id = fn_user_id());

-- 22. students --------------------------------------------------------------
CREATE POLICY "super_admin_select_students"
  ON students FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_students"
  ON students FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_staff_insert_select_update_students"
  ON students FOR INSERT
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "tenant_staff_select_students"
  ON students FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "tenant_staff_update_students"
  ON students FOR UPDATE
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "tenant_parent_select_students"
  ON students FOR SELECT
  USING (
    school_id = fn_user_school_id()
    AND fn_user_role() = 'parent'
    AND id IN (
      SELECT sp.student_id FROM student_parents sp WHERE sp.parent_id IN (
        SELECT p.id FROM parents p WHERE p.user_id = fn_user_id()
      )
    )
  );

-- 23. teachers --------------------------------------------------------------
CREATE POLICY "super_admin_select_teachers"
  ON teachers FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_teachers"
  ON teachers FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_staff_select_teachers"
  ON teachers FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "own_teacher_record_select_update"
  ON teachers FOR SELECT
  USING (user_id = fn_user_id());

CREATE POLICY "own_teacher_record_update"
  ON teachers FOR UPDATE
  USING (user_id = fn_user_id())
  WITH CHECK (user_id = fn_user_id() AND school_id = fn_user_school_id());

-- 24. parents ---------------------------------------------------------------
CREATE POLICY "super_admin_select_parents"
  ON parents FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_parents"
  ON parents FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_staff_select_parents"
  ON parents FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "own_parent_record_select_update"
  ON parents FOR SELECT
  USING (user_id = fn_user_id());

CREATE POLICY "own_parent_record_update"
  ON parents FOR UPDATE
  USING (user_id = fn_user_id())
  WITH CHECK (user_id = fn_user_id() AND school_id = fn_user_school_id());

-- 25. student_parents -------------------------------------------------------
CREATE POLICY "super_admin_select_student_parents"
  ON student_parents FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_student_parents"
  ON student_parents FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_staff_select_student_parents"
  ON student_parents FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

-- 26. attendance ------------------------------------------------------------
CREATE POLICY "super_admin_select_attendance"
  ON attendance FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_attendance"
  ON attendance FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_teacher_insert_select_update_attendance"
  ON attendance FOR INSERT
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() = 'teacher');

CREATE POLICY "tenant_teacher_select_attendance"
  ON attendance FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() = 'teacher');

CREATE POLICY "tenant_teacher_update_attendance"
  ON attendance FOR UPDATE
  USING (school_id = fn_user_school_id() AND fn_user_role() = 'teacher')
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() = 'teacher');

CREATE POLICY "tenant_staff_select_attendance"
  ON attendance FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() = 'staff');

CREATE POLICY "own_attendance_select"
  ON attendance FOR SELECT
  USING (user_id = fn_user_id());

-- 27. fee_structures --------------------------------------------------------
CREATE POLICY "super_admin_select_fee_structures"
  ON fee_structures FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_fee_structures"
  ON fee_structures FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_staff_select_fee_structures"
  ON fee_structures FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

-- 28. fees ------------------------------------------------------------------
CREATE POLICY "super_admin_select_fees"
  ON fees FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_fees"
  ON fees FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_accountant_insert_select_update_fees"
  ON fees FOR INSERT
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() = 'staff');

CREATE POLICY "tenant_accountant_select_fees"
  ON fees FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() = 'staff');

CREATE POLICY "tenant_accountant_update_fees"
  ON fees FOR UPDATE
  USING (school_id = fn_user_school_id() AND fn_user_role() = 'staff')
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() = 'staff');

CREATE POLICY "parent_select_own_fees"
  ON fees FOR SELECT
  USING (
    school_id = fn_user_school_id()
    AND fn_user_role() = 'parent'
    AND student_id IN (
      SELECT sp.student_id FROM student_parents sp WHERE sp.parent_id IN (
        SELECT p.id FROM parents p WHERE p.user_id = fn_user_id()
      )
    )
  );

-- 29. leave_requests --------------------------------------------------------
CREATE POLICY "super_admin_select_leave_requests"
  ON leave_requests FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_leave_requests"
  ON leave_requests FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_teacher_insert_own_leave"
  ON leave_requests FOR INSERT
  WITH CHECK (school_id = fn_user_school_id() AND applicant_id = fn_user_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "tenant_teacher_select_own_leave"
  ON leave_requests FOR SELECT
  USING (school_id = fn_user_school_id() AND applicant_id = fn_user_id());

CREATE POLICY "tenant_approver_select_update_leave"
  ON leave_requests FOR SELECT
  USING (school_id = fn_user_school_id() AND approver_id = fn_user_id());

CREATE POLICY "tenant_approver_update_leave"
  ON leave_requests FOR UPDATE
  USING (school_id = fn_user_school_id() AND approver_id = fn_user_id())
  WITH CHECK (school_id = fn_user_school_id() AND approver_id = fn_user_id());

-- 30. announcements ---------------------------------------------------------
CREATE POLICY "super_admin_select_announcements"
  ON announcements FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_announcements"
  ON announcements FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_all_select_announcements"
  ON announcements FOR SELECT
  USING (school_id = fn_user_school_id());

-- 31. admissions ------------------------------------------------------------
CREATE POLICY "super_admin_select_admissions"
  ON admissions FOR SELECT
  USING (fn_user_role() = 'super_admin');

CREATE POLICY "tenant_admin_all_admissions"
  ON admissions FOR ALL
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('school_admin', 'principal'));

CREATE POLICY "tenant_staff_insert_select_admissions"
  ON admissions FOR INSERT
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "tenant_staff_select_admissions"
  ON admissions FOR SELECT
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

CREATE POLICY "tenant_staff_update_admissions"
  ON admissions FOR UPDATE
  USING (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'))
  WITH CHECK (school_id = fn_user_school_id() AND fn_user_role() IN ('teacher', 'staff'));

-- ============================================================================
-- REALTIME PUBLICATION CONFIGURATION
-- ============================================================================

-- 32. Add tables to the Supabase Realtime publication ----------------------
-- These tables will broadcast row-level changes to subscribed clients.
-- Note: ALTER PUBLICATION is idempotent in PG14+ but we wrap in a DO block
--       to gracefully handle already-added tables.

DO $$
DECLARE
  v_tables TEXT[] := ARRAY[
    'schools',
    'subscriptions',
    'payments',
    'attendance',
    'fees',
    'leave_requests',
    'announcements',
    'admissions',
    'support_tickets'
  ];
  v_t TEXT;
BEGIN
  FOREACH v_t IN ARRAY v_tables
  LOOP
    EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS %I', v_t);
  END LOOP;
END;
$$;

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- 33. Additional performance indexes beyond FK/status indexes declared above

-- Full-text search support for schools
CREATE INDEX IF NOT EXISTS idx_schools_name_trgm ON schools USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_schools_code_trgm ON schools USING GIN (code gin_trgm_ops);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_schools_status_created ON schools(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_school_status ON subscriptions(school_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_school_status_created ON payments(school_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_school_role ON profiles(school_id, role);
CREATE INDEX IF NOT EXISTS idx_students_school_status ON students(school_id, status);
CREATE INDEX IF NOT EXISTS idx_teachers_school_status ON teachers(school_id, status);
CREATE INDEX IF NOT EXISTS idx_attendance_school_date ON attendance(school_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_fees_school_status_due ON fees(school_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_school_status ON leave_requests(school_id, status);
CREATE INDEX IF NOT EXISTS idx_admissions_school_status ON admissions(school_id, status);

-- Scheduling / calendar lookups
CREATE INDEX IF NOT EXISTS idx_attendance_school_user_date ON attendance(school_id, user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_fees_student_status ON fees(student_id, status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_applicant_status ON leave_requests(applicant_id, status);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
