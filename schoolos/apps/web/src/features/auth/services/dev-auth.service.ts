// ============================================================
// Temporary Development Authentication - Auth Service
// This will be replaced with Supabase Auth / JWT in production
// ============================================================

import type { DevSession, DevLoginInput } from '../types';

const DEV_EMAIL = 'admin@schoolos.dev';
const DEV_PASSWORD = 'Admin@123';

export class DevAuthService {
  async login(input: DevLoginInput): Promise<DevSession> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Development authentication is only available in development mode');
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (input.email !== DEV_EMAIL || input.password !== DEV_PASSWORD) {
      throw new Error('Invalid email or password');
    }

    const session: DevSession = {
      id: 'dev-super-admin-001',
      email: DEV_EMAIL,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      authenticated: true,
    };

    return session;
  }

  async getSession(): Promise<DevSession | null> {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    try {
      const { getDevSession } = await import('@/lib/dev-session');
      return getDevSession();
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    const { destroyDevSession } = await import('@/lib/dev-session');
    destroyDevSession();
  }
}
