import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';
import { resolveDevUser } from '@/lib/chat-utils';

export async function GET() {
  const session = await getDevSession();
  if (!session || !session.schoolId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await resolveDevUser(session);
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  const users = await prisma.user.findMany({
    where: {
      schoolId: session.schoolId,
      id: { not: user.id },
      deletedAt: null,
      status: 'active',
    },
    select: {
      id: true, name: true, email: true, avatar: true, isSuperAdmin: true,
      userRoles: {
        select: { role: { select: { slug: true, name: true } } },
      },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ success: true, data: users });
}
