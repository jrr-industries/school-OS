import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';
import { getUserWithRoles } from '@/features/chat/permissions/get-user-roles';

export async function GET() {
  const session = await getDevSession();
  if (!session?.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserWithRoles(session);
  if (!user || !user.isSuperAdmin) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const schoolAdmins = await prisma.user.findMany({
      where: {
        deletedAt: null,
        status: 'active',
        isSuperAdmin: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        schoolId: true,
        school: { select: { id: true, name: true, slug: true, logo: true } },
        userRoles: { select: { role: { select: { slug: true } } } },
      },
      orderBy: { name: 'asc' },
    });

    const adminIds = schoolAdmins.map((a) => a.id);

    const existingConvs = await prisma.chatConversation.findMany({
      where: {
        isGroup: false,
        deletedAt: null,
        AND: [
          { participants: { some: { userId: user.id, leftAt: null } } },
          { participants: { some: { userId: { in: adminIds }, leftAt: null } } },
        ],
      },
      select: {
        id: true,
        schoolId: true,
        participants: {
          where: { leftAt: null },
          select: { userId: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, content: true, messageType: true, createdAt: true, senderId: true },
        },
      },
    });

    const convByAdminId: Record<string, { id: string; lastMessage: any; unreadCount: number }> = {};

    for (const conv of existingConvs) {
      const otherParticipant = conv.participants.find((p) => p.userId !== user.id);
      if (!otherParticipant) continue;

      const lastMessage = conv.messages[0] ?? null;

      const participant = await prisma.chatConversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId: conv.id, userId: user.id } },
        select: { lastReadAt: true },
      });

      let unreadCount = 0;
      if (participant?.lastReadAt && lastMessage) {
        const unread = await prisma.chatMessage.count({
          where: {
            conversationId: conv.id,
            senderId: { not: user.id },
            createdAt: { gt: participant.lastReadAt },
            deletedAt: null,
          },
        });
        unreadCount = unread;
      } else if (!participant?.lastReadAt && lastMessage) {
        unreadCount = await prisma.chatMessage.count({
          where: { conversationId: conv.id, senderId: { not: user.id }, deletedAt: null },
        });
      }

      convByAdminId[otherParticipant.userId] = { id: conv.id, lastMessage, unreadCount };
    }

    const data = schoolAdmins.map((admin) => {
      const conv = convByAdminId[admin.id];
      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        avatar: admin.avatar,
        schoolId: admin.schoolId,
        school: admin.school,
        conversationId: conv?.id ?? null,
        lastMessage: conv?.lastMessage ?? null,
        unreadCount: conv?.unreadCount ?? 0,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
