import { prisma } from '@schoolos/database';
import type { Prisma } from '@prisma/client';
import type { DevSession } from '@/features/auth/types';
import type {
  Conversation,
  ChatMessage,
  SendMessagePayload,
  CreateConversationPayload,
  CreateAnnouncementPayload,
  Announcement,
  MessageType,
} from '../types';

const messageInclude = {
  sender: { select: { id: true, name: true, email: true, avatar: true } },
  replyTo: {
    include: { sender: { select: { id: true, name: true, email: true, avatar: true } } },
  },
  readReceipts: {
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
  },
} as const;

const conversationInclude = {
  participants: {
    include: { user: { select: { id: true, name: true, email: true, avatar: true, isSuperAdmin: true } } },
  },
  messages: {
    orderBy: { createdAt: 'desc' as const },
    take: 1,
    include: { sender: { select: { id: true, name: true, email: true, avatar: true } } },
  },
} as const;

type MessageRecord = Prisma.ChatMessageGetPayload<{ include: typeof messageInclude }>;
type ConversationRecord = Prisma.ChatConversationGetPayload<{ include: typeof conversationInclude }>;

function mapSender(user: { id: string; name: string; email: string; avatar?: string | null }) {
  return { id: user.id, name: user.name, email: user.email, avatar: user.avatar ?? null };
}

function mapMessage(m: MessageRecord): ChatMessage {
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    content: m.content,
    messageType: m.messageType as MessageType,
    fileUrl: m.fileUrl,
    fileName: m.fileName,
    fileSize: m.fileSize,
    replyToId: m.replyToId,
    replyTo: m.replyTo
      ? {
          id: m.replyTo.id,
          conversationId: m.replyTo.conversationId,
          senderId: m.replyTo.senderId,
          content: m.replyTo.content,
          messageType: m.replyTo.messageType as MessageType,
          fileUrl: m.replyTo.fileUrl,
          fileName: m.replyTo.fileName,
          fileSize: m.replyTo.fileSize,
          replyToId: m.replyTo.replyToId,
          replyTo: null,
          editedAt: m.replyTo.editedAt?.toISOString() ?? null,
          deletedAt: m.replyTo.deletedAt?.toISOString() ?? null,
          createdAt: m.replyTo.createdAt.toISOString(),
          updatedAt: m.replyTo.updatedAt.toISOString(),
          sender: mapSender(m.replyTo.sender),
          readReceipts: [],
        }
      : null,
    editedAt: m.editedAt?.toISOString() ?? null,
    deletedAt: m.deletedAt?.toISOString() ?? null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
    sender: mapSender(m.sender),
    readReceipts: m.readReceipts.map((r) => ({
      id: r.id,
      messageId: r.messageId,
      userId: r.userId,
      readAt: r.readAt.toISOString(),
    })),
  };
}

function mapConversation(c: ConversationRecord): Conversation {
  return {
    id: c.id,
    schoolId: c.schoolId,
    title: c.title,
    isGroup: c.isGroup,
    isPinned: c.isPinned,
    isArchived: c.isArchived,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    participants: c.participants.map((p) => ({
      id: p.id,
      userId: p.userId,
      lastReadAt: p.lastReadAt?.toISOString() ?? null,
      joinedAt: p.joinedAt.toISOString(),
      leftAt: p.leftAt?.toISOString() ?? null,
      user: { ...mapSender(p.user), isSuperAdmin: p.user.isSuperAdmin },
    })),
    messages: c.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      messageType: m.messageType as MessageType,
      fileUrl: m.fileUrl,
      fileName: m.fileName,
      fileSize: m.fileSize,
      replyToId: m.replyToId,
      replyTo: null,
      editedAt: m.editedAt?.toISOString() ?? null,
      deletedAt: m.deletedAt?.toISOString() ?? null,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      sender: mapSender(m.sender),
      readReceipts: [],
    })),
    unreadCount: 0,
  };
}

export class ChatService {
  static async getSessionUser(session: DevSession) {
    const user = await prisma.user.findUnique({ where: { email: session.email } });
    if (!user) throw new Error('User not found');
    return user;
  }

  static async getConversations(session: DevSession): Promise<Conversation[]> {
    const user = await this.getSessionUser(session);
    const conversations = await prisma.chatConversation.findMany({
      where: {
        deletedAt: null,
        participants: { some: { userId: user.id, leftAt: null } },
      },
      include: conversationInclude,
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map(mapConversation);
  }

  static async getMessages(session: DevSession, conversationId: string): Promise<ChatMessage[]> {
    const user = await this.getSessionUser(session);
    const isParticipant = await prisma.chatConversationParticipant.findFirst({
      where: { conversationId, userId: user.id, leftAt: null },
    });
    if (!isParticipant && !user.isSuperAdmin) throw new Error('Access denied');

    const messages = await prisma.chatMessage.findMany({
      where: { conversationId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 50,
      include: messageInclude,
    });

    return messages.map(mapMessage);
  }

  static async sendMessage(session: DevSession, payload: SendMessagePayload): Promise<ChatMessage> {
    const user = await this.getSessionUser(session);
    const isParticipant = await prisma.chatConversationParticipant.findFirst({
      where: { conversationId: payload.conversationId, userId: user.id, leftAt: null },
    });
    if (!isParticipant && !user.isSuperAdmin) throw new Error('Not a participant');

    const message = await prisma.chatMessage.create({
      data: {
        conversationId: payload.conversationId,
        senderId: user.id,
        content: payload.content,
        messageType: (payload.messageType ?? 'text') as any,
        fileUrl: payload.fileUrl,
        fileName: payload.fileName,
        fileSize: payload.fileSize,
        replyToId: payload.replyToId,
      },
      include: messageInclude,
    });

    await prisma.chatConversation.update({
      where: { id: payload.conversationId },
      data: { updatedAt: new Date() },
    });

    await prisma.chatConversationParticipant.updateMany({
      where: { conversationId: payload.conversationId, userId: user.id },
      data: { lastReadAt: new Date() },
    });

    return mapMessage(message);
  }

  static async createConversation(session: DevSession, payload: CreateConversationPayload): Promise<Conversation> {
    const user = await this.getSessionUser(session);
    const existing = await prisma.chatConversation.findFirst({
      where: {
        isGroup: false,
        deletedAt: null,
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: payload.participantId } } },
        ],
      },
      include: conversationInclude,
    });

    if (existing) return mapConversation(existing);

    const conversation = await prisma.chatConversation.create({
      data: {
        schoolId: user.schoolId,
        title: payload.title,
        participants: {
          create: [
            { userId: user.id },
            { userId: payload.participantId },
          ],
        },
      },
      include: conversationInclude,
    });

    return mapConversation(conversation);
  }

  static async markAsRead(session: DevSession, conversationId: string): Promise<void> {
    const user = await this.getSessionUser(session);
    const unreadMessages = await prisma.chatMessage.findMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        deletedAt: null,
        readReceipts: { none: { userId: user.id } },
      },
      select: { id: true },
    });

    if (unreadMessages.length === 0) return;

    await prisma.messageRead.createMany({
      data: unreadMessages.map((m) => ({
        messageId: m.id,
        userId: user.id,
        conversationId,
      })),
      skipDuplicates: true,
    });

    await prisma.chatConversationParticipant.updateMany({
      where: { conversationId, userId: user.id },
      data: { lastReadAt: new Date() },
    });
  }

  static async getAvailableUsers(session: DevSession) {
    const user = await this.getSessionUser(session);
    if (user.isSuperAdmin) {
      const schoolAdmins = await prisma.user.findMany({
        where: {
          deletedAt: null,
          isSuperAdmin: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          isSuperAdmin: true,
          schoolId: true,
          school: { select: { name: true, slug: true } },
        },
        take: 50,
      });

      return schoolAdmins.map((u) => ({
        ...u,
        role: 'SCHOOL_ADMIN',
      }));
    }

    const superAdmins = await prisma.user.findMany({
      where: {
        deletedAt: null,
        isSuperAdmin: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isSuperAdmin: true,
        schoolId: true,
        school: { select: { name: true, slug: true } },
      },
      take: 10,
    });

    return superAdmins.map((u) => ({
      ...u,
      role: 'SUPER_ADMIN',
    }));
  }

  static async createAnnouncement(session: DevSession, payload: CreateAnnouncementPayload): Promise<Announcement> {
    const user = await this.getSessionUser(session);
    if (!user.isSuperAdmin) throw new Error('Only super admins can create announcements');

    const announcement = await prisma.announcement.create({
      data: {
        title: payload.title,
        content: payload.content,
        target: payload.target as any,
        targetSchoolIds: payload.targetSchoolIds ? JSON.stringify(payload.targetSchoolIds) : '[]',
        priority: payload.priority ?? 'normal',
        createdById: user.id,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    return {
      id: announcement.id,
      schoolId: announcement.schoolId,
      title: announcement.title,
      content: announcement.content,
      target: announcement.target as Announcement['target'],
      targetSchoolIds: JSON.parse(announcement.targetSchoolIds as string ?? '[]'),
      status: announcement.status as Announcement['status'],
      priority: announcement.priority,
      createdById: announcement.createdById,
      createdBy: mapSender(announcement.createdBy),
      createdAt: announcement.createdAt.toISOString(),
      updatedAt: announcement.updatedAt.toISOString(),
    };
  }

  static async getAnnouncements(session: DevSession): Promise<Announcement[]> {
    await this.getSessionUser(session);
    const announcements = await prisma.announcement.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        createdBy: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    return announcements.map((a) => ({
      id: a.id,
      schoolId: a.schoolId,
      title: a.title,
      content: a.content,
      target: a.target as Announcement['target'],
      targetSchoolIds: JSON.parse(a.targetSchoolIds as string ?? '[]'),
      status: a.status as Announcement['status'],
      priority: a.priority,
      createdById: a.createdById,
      createdBy: mapSender(a.createdBy),
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));
  }
}
