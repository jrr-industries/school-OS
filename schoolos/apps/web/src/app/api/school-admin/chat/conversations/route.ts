import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';
import { resolveDevUser } from '@/lib/chat-utils';

export async function GET() {
  const session = await getDevSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await resolveDevUser(session);
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  const conversations = await prisma.chatConversation.findMany({
    where: {
      participants: { some: { userId: user.id, leftAt: null } },
      deletedAt: null,
    },
    include: {
      participants: {
        where: { leftAt: null },
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { sender: { select: { id: true, name: true } } },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: conversations });
}

export async function POST(request: Request) {
  const session = await getDevSession();
  if (!session || !session.schoolId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await resolveDevUser(session);
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  const { participantId } = await request.json();
  if (!participantId) return NextResponse.json({ success: false, error: 'participantId required' }, { status: 400 });

  const existing = await prisma.chatConversation.findFirst({
    where: {
      isGroup: false, deletedAt: null,
      AND: [
        { participants: { some: { userId: user.id, leftAt: null } } },
        { participants: { some: { userId: participantId, leftAt: null } } },
      ],
    },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      messages: {
        orderBy: { createdAt: 'desc' }, take: 1,
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });

  if (existing) return NextResponse.json({ success: true, data: existing });

  const targetUser = await prisma.user.findUnique({
    where: { id: participantId },
    select: { id: true, schoolId: true },
  });
  if (!targetUser) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  const conversation = await prisma.chatConversation.create({
    data: {
      schoolId: targetUser.schoolId,
      participants: { create: [{ userId: user.id }, { userId: participantId }] },
    },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      messages: {
        orderBy: { createdAt: 'desc' }, take: 1,
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });

  return NextResponse.json({ success: true, data: conversation }, { status: 201 });
}
