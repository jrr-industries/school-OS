// ============================================================
// Temporary Development Authentication - Auth Service
// This will be replaced with Supabase Auth / JWT in production
// ============================================================

import type { DevSession, DevLoginInput } from '../types';
import { prisma } from '@schoolos/database';

const DEV_EMAIL = 'admin@schoolos.dev';
const DEV_PASSWORD = 'Admin@123';

export class DevAuthService {
  async login(input: DevLoginInput): Promise<DevSession> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Development authentication is only available in development mode');
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (input.email === DEV_EMAIL && input.password === DEV_PASSWORD) {
      return {
        id: 'dev-super-admin-001',
        email: DEV_EMAIL,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        permissions: ['*'],
        authenticated: true,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        userRoles: { include: { role: true } },
        school: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new Error('Invalid email or password');
    }

    if (input.password !== DEV_PASSWORD) {
      throw new Error('Invalid email or password');
    }

    const schoolAdminRole = user.userRoles.find(
      (ur) => ur.role.slug === 'school_admin',
    );

    if (!schoolAdminRole) {
      throw new Error('You do not have access to this platform');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'SCHOOL_ADMIN',
      schoolId: user.schoolId,
      schoolName: user.school.name,
      permissions: ['*'],
      authenticated: true,
    };
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