// ============================================================
// Temporary Development Authentication - Types
// This will be replaced with Supabase Auth / JWT in production
// ============================================================

export interface DevSession {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN';
  permissions: ['*'];
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
