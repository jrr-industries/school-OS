import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';
import { canMessage } from '@/features/chat/permissions/chat-permissions';
import { getUserWithRoles } from '@/features/chat/permissions/get-user-roles';
import { resolveDevUser } from '@/lib/chat-utils';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Dev only' }, { status: 403 });
  }
  const session = await getDevSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const sender = await getUserWithRoles(session);
  if (!sender) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  const me = await resolveDevUser(session);
  if (!me) return NextResponse.json({ success: false, error: 'User not found in DB' }, { status: 404 });

  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        status: 'active',
        id: { not: me.id },
        ...(sender.isSuperAdmin ? { isSuperAdmin: false } : { schoolId: sender.schoolId }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isSuperAdmin: true,
        schoolId: true,
        school: { select: { name: true, slug: true } },
        userRoles: { select: { role: { select: { slug: true } } } },
      },
      orderBy: { name: 'asc' },
    });

    const mapped = users.map((u) => ({
      ...u,
      role: u.isSuperAdmin ? ('SUPER_ADMIN' as const) : ('SCHOOL_ADMIN' as const),
      canMessage: canMessage(
        sender,
        { id: u.id, schoolId: u.schoolId, isSuperAdmin: u.isSuperAdmin, roles: u.userRoles },
      ).allowed,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}