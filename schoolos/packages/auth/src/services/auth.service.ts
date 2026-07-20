import { prisma } from '@schoolos/database';
import { createSupabaseAdminClient } from '../supabase';
import { SessionService } from './session.service';
import type { AuthResult, LoginParams, RegisterParams } from '../types';
import { Logger } from '@schoolos/utils';

export class AuthService {
  private readonly sessionService: SessionService;

  constructor() {
    this.sessionService = new SessionService();
  }

  async login(params: LoginParams): Promise<AuthResult> {
    const { email, password, ipAddress, userAgent } = params;

    const supabase = createSupabaseAdminClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      Logger.error('AuthService', 'Login failed', authError);
      throw new Error(authError.message);
    }

    if (!authData.user || !authData.session) {
      throw new Error('Authentication failed');
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found in the system');
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active. Please contact your administrator.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const roles = user.userRoles.map((ur) => ur.role.slug);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.slug),
        ),
      ),
    ];

    const session = await this.sessionService.createSession({
      userId: user.id,
      schoolId: user.schoolId,
      token: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt: new Date(authData.session.expires_at! * 1000),
      ipAddress,
      userAgent,
    });

    Logger.info('AuthService', `User ${user.email} logged in successfully`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        schoolId: user.schoolId,
        roles,
        permissions,
      },
      session: {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: new Date(authData.session.expires_at! * 1000),
      },
    };
  }

  async register(params: RegisterParams): Promise<AuthResult> {
    const { email, password, name, schoolId, ipAddress, userAgent } = params;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }

    const supabase = createSupabaseAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) {
      Logger.error('AuthService', 'Registration failed', authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    const defaultRole = await prisma.role.findFirst({
      where: { schoolId, slug: schoolId ? 'teacher' : 'super_admin', isSystem: true },
    });

    const user = await prisma.user.create({
      data: {
        email,
        name,
        schoolId: schoolId ?? '',
        isSuperAdmin: !schoolId,
        profile: {
          create: {
            schoolId: schoolId ?? '',
          },
        },
        userRoles: defaultRole
          ? {
              create: {
                roleId: defaultRole.id,
                schoolId: schoolId ?? '',
              },
            }
          : undefined,
      },
      include: {
        userRoles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });

    const roles = user.userRoles.map((ur) => ur.role.slug);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.slug),
        ),
      ),
    ];

    Logger.info('AuthService', `User ${user.email} registered successfully`);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        schoolId: user.schoolId,
        roles,
        permissions,
      },
      session: {
        accessToken: '',
        refreshToken: '',
        expiresAt: new Date(),
      },
    };
  }

  async logout(userId: string, sessionId?: string): Promise<void> {
    const supabase = createSupabaseAdminClient();
    await supabase.auth.admin.signOut(userId);

    if (sessionId) {
      await this.sessionService.revokeSession(sessionId);
    }

    Logger.info('AuthService', `User ${userId} logged out`);
  }

  async refreshSession(refreshToken: string): Promise<AuthResult> {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      throw new Error('Failed to refresh session');
    }

    const user = await prisma.user.findUnique({
      where: { id: data.user.id },
      include: {
        userRoles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const roles = user.userRoles.map((ur) => ur.role.slug);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.permissions.map((rp) => rp.permission.slug),
        ),
      ),
    ];

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        schoolId: user.schoolId,
        roles,
        permissions,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: new Date(data.session.expires_at! * 1000),
      },
    };
  }
}
