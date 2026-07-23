import { prisma } from '../client';
import type { Prisma } from '@prisma/client';

const participantWithUser = {
  user: { select: { id: true, name: true, email: true, avatar: true, isSuperAdmin: true } },
} as const;

const messageInclude = {
  sender: { select: { id: true, name: true, email: true, avatar: true } },
  replyTo: { include: { sender: { select: { id: true, name: true, email: true, avatar: true } } } },
  forwardedFrom: { select: { id: true, content: true, senderId: true, createdAt: true, sender: { select: { id: true, name: true } } } },
  file: { select: { id: true, name: true, originalName: true, mimeType: true, size: true, path: true, bucket: true } },
  readReceipts: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
  reactions: { include: { user: { select: { id: true, name: true, avatar: true } } } },
  starredBy: { where: { userId: '' }, take: 1, select: { id: true } },
} as const;

export class ChatRepository {
  // ─── Conversations ───────────────────────────────────────────

  static async getConversations(userId: string, schoolId: string) {
    const pinnedIds = await prisma.chatPinnedConversation.findMany({
      where: { userId },
      select: { conversationId: true },
    });
    const pinnedSet = new Set(pinnedIds.map((p) => p.conversationId));
    const archivedIds = await prisma.chatArchivedConversation.findMany({
      where: { userId },
      select: { conversationId: true },
    });
    const archivedSet = new Set(archivedIds.map((a) => a.conversationId));

    const participants = await prisma.chatConversationParticipant.findMany({
      where: { userId, leftAt: null },
      include: {
        conversation: {
          include: {
            participants: { where: { leftAt: null }, include: participantWithUser },
            messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { sender: { select: { id: true, name: true, avatar: true } } } },
          },
        },
      },
      orderBy: { conversation: { lastMessageAt: 'desc' } },
    });

    const unreadCounts = await this.getUnreadCounts(userId);

    return participants
      .filter((p) => !p.conversation.deletedAt)
      .map((p) => ({
        ...p.conversation,
        isPinned: pinnedSet.has(p.conversationId),
        isArchived: archivedSet.has(p.conversationId),
        participantMeta: p,
        unreadCount: unreadCounts.get(p.conversationId) ?? 0,
      }));
  }

  static async getUnreadCounts(userId: string): Promise<Map<string, number>> {
    const participants = await prisma.chatConversationParticipant.findMany({
      where: { userId, leftAt: null },
      select: { conversationId: true, lastReadAt: true },
    });
    const counts = new Map<string, number>();
    for (const p of participants) {
      const count = await prisma.chatMessage.count({
        where: {
          conversationId: p.conversationId,
          senderId: { not: userId },
          deletedAt: null,
          createdAt: { gt: p.lastReadAt ?? new Date(0) },
          readReceipts: { none: { userId } },
        },
      });
      counts.set(p.conversationId, count);
    }
    return counts;
  }

  static async findOrCreateConversation(schoolId: string, userIds: string[], title?: string) {
    if (userIds.length === 2) {
      const existing = await prisma.chatConversation.findFirst({
        where: {
          isGroup: false,
          deletedAt: null,
          AND: [
            { participants: { some: { userId: userIds[0], leftAt: null } } },
            { participants: { some: { userId: userIds[1], leftAt: null } } },
          ],
        },
        include: { participants: { where: { leftAt: null }, include: participantWithUser } },
      });
      if (existing) return existing;
    }
    return prisma.chatConversation.create({
      data: {
        schoolId,
        title,
        isGroup: userIds.length > 2,
        participants: { create: userIds.map((userId) => ({ userId })) },
      },
      include: { participants: { where: { leftAt: null }, include: participantWithUser } },
    });
  }

  // ─── Messages ────────────────────────────────────────────────

  static async getMessages(conversationId: string, cursor?: string, limit = 30) {
    const where: Prisma.ChatMessageWhereInput = { conversationId, deletedAt: null };
    if (cursor) {
      const cursorMsg = await prisma.chatMessage.findUnique({ where: { id: cursor }, select: { createdAt: true } });
      if (cursorMsg) where.createdAt = { lt: cursorMsg.createdAt };
    }
    return prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: {
        ...messageInclude,
        starredBy: { where: { userId: '' }, take: 0, select: { id: true } },
      },
    });
  }

  static async sendMessage(data: {
    conversationId: string;
    senderId: string;
    content: string;
    messageType?: string;
    messageStatus?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileId?: string;
    replyToId?: string;
    forwardedFromId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const message = await prisma.chatMessage.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        messageType: (data.messageType ?? 'text') as any,
        messageStatus: (data.messageStatus ?? 'sent') as any,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileId: data.fileId,
        replyToId: data.replyToId,
        forwardedFromId: data.forwardedFromId,
        isForwarded: !!data.forwardedFromId,
        metadata: data.metadata ?? {},
      },
      include: messageInclude,
    });
    await prisma.chatConversation.update({
      where: { id: data.conversationId },
      data: { lastMessageAt: new Date(), updatedAt: new Date() },
    });
    await prisma.chatConversationParticipant.updateMany({
      where: { conversationId: data.conversationId, userId: data.senderId },
      data: { lastReadAt: new Date() },
    });
    return message;
  }

  static async editMessage(messageId: string, content: string) {
    return prisma.chatMessage.update({
      where: { id: messageId },
      data: { content, isEdited: true, editedAt: new Date() },
      include: messageInclude,
    });
  }

  static async deleteMessage(messageId: string, forEveryone = false) {
    if (forEveryone) {
      return prisma.chatMessage.update({ where: { id: messageId }, data: { deletedAt: new Date(), content: '' } });
    }
    return prisma.chatMessage.update({ where: { id: messageId }, data: { deletedAt: new Date() } });
  }

  // ─── Reactions ───────────────────────────────────────────────

  static async toggleReaction(messageId: string, userId: string, emoji: string) {
    const existing = await prisma.chatMessageReaction.findUnique({
      where: { messageId_userId_emoji: { messageId, userId, emoji } },
    });
    if (existing) {
      await prisma.chatMessageReaction.delete({ where: { id: existing.id } });
      return null;
    }
    return prisma.chatMessageReaction.create({ data: { messageId, userId, emoji }, include: { user: { select: { id: true, name: true, avatar: true } } } });
  }

  // ─── Read Receipts ───────────────────────────────────────────

  static async markAsRead(conversationId: string, userId: string) {
    const unread = await prisma.chatMessage.findMany({
      where: {
        conversationId,
        senderId: { not: userId },
        deletedAt: null,
        readReceipts: { none: { userId } },
      },
      select: { id: true },
    });
    if (unread.length === 0) return 0;
    await prisma.messageRead.createMany({
      data: unread.map((m) => ({ messageId: m.id, userId, conversationId })),
      skipDuplicates: true,
    });
    await prisma.chatConversationParticipant.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: new Date() },
    });
    return unread.length;
  }

  // ─── Star ────────────────────────────────────────────────────

  static async toggleStar(messageId: string, userId: string) {
    const existing = await prisma.chatStarredMessage.findUnique({
      where: { messageId_userId: { messageId, userId } },
    });
    if (existing) {
      await prisma.chatStarredMessage.delete({ where: { id: existing.id } });
      return false;
    }
    await prisma.chatStarredMessage.create({ data: { messageId, userId } });
    return true;
  }

  static async getStarredMessages(userId: string) {
    return prisma.chatStarredMessage.findMany({
      where: { userId },
      include: {
        message: {
          include: {
            conversation: { select: { id: true, title: true } },
            sender: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  // ─── Pin / Archive ───────────────────────────────────────────

  static async togglePin(conversationId: string, userId: string) {
    const existing = await prisma.chatPinnedConversation.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (existing) {
      await prisma.chatPinnedConversation.delete({ where: { id: existing.id } });
      return false;
    }
    await prisma.chatPinnedConversation.create({ data: { conversationId, userId } });
    return true;
  }

  static async toggleArchive(conversationId: string, userId: string) {
    const existing = await prisma.chatArchivedConversation.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (existing) {
      await prisma.chatArchivedConversation.delete({ where: { id: existing.id } });
      return false;
    }
    await prisma.chatArchivedConversation.create({ data: { conversationId, userId } });
    return true;
  }

  // ─── Search ──────────────────────────────────────────────────

  static async searchConversations(userId: string, query: string) {
    return prisma.chatConversation.findMany({
      where: {
        deletedAt: null,
        participants: { some: { userId, leftAt: null } },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { participants: { some: { user: { name: { contains: query, mode: 'insensitive' } } } } },
        ],
      },
      include: {
        participants: { where: { leftAt: null }, include: participantWithUser },
        messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { sender: { select: { id: true, name: true } } } },
      },
      take: 20,
    });
  }

  static async searchMessages(userId: string, query: string, conversationId?: string) {
    const where: Prisma.ChatMessageWhereInput = {
      deletedAt: null,
      content: { contains: query, mode: 'insensitive' },
      conversation: { participants: { some: { userId, leftAt: null } } },
      ...(conversationId ? { conversationId } : {}),
    };
    return prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        conversation: { select: { id: true, title: true } },
      },
    });
  }

  // ─── Announcements ───────────────────────────────────────────

  static async createAnnouncement(data: {
    title: string;
    content?: string;
    target: string;
    targetSchoolIds?: string[];
    priority?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentSize?: number;
    createdById: string;
    schoolId?: string;
  }) {
    return prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        target: data.target as any,
        targetSchoolIds: data.targetSchoolIds ? JSON.stringify(data.targetSchoolIds) : '[]',
        priority: data.priority ?? 'normal',
        attachmentUrl: data.attachmentUrl,
        attachmentName: data.attachmentName,
        attachmentSize: data.attachmentSize,
        createdById: data.createdById,
        schoolId: data.schoolId,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true, avatar: true } },
        receipts: { take: 0, select: { id: true } },
      },
    });
  }

  static async getAnnouncements(userId: string, schoolId?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isSuperAdmin: true } });
    const where: Prisma.AnnouncementWhereInput = {
      deletedAt: null,
      status: 'published',
      ...(user?.isSuperAdmin ? {} : { schoolId: schoolId ?? undefined }),
    };
    return prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        createdBy: { select: { id: true, name: true, email: true, avatar: true } },
        receipts: { where: { userId }, select: { id: true, readAt: true } },
      },
    });
  }

  static async markAnnouncementRead(announcementId: string, userId: string) {
    return prisma.announcementReceipt.upsert({
      where: { announcementId_userId: { announcementId, userId } },
      update: { readAt: new Date() },
      create: { announcementId, userId },
    });
  }

  // ─── Mute ────────────────────────────────────────────────────

  static async toggleMute(conversationId: string, userId: string) {
    const participant = await prisma.chatConversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) return null;
    return prisma.chatConversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { isMuted: !participant.isMuted },
    });
  }

  // ─── Clear / Delete Conversation ─────────────────────────────

  static async clearConversation(conversationId: string, userId: string) {
    await prisma.chatMessage.updateMany({
      where: { conversationId, senderId: userId },
      data: { deletedAt: new Date() },
    });
    await prisma.chatConversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });
  }

  static async deleteConversationForUser(conversationId: string, userId: string) {
    await prisma.chatConversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { leftAt: new Date() },
    });
  }

  static async getAvailableUsers(currentUserId: string, schoolId: string, isSuperAdmin: boolean) {
    if (isSuperAdmin) {
      return prisma.user.findMany({
        where: { deletedAt: null, isSuperAdmin: false, schoolId },
        select: { id: true, name: true, email: true, avatar: true, isSuperAdmin: true, schoolId: true, school: { select: { name: true, slug: true } } },
        take: 50,
      });
    }
    const superAdmins = await prisma.user.findMany({
      where: { deletedAt: null, isSuperAdmin: true },
      select: { id: true, name: true, email: true, avatar: true, isSuperAdmin: true, schoolId: true, school: { select: { name: true, slug: true } } },
      take: 10,
    });
    return superAdmins;
  }
}
