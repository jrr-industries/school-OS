import { prisma } from '@schoolos/database';
import type { DevSession } from '@/features/auth/types';

const SESSION_ROLE_TO_SLUG: Record<string, string> = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'admin',
  PRINCIPAL: 'principal',
  VICE_PRINCIPAL: 'vice_principal',
  TEACHER: 'teacher',
  PARENT: 'parent',
  STUDENT: 'student',
};

export async function resolveDevUser(session: DevSession): Promise<{ id: string } | null> {
  try {
    const existing = await prisma.user.findUnique({ where: { email: session.email } });
    if (existing) return { id: existing.id };

    const schoolId = session.schoolId || await prisma.school.findFirst({ where: { deletedAt: null }, select: { id: true } }).then((s) => s?.id);
    if (!schoolId) return null;

    const roleSlug = SESSION_ROLE_TO_SLUG[session.role];
    const role = roleSlug
      ? await prisma.role.findFirst({ where: { schoolId, slug: roleSlug } })
      : null;

    const user = await prisma.user.create({
      data: {
        schoolId,
        email: session.email,
        name: session.name,
        status: 'active',
        isSuperAdmin: session.role === 'SUPER_ADMIN',
        ...(role ? { userRoles: { create: { roleId: role.id, schoolId } } } : {}),
      },
    });
    return { id: user.id };
  } catch {
    return null;
  }
}
