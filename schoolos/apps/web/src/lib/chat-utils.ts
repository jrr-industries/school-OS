import { prisma } from '@schoolos/database';
import type { DevSession } from '@/features/auth/types';

export async function resolveDevUser(session: DevSession): Promise<{ id: string } | null> {
  try {
    const existing = await prisma.user.findUnique({ where: { email: session.email } });
    if (existing) return { id: existing.id };

    const schoolId = session.schoolId || await prisma.school.findFirst({ where: { deletedAt: null }, select: { id: true } }).then((s) => s?.id);
    if (!schoolId) return null;

    const user = await prisma.user.create({
      data: {
        schoolId,
        email: session.email,
        name: session.name,
        status: 'active',
        isSuperAdmin: session.role === 'SUPER_ADMIN',
      },
    });
    return { id: user.id };
  } catch {
    return null;
  }
}
