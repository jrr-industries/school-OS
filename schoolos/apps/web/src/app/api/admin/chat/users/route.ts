import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';
import { canChat } from '@/lib/communication-matrix';
import { resolveDevUser } from '@/lib/chat-utils';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Dev only' }, { status: 403 });
  }
  const session = await getDevSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await resolveDevUser(session);
  if (!user) return NextResponse.json({ success: false, error: 'User not found in DB' }, { status: 404 });

  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        status: 'active',
        id: { not: user.id },
      },
      select: {
        id: true,
        name: true,
        email: true,
        isSuperAdmin: true,
        schoolId: true,
        school: { select: { name: true, slug: true } },
      },
      orderBy: { name: 'asc' },
    });

    const mapped = users.map((u) => ({
      ...u,
      role: u.isSuperAdmin ? 'SUPER_ADMIN' as const : 'SCHOOL_ADMIN' as const,
      canChat: canChat(session.role as any, (u.isSuperAdmin ? 'SUPER_ADMIN' : 'SCHOOL_ADMIN') as any),
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
