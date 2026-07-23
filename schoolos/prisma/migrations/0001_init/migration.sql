node.exe : npm warn Unknown project config "shamefully-hoist". This will stop working in the next major version of 
npm. See `npm help npmrc` for supported config options.
At line:1 char:1
+ & "C:\Program Files\nodejs/node.exe" "C:\Program Files\nodejs/node_mo ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (npm warn Unknow...config options.:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 
npm warn Unknown project config "strict-peer-dependencies". This will stop working in the next major version of npm. 
See `npm help npmrc` for supported config options.
npm warn Unknown project config "auto-install-peers". This will stop working in the next major version of npm. See 
`npm help npmrc` for supported config options.
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('active', 'inactive', 'suspended', 'closed', 'trial');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('primary', 'secondary', 'higher_secondary', 'k12', 'preschool', 'vocational', 'special_education');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended', 'invited', 'disabled');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'inactive', 'past_due', 'cancelled', 'expired', 'trial');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('info', 'success', 'warning', 'error', 'alert');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('system', 'attendance', 'grade', 'fee', 'communication', 'schedule', 'security');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'export', 'import', 'approve', 'reject', 'view', 'promote', 'transfer', 'archive', 'restore');

-- CreateEnum
CREATE TYPE "AuditEntity" AS ENUM ('user', 'school', 'role', 'permission', 'subscription', 'attendance', 'fee', 'grade', 'schedule', 'setting', 'api_key', 'file', 'student', 'parent', 'class', 'section', 'subject', 'campus', 'department', 'academic_year', 'admission', 'promotion', 'transfer');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('a_positive', 'a_negative', 'b_positive', 'b_negative', 'ab_positive', 'ab_negative', 'o_positive', 'o_negative');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('active', 'inactive', 'transferred', 'graduated', 'alumni', 'archived', 'suspended', 'expelled', 'withdrawn');

-- CreateEnum
CREATE TYPE "GuardianRelationship" AS ENUM ('father', 'mother', 'guardian', 'grandfather', 'grandmother', 'uncle', 'aunt', 'sibling', 'other');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('permanent', 'communication', 'current');

-- CreateEnum
CREATE TYPE "TermType" AS ENUM ('semester', 'trimester', 'quarter', 'term');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('theory', 'practical', 'language', 'elective', 'optional', 'compulsory');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('promoted', 'demoted', 'repeated', 'skipped');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image', 'video', 'pdf', 'word', 'excel', 'powerpoint', 'zip', 'voice', 'audio', 'document', 'system', 'announcement');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('pending', 'sending', 'sent', 'delivered', 'seen', 'failed');

-- CreateEnum
CREATE TYPE "AnnouncementTarget" AS ENUM ('all_schools', 'specific_school', 'multiple_schools');

-- CreateEnum
CREATE TYPE "AnnouncementStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('birth_certificate', 'transfer_certificate', 'community_certificate', 'income_certificate', 'medical_certificate', 'passport', 'aadhar', 'mark_sheet', 'photo', 'signature', 'other');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('active', 'inactive', 'suspended', 'resigned', 'terminated');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time', 'contract', 'temporary', 'intern', 'volunteer');

-- CreateTable
CREATE TABLE "schools" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(200),
    "type" "SchoolType" NOT NULL,
    "curriculum" VARCHAR(50),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postalCode" VARCHAR(20),
    "phone" VARCHAR(20),
    "email" VARCHAR(200),
    "website" VARCHAR(200),
    "establishedYear" INTEGER,
    "status" "SchoolStatus" NOT NULL DEFAULT 'trial',
    "logo" TEXT,
    "settings" JSONB DEFAULT '{}',
    "features" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "interval" VARCHAR(20) NOT NULL DEFAULT 'monthly',
    "maxStudents" INTEGER NOT NULL DEFAULT 100,
    "maxTeachers" INTEGER NOT NULL DEFAULT 10,
    "maxStorageGB" INTEGER NOT NULL DEFAULT 1,
    "features" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'trial',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "trial_ends_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "paymentMethod" VARCHAR(50),
    "paymentReference" VARCHAR(200),
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "email" CITEXT NOT NULL,
    "phone" VARCHAR(20),
    "name" VARCHAR(200) NOT NULL,
    "avatar" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "email_verified_at" TIMESTAMP(3),
    "phone_verified_at" TIMESTAMP(3),
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "postalCode" VARCHAR(20),
    "timezone" VARCHAR(50) DEFAULT 'UTC',
    "locale" VARCHAR(10) DEFAULT 'en',
    "bio" TEXT,
    "socialLinks" JSONB DEFAULT '{}',
    "emergencyContact" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "school_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "group" VARCHAR(50) NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "location" VARCHAR(200),
    "device_type" VARCHAR(50),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "refresh_expires_at" TIMESTAMP(3),
    "last_active_at" TIMESTAMP(3),
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "user_id" UUID,
    "action" "AuditAction" NOT NULL,
    "entity" "AuditEntity" NOT NULL,
    "entity_id" UUID,
    "description" TEXT,
    "changes" JSONB DEFAULT '{}',
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "user_id" UUID,
    "type" "NotificationType" NOT NULL DEFAULT 'info',
    "category" "NotificationCategory" NOT NULL DEFAULT 'system',
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT,
    "link" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_conversations" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_message_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_conversation_participants" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'member',
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_read_at" TIMESTAMP(3),
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),

    CONSTRAINT "chat_conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "message_type" "MessageType" NOT NULL DEFAULT 'text',
    "message_status" "MessageStatus" NOT NULL DEFAULT 'sent',
    "file_url" TEXT,
    "file_name" VARCHAR(255),
    "file_size" INTEGER,
    "file_id" UUID,
    "reply_to_id" UUID,
    "forwarded_from_id" UUID,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "is_forwarded" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB DEFAULT '{}',
    "edited_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_message_reactions" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "emoji" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_message_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_starred_messages" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_starred_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reads" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_pinned_conversations" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_pinned_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_archived_conversations" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_archived_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "school_id" UUID,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT,
    "target" "AnnouncementTarget" NOT NULL DEFAULT 'all_schools',
    "target_school_ids" JSONB DEFAULT '[]',
    "status" "AnnouncementStatus" NOT NULL DEFAULT 'published',
    "priority" VARCHAR(20) NOT NULL DEFAULT 'normal',
    "attachment_url" TEXT,
    "attachment_name" VARCHAR(255),
    "attachment_size" INTEGER,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_receipts" (
    "id" UUID NOT NULL,
    "announcement_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "key" VARCHAR(200) NOT NULL,
    "value" JSONB NOT NULL,
    "group" VARCHAR(50) NOT NULL DEFAULT 'general',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "key" VARCHAR(200) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "key" TEXT NOT NULL,
    "prefix" VARCHAR(10) NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "ip_whitelist" TEXT,
    "rate_limit" INTEGER DEFAULT 100,
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "level" VARCHAR(20) NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "source" VARCHAR(200),
    "stack" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "user_id" UUID,
    "name" VARCHAR(500) NOT NULL,
    "original_name" VARCHAR(500) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "bucket" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "alt_text" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_terms" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "TermType" NOT NULL DEFAULT 'term',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "academic_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campuses" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "phone" VARCHAR(20),
    "email" VARCHAR(200),
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "campuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "campus_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(20),
    "floors" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "building_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "floor" INTEGER NOT NULL DEFAULT 0,
    "capacity" INTEGER NOT NULL DEFAULT 30,
    "roomType" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(20),
    "description" TEXT,
    "head_user_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_groups" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(20),
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "subject_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "department_id" UUID,
    "group_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "type" "SubjectType" NOT NULL DEFAULT 'compulsory',
    "credit_hours" INTEGER NOT NULL DEFAULT 0,
    "max_marks" INTEGER NOT NULL DEFAULT 100,
    "pass_marks" INTEGER NOT NULL DEFAULT 35,
    "is_language" BOOLEAN NOT NULL DEFAULT false,
    "is_optional" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_categories" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_houses" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "color" VARCHAR(20),
    "motto" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_houses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_sources" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "admission_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "academic_year_id" UUID NOT NULL,
    "campus_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "description" TEXT,
    "max_capacity" INTEGER NOT NULL DEFAULT 40,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "max_capacity" INTEGER NOT NULL DEFAULT 40,
    "room_id" UUID,
    "class_teacher_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "campus_id" UUID,
    "class_id" UUID,
    "section_id" UUID,
    "academic_year_id" UUID,
    "category_id" UUID,
    "house_id" UUID,
    "admission_source_id" UUID,
    "admission_number" VARCHAR(50) NOT NULL,
    "roll_number" VARCHAR(20),
    "emis_number" VARCHAR(50),
    "udise_number" VARCHAR(50),
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "last_name" VARCHAR(100) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "blood_group" "BloodGroup",
    "religion" VARCHAR(50),
    "nationality" VARCHAR(50) DEFAULT 'Indian',
    "mother_tongue" VARCHAR(50),
    "caste" VARCHAR(50),
    "community" VARCHAR(50),
    "aadhar_number" VARCHAR(20),
    "passport_number" VARCHAR(20),
    "ssn_number" VARCHAR(20),
    "photo" TEXT,
    "signature" TEXT,
    "height" DECIMAL(5,2),
    "weight" DECIMAL(5,2),
    "status" "StudentStatus" NOT NULL DEFAULT 'active',
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "archive_reason" TEXT,
    "archived_at" TIMESTAMP(3),
    "admission_date" TIMESTAMP(3) NOT NULL,
    "leaving_date" TIMESTAMP(3),
    "leaving_reason" TEXT,
    "is_scholarship" BOOLEAN NOT NULL DEFAULT false,
    "scholarship_details" TEXT,
    "special_needs" TEXT,
    "medical_notes" TEXT,
    "profile_complete" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_documents" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "file_id" UUID,
    "file_url" TEXT,
    "mime_type" VARCHAR(100),
    "file_size" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" UUID,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "student_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_medical" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "blood_group" "BloodGroup",
    "height" DECIMAL(5,2),
    "weight" DECIMAL(5,2),
    "allergies" TEXT,
    "medical_conditions" TEXT,
    "medications" TEXT,
    "immunizations" JSONB DEFAULT '[]',
    "disabilities" TEXT,
    "special_needs" TEXT,
    "emergency_notes" TEXT,
    "doctor_name" VARCHAR(100),
    "doctor_phone" VARCHAR(20),
    "insurance_provider" VARCHAR(100),
    "insurance_number" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_medical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_addresses" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "type" "AddressType" NOT NULL,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "landmark" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_guardians" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "parent_id" UUID,
    "relationship" "GuardianRelationship" NOT NULL,
    "is_emergency" BOOLEAN NOT NULL DEFAULT false,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(200),
    "phone" VARCHAR(20) NOT NULL,
    "alternate_phone" VARCHAR(20),
    "occupation" VARCHAR(100),
    "education" VARCHAR(100),
    "income" DECIMAL(12,2),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "photo" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_guardians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "user_id" UUID,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(200),
    "phone" VARCHAR(20) NOT NULL,
    "alternate_phone" VARCHAR(20),
    "occupation" VARCHAR(100),
    "education" VARCHAR(100),
    "income" DECIMAL(12,2),
    "photo" TEXT,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_students" (
    "id" UUID NOT NULL,
    "parent_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "relationship" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "alternate_phone" VARCHAR(20),
    "email" VARCHAR(200),
    "address" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_previous_schools" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "previous_school" VARCHAR(200) NOT NULL,
    "previous_class" VARCHAR(100),
    "previous_board" VARCHAR(100),
    "passed_out_year" INTEGER,
    "percentage" DECIMAL(5,2),
    "reason_for_leaving" TEXT,
    "transfer_certificate" TEXT,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_previous_schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_promotions" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "from_class_id" UUID NOT NULL,
    "to_class_id" UUID NOT NULL,
    "from_section_id" UUID,
    "to_section_id" UUID,
    "academic_year_id" UUID NOT NULL,
    "status" "PromotionStatus" NOT NULL DEFAULT 'promoted',
    "remarks" TEXT,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_transfers" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "from_school_id" UUID NOT NULL,
    "to_school_name" VARCHAR(200) NOT NULL,
    "to_school_address" TEXT,
    "reason" TEXT NOT NULL,
    "transfer_date" TIMESTAMP(3) NOT NULL,
    "transfer_certificate" TEXT,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "student_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_archives" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "archived_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archived_by" UUID NOT NULL,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "department_id" UUID,
    "hierarchy_level" INTEGER NOT NULL DEFAULT 0,
    "is_teaching" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "user_id" UUID,
    "designation_id" UUID NOT NULL,
    "department_id" UUID,
    "employee_id" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(200),
    "phone" VARCHAR(20),
    "alternate_phone" VARCHAR(20),
    "gender" "Gender",
    "date_of_birth" TIMESTAMP(3),
    "blood_group" "BloodGroup",
    "photo" TEXT,
    "signature" TEXT,
    "qualification" TEXT,
    "experience" INTEGER DEFAULT 0,
    "joining_date" TIMESTAMP(3),
    "leaving_date" TIMESTAMP(3),
    "leaving_reason" TEXT,
    "employment_type" "EmploymentType" NOT NULL DEFAULT 'full_time',
    "status" "EmployeeStatus" NOT NULL DEFAULT 'active',
    "is_class_teacher" BOOLEAN NOT NULL DEFAULT false,
    "emergency_contact" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_documents" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "file_id" UUID,
    "file_url" TEXT,
    "mimeType" VARCHAR(100),
    "file_size" INTEGER,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" UUID,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "employee_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_addresses" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "type" "AddressType" NOT NULL,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "landmark" TEXT,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "employee_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_emergency_contacts" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "school_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "relationship" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "alternate_phone" VARCHAR(20),
    "email" VARCHAR(200),
    "address" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "employee_emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schools_slug_key" ON "schools"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "schools_domain_key" ON "schools"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_slug_key" ON "subscription_plans"("slug");

-- CreateIndex
CREATE INDEX "subscriptions_school_id_idx" ON "subscriptions"("school_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_school_id_plan_id_key" ON "subscriptions"("school_id", "plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_school_id_idx" ON "users"("school_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_school_id_idx" ON "profiles"("school_id");

-- CreateIndex
CREATE INDEX "roles_school_id_idx" ON "roles"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_school_id_slug_key" ON "roles"("school_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");

-- CreateIndex
CREATE INDEX "permissions_slug_idx" ON "permissions"("slug");

-- CreateIndex
CREATE INDEX "permissions_group_idx" ON "permissions"("group");

-- CreateIndex
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions"("role_id");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE INDEX "user_roles_school_id_idx" ON "user_roles"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_key" ON "sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "sessions_school_id_idx" ON "sessions"("school_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "audit_logs_school_id_idx" ON "audit_logs"("school_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_entity_id_idx" ON "audit_logs"("entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "notifications_school_id_idx" ON "notifications"("school_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "chat_conversations_school_id_idx" ON "chat_conversations"("school_id");

-- CreateIndex
CREATE INDEX "chat_conversations_updated_at_idx" ON "chat_conversations"("updated_at");

-- CreateIndex
CREATE INDEX "chat_conversations_last_message_at_idx" ON "chat_conversations"("last_message_at");

-- CreateIndex
CREATE INDEX "chat_conversation_participants_user_id_idx" ON "chat_conversation_participants"("user_id");

-- CreateIndex
CREATE INDEX "chat_conversation_participants_conversation_id_idx" ON "chat_conversation_participants"("conversation_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_conversation_participants_conversation_id_user_id_key" ON "chat_conversation_participants"("conversation_id", "user_id");

-- CreateIndex
CREATE INDEX "chat_messages_conversation_id_created_at_idx" ON "chat_messages"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "chat_messages_sender_id_idx" ON "chat_messages"("sender_id");

-- CreateIndex
CREATE INDEX "chat_messages_message_status_idx" ON "chat_messages"("message_status");

-- CreateIndex
CREATE INDEX "chat_message_reactions_message_id_idx" ON "chat_message_reactions"("message_id");

-- CreateIndex
CREATE INDEX "chat_message_reactions_user_id_idx" ON "chat_message_reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_message_reactions_message_id_user_id_emoji_key" ON "chat_message_reactions"("message_id", "user_id", "emoji");

-- CreateIndex
CREATE INDEX "chat_starred_messages_message_id_idx" ON "chat_starred_messages"("message_id");

-- CreateIndex
CREATE INDEX "chat_starred_messages_user_id_idx" ON "chat_starred_messages"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_starred_messages_message_id_user_id_key" ON "chat_starred_messages"("message_id", "user_id");

-- CreateIndex
CREATE INDEX "message_reads_message_id_idx" ON "message_reads"("message_id");

-- CreateIndex
CREATE INDEX "message_reads_user_id_idx" ON "message_reads"("user_id");

-- CreateIndex
CREATE INDEX "message_reads_conversation_id_idx" ON "message_reads"("conversation_id");

-- CreateIndex
CREATE UNIQUE INDEX "message_reads_message_id_user_id_key" ON "message_reads"("message_id", "user_id");

-- CreateIndex
CREATE INDEX "chat_pinned_conversations_user_id_idx" ON "chat_pinned_conversations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_pinned_conversations_conversation_id_user_id_key" ON "chat_pinned_conversations"("conversation_id", "user_id");

-- CreateIndex
CREATE INDEX "chat_archived_conversations_user_id_idx" ON "chat_archived_conversations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_archived_conversations_conversation_id_user_id_key" ON "chat_archived_conversations"("conversation_id", "user_id");

-- CreateIndex
CREATE INDEX "announcements_school_id_idx" ON "announcements"("school_id");

-- CreateIndex
CREATE INDEX "announcements_status_idx" ON "announcements"("status");

-- CreateIndex
CREATE INDEX "announcements_created_at_idx" ON "announcements"("created_at");

-- CreateIndex
CREATE INDEX "announcement_receipts_announcement_id_idx" ON "announcement_receipts"("announcement_id");

-- CreateIndex
CREATE INDEX "announcement_receipts_user_id_idx" ON "announcement_receipts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_receipts_announcement_id_user_id_key" ON "announcement_receipts"("announcement_id", "user_id");

-- CreateIndex
CREATE INDEX "settings_school_id_idx" ON "settings"("school_id");

-- CreateIndex
CREATE INDEX "settings_key_idx" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "settings_school_id_key_key" ON "settings"("school_id", "key");

-- CreateIndex
CREATE INDEX "feature_flags_school_id_idx" ON "feature_flags"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_school_id_key_key" ON "feature_flags"("school_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "api_keys_school_id_idx" ON "api_keys"("school_id");

-- CreateIndex
CREATE INDEX "api_keys_key_idx" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "system_logs_school_id_idx" ON "system_logs"("school_id");

-- CreateIndex
CREATE INDEX "system_logs_level_idx" ON "system_logs"("level");

-- CreateIndex
CREATE INDEX "system_logs_created_at_idx" ON "system_logs"("created_at");

-- CreateIndex
CREATE INDEX "files_school_id_idx" ON "files"("school_id");

-- CreateIndex
CREATE INDEX "files_user_id_idx" ON "files"("user_id");

-- CreateIndex
CREATE INDEX "files_category_idx" ON "files"("category");

-- CreateIndex
CREATE INDEX "files_bucket_idx" ON "files"("bucket");

-- CreateIndex
CREATE INDEX "academic_years_school_id_idx" ON "academic_years"("school_id");

-- CreateIndex
CREATE INDEX "academic_years_is_current_idx" ON "academic_years"("is_current");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_school_id_name_key" ON "academic_years"("school_id", "name");

-- CreateIndex
CREATE INDEX "academic_terms_school_id_idx" ON "academic_terms"("school_id");

-- CreateIndex
CREATE INDEX "academic_terms_academic_year_id_idx" ON "academic_terms"("academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_terms_academic_year_id_name_key" ON "academic_terms"("academic_year_id", "name");

-- CreateIndex
CREATE INDEX "campuses_school_id_idx" ON "campuses"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "campuses_school_id_name_key" ON "campuses"("school_id", "name");

-- CreateIndex
CREATE INDEX "buildings_school_id_idx" ON "buildings"("school_id");

-- CreateIndex
CREATE INDEX "buildings_campus_id_idx" ON "buildings"("campus_id");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_campus_id_name_key" ON "buildings"("campus_id", "name");

-- CreateIndex
CREATE INDEX "rooms_school_id_idx" ON "rooms"("school_id");

-- CreateIndex
CREATE INDEX "rooms_building_id_idx" ON "rooms"("building_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_building_id_name_key" ON "rooms"("building_id", "name");

-- CreateIndex
CREATE INDEX "departments_school_id_idx" ON "departments"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_school_id_name_key" ON "departments"("school_id", "name");

-- CreateIndex
CREATE INDEX "subject_groups_school_id_idx" ON "subject_groups"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_groups_school_id_name_key" ON "subject_groups"("school_id", "name");

-- CreateIndex
CREATE INDEX "subjects_school_id_idx" ON "subjects"("school_id");

-- CreateIndex
CREATE INDEX "subjects_department_id_idx" ON "subjects"("department_id");

-- CreateIndex
CREATE INDEX "subjects_group_id_idx" ON "subjects"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_school_id_code_key" ON "subjects"("school_id", "code");

-- CreateIndex
CREATE INDEX "student_categories_school_id_idx" ON "student_categories"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_categories_school_id_name_key" ON "student_categories"("school_id", "name");

-- CreateIndex
CREATE INDEX "student_houses_school_id_idx" ON "student_houses"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_houses_school_id_name_key" ON "student_houses"("school_id", "name");

-- CreateIndex
CREATE INDEX "admission_sources_school_id_idx" ON "admission_sources"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "admission_sources_school_id_name_key" ON "admission_sources"("school_id", "name");

-- CreateIndex
CREATE INDEX "classes_school_id_idx" ON "classes"("school_id");

-- CreateIndex
CREATE INDEX "classes_academic_year_id_idx" ON "classes"("academic_year_id");

-- CreateIndex
CREATE INDEX "classes_campus_id_idx" ON "classes"("campus_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_academic_year_id_name_key" ON "classes"("academic_year_id", "name");

-- CreateIndex
CREATE INDEX "sections_class_id_idx" ON "sections"("class_id");

-- CreateIndex
CREATE INDEX "sections_school_id_idx" ON "sections"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "sections_class_id_name_key" ON "sections"("class_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "students_admission_number_key" ON "students"("admission_number");

-- CreateIndex
CREATE INDEX "students_school_id_idx" ON "students"("school_id");

-- CreateIndex
CREATE INDEX "students_campus_id_idx" ON "students"("campus_id");

-- CreateIndex
CREATE INDEX "students_class_id_idx" ON "students"("class_id");

-- CreateIndex
CREATE INDEX "students_section_id_idx" ON "students"("section_id");

-- CreateIndex
CREATE INDEX "students_academic_year_id_idx" ON "students"("academic_year_id");

-- CreateIndex
CREATE INDEX "students_status_idx" ON "students"("status");

-- CreateIndex
CREATE INDEX "students_admission_number_idx" ON "students"("admission_number");

-- CreateIndex
CREATE INDEX "students_roll_number_idx" ON "students"("roll_number");

-- CreateIndex
CREATE INDEX "students_first_name_last_name_idx" ON "students"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "student_documents_student_id_idx" ON "student_documents"("student_id");

-- CreateIndex
CREATE INDEX "student_documents_school_id_idx" ON "student_documents"("school_id");

-- CreateIndex
CREATE INDEX "student_documents_category_idx" ON "student_documents"("category");

-- CreateIndex
CREATE UNIQUE INDEX "student_medical_student_id_key" ON "student_medical"("student_id");

-- CreateIndex
CREATE INDEX "student_medical_student_id_idx" ON "student_medical"("student_id");

-- CreateIndex
CREATE INDEX "student_medical_school_id_idx" ON "student_medical"("school_id");

-- CreateIndex
CREATE INDEX "student_addresses_student_id_idx" ON "student_addresses"("student_id");

-- CreateIndex
CREATE INDEX "student_addresses_school_id_idx" ON "student_addresses"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_addresses_student_id_type_key" ON "student_addresses"("student_id", "type");

-- CreateIndex
CREATE INDEX "student_guardians_student_id_idx" ON "student_guardians"("student_id");

-- CreateIndex
CREATE INDEX "student_guardians_parent_id_idx" ON "student_guardians"("parent_id");

-- CreateIndex
CREATE INDEX "student_guardians_school_id_idx" ON "student_guardians"("school_id");

-- CreateIndex
CREATE INDEX "parents_school_id_idx" ON "parents"("school_id");

-- CreateIndex
CREATE INDEX "parents_email_idx" ON "parents"("email");

-- CreateIndex
CREATE INDEX "parents_phone_idx" ON "parents"("phone");

-- CreateIndex
CREATE INDEX "parent_students_parent_id_idx" ON "parent_students"("parent_id");

-- CreateIndex
CREATE INDEX "parent_students_student_id_idx" ON "parent_students"("student_id");

-- CreateIndex
CREATE INDEX "parent_students_school_id_idx" ON "parent_students"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "parent_students_parent_id_student_id_key" ON "parent_students"("parent_id", "student_id");

-- CreateIndex
CREATE INDEX "emergency_contacts_student_id_idx" ON "emergency_contacts"("student_id");

-- CreateIndex
CREATE INDEX "emergency_contacts_school_id_idx" ON "emergency_contacts"("school_id");

-- CreateIndex
CREATE INDEX "student_previous_schools_student_id_idx" ON "student_previous_schools"("student_id");

-- CreateIndex
CREATE INDEX "student_previous_schools_school_id_idx" ON "student_previous_schools"("school_id");

-- CreateIndex
CREATE INDEX "student_promotions_student_id_idx" ON "student_promotions"("student_id");

-- CreateIndex
CREATE INDEX "student_promotions_school_id_idx" ON "student_promotions"("school_id");

-- CreateIndex
CREATE INDEX "student_promotions_from_class_id_idx" ON "student_promotions"("from_class_id");

-- CreateIndex
CREATE INDEX "student_promotions_to_class_id_idx" ON "student_promotions"("to_class_id");

-- CreateIndex
CREATE INDEX "student_promotions_academic_year_id_idx" ON "student_promotions"("academic_year_id");

-- CreateIndex
CREATE INDEX "student_transfers_student_id_idx" ON "student_transfers"("student_id");

-- CreateIndex
CREATE INDEX "student_transfers_school_id_idx" ON "student_transfers"("school_id");

-- CreateIndex
CREATE INDEX "student_transfers_transfer_date_idx" ON "student_transfers"("transfer_date");

-- CreateIndex
CREATE INDEX "student_archives_student_id_idx" ON "student_archives"("student_id");

-- CreateIndex
CREATE INDEX "student_archives_school_id_idx" ON "student_archives"("school_id");

-- CreateIndex
CREATE INDEX "student_archives_archived_at_idx" ON "student_archives"("archived_at");

-- CreateIndex
CREATE INDEX "designations_school_id_idx" ON "designations"("school_id");

-- CreateIndex
CREATE INDEX "designations_department_id_idx" ON "designations"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "designations_school_id_slug_key" ON "designations"("school_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_id_key" ON "employees"("employee_id");

-- CreateIndex
CREATE INDEX "employees_school_id_idx" ON "employees"("school_id");

-- CreateIndex
CREATE INDEX "employees_designation_id_idx" ON "employees"("designation_id");

-- CreateIndex
CREATE INDEX "employees_department_id_idx" ON "employees"("department_id");

-- CreateIndex
CREATE INDEX "employees_status_idx" ON "employees"("status");

-- CreateIndex
CREATE INDEX "employees_first_name_last_name_idx" ON "employees"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "employee_documents_employee_id_idx" ON "employee_documents"("employee_id");

-- CreateIndex
CREATE INDEX "employee_documents_school_id_idx" ON "employee_documents"("school_id");

-- CreateIndex
CREATE INDEX "employee_documents_category_idx" ON "employee_documents"("category");

-- CreateIndex
CREATE INDEX "employee_addresses_employee_id_idx" ON "employee_addresses"("employee_id");

-- CreateIndex
CREATE INDEX "employee_addresses_school_id_idx" ON "employee_addresses"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_addresses_employee_id_type_key" ON "employee_addresses"("employee_id", "type");

-- CreateIndex
CREATE INDEX "employee_emergency_contacts_employee_id_idx" ON "employee_emergency_contacts"("employee_id");

-- CreateIndex
CREATE INDEX "employee_emergency_contacts_school_id_idx" ON "employee_emergency_contacts"("school_id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_conversation_participants" ADD CONSTRAINT "chat_conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_conversation_participants" ADD CONSTRAINT "chat_conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_forwarded_from_id_fkey" FOREIGN KEY ("forwarded_from_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message_reactions" ADD CONSTRAINT "chat_message_reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message_reactions" ADD CONSTRAINT "chat_message_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_starred_messages" ADD CONSTRAINT "chat_starred_messages_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_starred_messages" ADD CONSTRAINT "chat_starred_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_pinned_conversations" ADD CONSTRAINT "chat_pinned_conversations_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_pinned_conversations" ADD CONSTRAINT "chat_pinned_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_archived_conversations" ADD CONSTRAINT "chat_archived_conversations_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_archived_conversations" ADD CONSTRAINT "chat_archived_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_receipts" ADD CONSTRAINT "announcement_receipts_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_receipts" ADD CONSTRAINT "announcement_receipts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "academic_years_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_terms" ADD CONSTRAINT "academic_terms_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_terms" ADD CONSTRAINT "academic_terms_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campuses" ADD CONSTRAINT "campuses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "campuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_groups" ADD CONSTRAINT "subject_groups_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "subject_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_categories" ADD CONSTRAINT "student_categories_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_houses" ADD CONSTRAINT "student_houses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admission_sources" ADD CONSTRAINT "admission_sources_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "campuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "campuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "student_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "student_houses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_admission_source_id_fkey" FOREIGN KEY ("admission_source_id") REFERENCES "admission_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_medical" ADD CONSTRAINT "student_medical_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_addresses" ADD CONSTRAINT "student_addresses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "student_guardians_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "student_guardians_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_previous_schools" ADD CONSTRAINT "student_previous_schools_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_promotions" ADD CONSTRAINT "student_promotions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_promotions" ADD CONSTRAINT "student_promotions_from_class_id_fkey" FOREIGN KEY ("from_class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_promotions" ADD CONSTRAINT "student_promotions_to_class_id_fkey" FOREIGN KEY ("to_class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transfers" ADD CONSTRAINT "student_transfers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_archives" ADD CONSTRAINT "student_archives_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designations" ADD CONSTRAINT "designations_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designations" ADD CONSTRAINT "designations_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_addresses" ADD CONSTRAINT "employee_addresses_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_addresses" ADD CONSTRAINT "employee_addresses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_emergency_contacts" ADD CONSTRAINT "employee_emergency_contacts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_emergency_contacts" ADD CONSTRAINT "employee_emergency_contacts_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

