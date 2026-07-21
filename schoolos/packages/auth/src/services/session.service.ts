import { prisma } from '@schoolos/database';

interface CreateSessionParams {
  userId: string;
  schoolId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class SessionService {
  async createSession(params: CreateSessionParams): Promise<{ id: string }> {
    const session = await prisma.session.create({
      data: {
        userId: params.userId,
        schoolId: params.schoolId,
        token: params.token,
        refreshToken: params.refreshToken,
        expiresAt: params.expiresAt,
        refreshExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        lastActiveAt: new Date(),
      },
    });

    return { id: session.id };
  }

  async validateSession(token: string): Promise<{
    valid: boolean;
    userId?: string;
    schoolId?: string;
    sessionId?: string;
  }> {
    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session) return { valid: false };
    if (session.isRevoked) return { valid: false };
    if (session.expiresAt < new Date()) return { valid: false };
    if (session.deletedAt) return { valid: false };

    await prisma.session.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    });

    return {
      valid: true,
      userId: session.userId,
      schoolId: session.schoolId,
      sessionId: session.id,
    };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
    await prisma.session.updateMany({
      where: {
        userId,
        isRevoked: false,
        ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await prisma.session.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });

    return result.count;
  }
}
