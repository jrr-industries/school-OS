import { prisma } from '@schoolos/database';
import type { DevSession } from '@/features/auth/types';

export async function getUserWithRoles(userIdOrSession: string | DevSession) {
  if (typeof userIdOrSession === 'object') {
    return getOrCreateUserBySession(userIdOrSession);
  }
  const user = await prisma.user.findUnique({
    where: { id: userIdOrSession },
    select: {
      id: true,
      schoolId: true,
      isSuperAdmin: true,
      userRoles: {
        select: { role: { select: { slug: true } } },
      },
    },
  });
  if (!user) return null;
  return mapUser(user);
}

const SESSION_ROLE_TO_SLUG: Record<string, string> = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'admin',
  PRINCIPAL: 'principal',
  VICE_PRINCIPAL: 'vice_principal',
  TEACHER: 'teacher',
  PARENT: 'parent',
  STUDENT: 'student',
};

async function getOrCreateUserBySession(session: DevSession) {
  const existing = await prisma.user.findUnique({
    where: { email: session.email },
    select: {
      id: true,
      schoolId: true,
      isSuperAdmin: true,
      userRoles: { select: { role: { select: { slug: true } } } },
    },
  });
  if (existing) return mapUser(existing);

  const schoolId =
    session.schoolId ||
    (await prisma.school
      .findFirst({ where: { deletedAt: null }, select: { id: true } })
      .then((s) => s?.id));
  if (!schoolId) return null;

  const roleSlug = SESSION_ROLE_TO_SLUG[session.role];
  const role = roleSlug
    ? await prisma.role.findFirst({ where: { schoolId, slug: roleSlug } })
    : null;

  const created = await prisma.user.create({
    data: {
      schoolId,
      email: session.email,
      name: session.name,
      status: 'active',
      isSuperAdmin: session.role === 'SUPER_ADMIN',
      ...(role ? { userRoles: { create: { roleId: role.id, schoolId } } } : {}),
    },
    select: {
      id: true,
      schoolId: true,
      isSuperAdmin: true,
      userRoles: { select: { role: { select: { slug: true } } } },
    },
  });
  return mapUser(created);
}

function mapUser(user: {
  id: string;
  schoolId: string;
  isSuperAdmin: boolean;
  userRoles: { role: { slug: string } }[];
}) {
  return {
    id: user.id,
    schoolId: user.schoolId,
    isSuperAdmin: user.isSuperAdmin,
    roles: user.userRoles.map((r) => ({ role: { slug: r.role.slug } })),
  };
}
