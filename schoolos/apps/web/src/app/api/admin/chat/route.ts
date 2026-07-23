import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDevSession } from '@/lib/dev-session';
import { getUserWithRoles } from '@/features/chat/permissions/get-user-roles';
import { canMessage, canViewConversation } from '@/features/chat/permissions/chat-permissions';
import { prisma } from '@schoolos/database';
import { ChatService } from '@/features/chat/services/chat.service';

async function getAuthUser() {
  const session = await getDevSession();
  if (!session?.authenticated) return null;
  return getUserWithRoles(session);
}

export async function GET(request: NextRequest) {
  const session = await getDevSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'conversations';
  const conversationId = searchParams.get('conversationId');

  try {
    if (type === 'me') {
      return NextResponse.json({ success: true, data: user });
    }

    if (type === 'users') {
      const allUsers = await prisma.user.findMany({
        where: { deletedAt: null, ...(user.isSuperAdmin ? { isSuperAdmin: false } : { schoolId: user.schoolId }) },
        select: {
          id: true, name: true, email: true, avatar: true, isSuperAdmin: true, schoolId: true,
          school: { select: { name: true, slug: true } },
          userRoles: { select: { role: { select: { slug: true } } } },
        },
        orderBy: { name: 'asc' },
        take: 50,
      });
      return NextResponse.json({ success: true, data: allUsers });
    }

    if (type === 'messages' && conversationId) {
      const conv = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
        select: { id: true, schoolId: true, participants: { where: { leftAt: null }, select: { userId: true, leftAt: true } } },
      });
      if (!conv) {
        return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
      }
      const viewCheck = canViewConversation(user, conv as any);
      if (!viewCheck.allowed) {
        return NextResponse.json({ success: false, error: viewCheck.reason }, { status: 403 });
      }
      const messages = await ChatService.getMessages(session, conversationId);
      return NextResponse.json({ success: true, data: messages });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch chat data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getDevSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create-conversation') {
      const targetUser = await getUserWithRoles(body.participantId);
      if (!targetUser) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      const messageCheck = canMessage(user, targetUser);
      if (!messageCheck.allowed) {
        return NextResponse.json({ success: false, error: messageCheck.reason }, { status: 403 });
      }

      const conversation = await ChatService.createConversation(session, {
        participantId: body.participantId,
        title: body.title,
      });
      return NextResponse.json({ success: true, data: conversation });
    }

    const getConv = async (id: string) => {
      const c = await prisma.chatConversation.findUnique({
        where: { id },
        select: { id: true, schoolId: true, participants: { where: { leftAt: null }, select: { userId: true, leftAt: true } } },
      });
      return c;
    };

    if (action === 'send-message') {
      const conv = await getConv(body.conversationId);
      if (!conv) {
        return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
      }
      const viewCheck = canViewConversation(user, conv as any);
      if (!viewCheck.allowed) {
        return NextResponse.json({ success: false, error: viewCheck.reason }, { status: 403 });
      }

      const message = await ChatService.sendMessage(session, {
        conversationId: body.conversationId,
        content: body.content,
        messageType: body.messageType,
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        fileSize: body.fileSize,
        fileId: body.fileId,
        replyToId: body.replyToId,
      });
      return NextResponse.json({ success: true, data: message });
    }

    if (action === 'mark-read') {
      const conv = await getConv(body.conversationId);
      if (!conv) {
        return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
      }
      const viewCheck = canViewConversation(user, conv as any);
      if (!viewCheck.allowed) {
        return NextResponse.json({ success: false, error: viewCheck.reason }, { status: 403 });
      }

      await ChatService.markAsRead(session, body.conversationId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process chat action';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
