import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';
import { resolveDevUser } from '@/lib/chat-utils';

export async function GET(request: Request) {
  const session = await getDevSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await resolveDevUser(session);
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  if (!conversationId) return NextResponse.json({ success: false, error: 'conversationId required' }, { status: 400 });

  const messages = await prisma.chatMessage.findMany({
    where: { conversationId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { id: true, name: true, email: true, avatar: true } } },
  });

  return NextResponse.json({ success: true, data: messages });
}
