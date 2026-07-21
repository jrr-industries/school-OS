// ============================================================
// Temporary Development Authentication - Types
// This will be replaced with Supabase Auth / JWT in production
// ============================================================

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STAFF' | 'PARENT' | 'STUDENT';

export interface DevSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  permissions: string[];
  authenticated: true;
}

export interface DevLoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface DevLoginResponse {
  success: boolean;
  error?: string;
}
