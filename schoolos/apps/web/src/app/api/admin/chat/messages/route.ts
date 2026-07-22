import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';
import { resolveDevUser } from '@/lib/chat-utils';

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Dev only' }, { status: 403 });
  }
  const session = await getDevSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await resolveDevUser(session);
  if (!user) return NextResponse.json({ success: false, error: 'User not found in DB' }, { status: 404 });

  const url = new URL(request.url);
  const conversationId = url.searchParams.get('conversationId');
  if (!conversationId) {
    return NextResponse.json({ success: false, error: 'conversationId required' }, { status: 400 });
  }

  try {
    const participant = await prisma.chatConversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: user.id } },
    });
    if (!participant) {
      return NextResponse.json({ success: false, error: 'Not a participant' }, { status: 403 });
    }

    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);

    const [total, messages] = await Promise.all([
      prisma.chatMessage.count({ where: { conversationId, deletedAt: null } }),
      prisma.chatMessage.findMany({
        where: { conversationId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          sender: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: messages.reverse(),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Dev only' }, { status: 403 });
  }
  const session = await getDevSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await resolveDevUser(session);
  if (!user) return NextResponse.json({ success: false, error: 'User not found in DB' }, { status: 404 });

  try {
    const { conversationId, content } = await request.json();
    if (!conversationId || !content) {
      return NextResponse.json({ success: false, error: 'conversationId and content are required' }, { status: 400 });
    }

    const participant = await prisma.chatConversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: user.id } },
    });
    if (!participant) {
      return NextResponse.json({ success: false, error: 'Not a participant' }, { status: 403 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId,
        senderId: user.id,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
