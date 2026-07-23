'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@schoolos/database';
import { ChatRepository } from '../../../../packages/database/src/repositories/chat.repository';
import type {
  Conversation,
  ChatMessage,
  SendMessagePayload,
  CreateAnnouncementPayload,
  Announcement,
  MessageReaction,
} from '../types';

async function authUser() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, schoolId: true, email: true, name: true, isSuperAdmin: true },
  });

  if (!user) throw new Error('Unauthorized');

  return user;
}

async function assertParticipant(conversationId: string, userId: string) {
  const participant = await prisma.chatConversationParticipant.findFirst({
    where: { conversationId, userId, leftAt: null },
  });
  if (!participant) throw new Error('Not a participant');
}

export async function getConversationsAction() {
  try {
    const user = await authUser();
    const raw = await ChatRepository.getConversations(user.id, user.schoolId);
    const data = raw.map((c: any) => ({
      ...c,
      isMuted: c.participantMeta?.isMuted ?? false,
    })) as Conversation[];
    return { success: true as const, data };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getMessagesAction(conversationId: string, cursor?: string) {
  try {
    const user = await authUser();
    await assertParticipant(conversationId, user.id);

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
    await assertParticipant(payload.conversationId, user.id);

    const data = await ChatRepository.sendMessage({
      conversationId: payload.conversationId,
      senderId: user.id,
      content: payload.content,
      messageType: payload.messageType,
      messageStatus: payload.messageStatus,
      fileUrl: payload.fileUrl,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      fileId: payload.fileId,
      replyToId: payload.replyToId,
      forwardedFromId: payload.forwardedFromId,
    });

    return { success: true as const, data: data as unknown as ChatMessage };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createConversationAction(participantId: string) {
  try {
    const user = await authUser();

    const data = await ChatRepository.findOrCreateConversation(user.schoolId, [user.id, participantId]);

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
    await assertParticipant(conversationId, user.id);
    const pinned = await ChatRepository.togglePin(conversationId, user.id);
    return { success: true as const, pinned };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function toggleArchiveAction(conversationId: string) {
  try {
    const user = await authUser();
    await assertParticipant(conversationId, user.id);
    const archived = await ChatRepository.toggleArchive(conversationId, user.id);
    return { success: true as const, archived };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function toggleMuteAction(conversationId: string) {
  try {
    const user = await authUser();
    await assertParticipant(conversationId, user.id);
    const muted = await ChatRepository.toggleMute(conversationId, user.id);
    return { success: true as const, muted: muted?.isMuted ?? false };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function searchConversationsAction(query: string) {
  try {
    const user = await authUser();
    const data = await ChatRepository.searchConversations(user.id, query);
    return { success: true as const, data: data as unknown as Conversation[] };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function searchMessagesAction(query: string, conversationId?: string) {
  try {
    const user = await authUser();
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
    await ChatRepository.clearConversation(conversationId, user.id);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteConversationAction(conversationId: string) {
  try {
    const user = await authUser();
    await ChatRepository.deleteConversationForUser(conversationId, user.id);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function forwardMessageAction(messageId: string, targetConversationId: string) {
  try {
    const user = await authUser();
    await assertParticipant(targetConversationId, user.id);

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
      fileUrl: original.fileUrl,
      fileName: original.fileName,
      fileSize: original.fileSize,
      fileId: original.fileId,
      forwardedFromId: messageId,
    });

    return { success: true as const, data: data as unknown as ChatMessage };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
