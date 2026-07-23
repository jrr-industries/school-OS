import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDevSession } from '@/lib/dev-session';
import { ChatService } from '@/features/chat/services/chat.service';

export async function GET(request: NextRequest) {
  const session = await getDevSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'conversations';
  const conversationId = searchParams.get('conversationId');

  try {
    if (type === 'users') {
      const users = await ChatService.getAvailableUsers(session);
      return NextResponse.json({ success: true, data: users });
    }

    if (type === 'messages' && conversationId) {
      const messages = await ChatService.getMessages(session, conversationId);
      return NextResponse.json({ success: true, data: messages });
    }

    const conversations = await ChatService.getConversations(session);
    return NextResponse.json({ success: true, data: conversations });
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

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create-conversation') {
      const conversation = await ChatService.createConversation(session, {
        participantId: body.participantId,
        title: body.title,
      });
      return NextResponse.json({ success: true, data: conversation });
    }

    if (action === 'send-message') {
      const message = await ChatService.sendMessage(session, {
        conversationId: body.conversationId,
        content: body.content,
        messageType: body.messageType,
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        fileSize: body.fileSize,
        replyToId: body.replyToId,
      });
      return NextResponse.json({ success: true, data: message });
    }

    if (action === 'mark-read') {
      await ChatService.markAsRead(session, body.conversationId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process chat action';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
