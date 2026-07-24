'use server';

import { getDevSession } from '@/lib/dev-session';
import { prisma } from '@schoolos/database';
import { ChatRepository } from '@schoolos/database/repositories/chat.repository';
import { getUserWithRoles } from '@/features/chat/permissions/get-user-roles';
import { canMessage, canViewConversation } from '@/features/chat/permissions/chat-permissions';
import type {
  Conversation,
  ChatMessage,
  SendMessagePayload,
  CreateAnnouncementPayload,
  Announcement,
  MessageReaction,
} from '../types';

async function authUser() {
  const session = await getDevSession();
  if (!session?.authenticated) throw new Error('Unauthorized');

  const user = await getUserWithRoles(session);
  if (!user) throw new Error('Unauthorized');

  return user;
}

async function assertCanViewConversation(user: any, conversationId: string) {
  const conversation = await prisma.chatConversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true, schoolId: true,
      participants: { where: { leftAt: null }, select: { userId: true, leftAt: true } },
    },
  });
  if (!conversation) throw new Error('Conversation not found');

  const check = canViewConversation(user, conversation as any);
  if (!check.allowed) throw new Error(check.reason ?? 'Access denied');

  return conversation;
}

function isSchoolAdmin(user: any): boolean {
  if (user.isSuperAdmin) return false;
  return user.roles?.some((r: any) =>
    ['admin', 'school_owner'].includes(r.role.slug),
  ) ?? false;
}

export async function getConversationsAction() {
  try {
    const user = await authUser();

    let raw: any[];
    if (user.isSuperAdmin) {
      const conversations = await prisma.chatConversation.findMany({
        where: { deletedAt: null },
        include: {
          participants: { where: { leftAt: null }, include: { user: { select: { id: true, name: true, email: true, avatar: true, isSuperAdmin: true } } } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { sender: { select: { id: true, name: true, avatar: true } } } },
        },
        orderBy: { lastMessageAt: 'desc' },
      });

      const pinnedIds = await prisma.chatPinnedConversation.findMany({ where: { userId: user.id }, select: { conversationId: true } });
      const pinnedSet = new Set(pinnedIds.map((p) => p.conversationId));
      const archivedIds = await prisma.chatArchivedConversation.findMany({ where: { userId: user.id }, select: { conversationId: true } });
      const archivedSet = new Set(archivedIds.map((a) => a.conversationId));

      raw = conversations.filter((c) => !c.deletedAt).map((c) => ({
        ...c,
        isPinned: pinnedSet.has(c.id),
        isArchived: archivedSet.has(c.id),
        isMuted: false,
        unreadCount: 0,
        participantMeta: { isMuted: false },
      }));
    } else if (isSchoolAdmin(user)) {
      const conversations = await ChatRepository.getAllSchoolConversations(user.schoolId, user.id);
      raw = conversations.map((c: any) => ({
        ...c,
        isMuted: false,
        participantMeta: { isMuted: false },
      }));
    } else {
      raw = await ChatRepository.getConversations(user.id, user.schoolId);
      raw = raw.map((c: any) => ({
        ...c,
        isMuted: c.participantMeta?.isMuted ?? false,
      }));
    }

    const data = raw as Conversation[];
    return { success: true as const, data };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getMessagesAction(conversationId: string, cursor?: string) {
  try {
    const user = await authUser();
    await assertCanViewConversation(user, conversationId);

    const limit = 30;
    const messages = await ChatRepository.getMessages(conversationId, cursor, limit);
    const hasMore = messages.length > limit;
    const data = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? data[data.length - 1]?.id : undefined;

    return { success: true as const, data: data as unknown as ChatMessage[], nextCursor };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendMessageAction(payload: SendMessagePayload) {
  try {
    const user = await authUser();
    await assertCanViewConversation(user, payload.conversationId);

    const data = await ChatRepository.sendMessage({
      conversationId: payload.conversationId,
      senderId: user.id,
      content: payload.content ?? '',
      messageType: payload.messageType || undefined,
      messageStatus: payload.messageStatus || undefined,
      fileUrl: payload.fileUrl || undefined,
      fileName: payload.fileName || undefined,
      fileSize: payload.fileSize || undefined,
      fileId: payload.fileId || undefined,
      replyToId: payload.replyToId || undefined,
      forwardedFromId: payload.forwardedFromId || undefined,
    });

    return { success: true as const, data: data as unknown as ChatMessage };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createConversationAction(participantId: string) {
  try {
    const user = await authUser();

    const targetUser = await getUserWithRoles(participantId);
    if (!targetUser) throw new Error('User not found');

    const check = canMessage(user, targetUser);
    if (!check.allowed) throw new Error(check.reason ?? 'Cannot message this user');

    const schoolId = user.isSuperAdmin ? targetUser.schoolId : user.schoolId;

    const data = await ChatRepository.findOrCreateConversation(schoolId, [user.id, participantId]);

    return { success: true as const, data: data as unknown as Conversation };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function markAsReadAction(conversationId: string) {
  try {
    const user = await authUser();
    await ChatRepository.markAsRead(conversationId, user.id);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function reactToMessageAction(messageId: string, emoji: string) {
  try {
    const user = await authUser();
    const data = await ChatRepository.toggleReaction(messageId, user.id, emoji);
    return { success: true as const, data: data as unknown as MessageReaction | null };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function editMessageAction(messageId: string, content: string) {
  try {
    const user = await authUser();

    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      select: { senderId: true },
    });

    if (!message) throw new Error('Message not found');
    if (message.senderId !== user.id) throw new Error('Can only edit your own messages');

    const data = await ChatRepository.editMessage(messageId, content);
    return { success: true as const, data: data as unknown as ChatMessage };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteMessageAction(messageId: string, forEveryone?: boolean) {
  try {
    const user = await authUser();

    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      select: { senderId: true },
    });

    if (!message) throw new Error('Message not found');
    if (message.senderId !== user.id) throw new Error('Can only delete your own messages');
    if (forEveryone && message.senderId !== user.id && !user.isSuperAdmin) {
      throw new Error('Only sender or super admin can delete for everyone');
    }

    await ChatRepository.deleteMessage(messageId, forEveryone);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function toggleStarAction(messageId: string) {
  try {
    const user = await authUser();
    const starred = await ChatRepository.toggleStar(messageId, user.id);
    return { success: true as const, starred };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function togglePinAction(conversationId: string) {
  try {
    const user = await authUser();
    await assertCanViewConversation(user, conversationId);
    const pinned = await ChatRepository.togglePin(conversationId, user.id);
    return { success: true as const, pinned };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function toggleArchiveAction(conversationId: string) {
  try {
    const user = await authUser();
    await assertCanViewConversation(user, conversationId);
    const archived = await ChatRepository.toggleArchive(conversationId, user.id);
    return { success: true as const, archived };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function toggleMuteAction(conversationId: string) {
  try {
    const user = await authUser();
    await assertCanViewConversation(user, conversationId);
    const muted = await ChatRepository.toggleMute(conversationId, user.id);
    return { success: true as const, muted: muted?.isMuted ?? false };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function searchConversationsAction(query: string) {
  try {
    const user = await authUser();

    if (user.isSuperAdmin) {
      const data = await prisma.chatConversation.findMany({
        where: {
          deletedAt: null,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { participants: { some: { user: { name: { contains: query, mode: 'insensitive' } } } } },
          ],
        },
        include: {
          participants: { where: { leftAt: null }, include: { user: { select: { id: true, name: true, email: true, avatar: true, isSuperAdmin: true } } } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { sender: { select: { id: true, name: true } } } },
        },
        take: 20,
      });
      return { success: true as const, data: data as unknown as Conversation[] };
    }

    if (isSchoolAdmin(user)) {
      const data = await prisma.chatConversation.findMany({
        where: {
          schoolId: user.schoolId,
          deletedAt: null,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { participants: { some: { user: { name: { contains: query, mode: 'insensitive' } } } } },
          ],
        },
        include: {
          participants: { where: { leftAt: null }, include: { user: { select: { id: true, name: true, email: true, avatar: true, isSuperAdmin: true } } } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { sender: { select: { id: true, name: true } } } },
        },
        take: 20,
      });
      return { success: true as const, data: data as unknown as Conversation[] };
    }

    const data = await ChatRepository.searchConversations(user.id, query);
    return { success: true as const, data: data as unknown as Conversation[] };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function searchMessagesAction(query: string, conversationId?: string) {
  try {
    const user = await authUser();
    if (conversationId) {
      await assertCanViewConversation(user, conversationId);
    }
    const data = await ChatRepository.searchMessages(user.id, query, conversationId);
    return { success: true as const, data: data as unknown as ChatMessage[] };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createAnnouncementAction(payload: CreateAnnouncementPayload) {
  try {
    const user = await authUser();
    if (!user.isSuperAdmin) throw new Error('Only super admins can create announcements');

    const data = await ChatRepository.createAnnouncement({
      title: payload.title,
      content: payload.content,
      target: payload.target,
      targetSchoolIds: payload.targetSchoolIds,
      priority: payload.priority,
      attachmentUrl: payload.attachmentUrl,
      attachmentName: payload.attachmentName,
      attachmentSize: payload.attachmentSize,
      createdById: user.id,
      schoolId: user.schoolId,
    });

    return { success: true as const, data: data as unknown as Announcement };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getAnnouncementsAction() {
  try {
    const user = await authUser();
    const data = await ChatRepository.getAnnouncements(user.id, user.schoolId);
    return { success: true as const, data: data as unknown as Announcement[] };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function markAnnouncementReadAction(announcementId: string) {
  try {
    const user = await authUser();
    await ChatRepository.markAnnouncementRead(announcementId, user.id);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function clearConversationAction(conversationId: string) {
  try {
    const user = await authUser();
    await assertCanViewConversation(user, conversationId);
    await ChatRepository.clearConversation(conversationId, user.id);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteConversationAction(conversationId: string) {
  try {
    const user = await authUser();
    await assertCanViewConversation(user, conversationId);
    await ChatRepository.deleteConversationForUser(conversationId, user.id);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function forwardMessageAction(messageId: string, targetConversationId: string) {
  try {
    const user = await authUser();
    await assertCanViewConversation(user, targetConversationId);

    const original = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      select: { content: true, messageType: true, fileUrl: true, fileName: true, fileSize: true, fileId: true },
    });

    if (!original) throw new Error('Original message not found');

    const data = await ChatRepository.sendMessage({
      conversationId: targetConversationId,
      senderId: user.id,
      content: original.content,
      messageType: original.messageType,
      fileUrl: original.fileUrl ?? undefined,
      fileName: original.fileName ?? undefined,
      fileSize: original.fileSize ?? undefined,
      fileId: original.fileId ?? undefined,
      forwardedFromId: messageId,
    });

    return { success: true as const, data: data as unknown as ChatMessage };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
