'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type {
  ChatMessage,
  Conversation,
  SendMessagePayload,
  CreateAnnouncementPayload,
} from '../types';
import {
  sendChatMessage,
  markConversationRead,
  reactToMessageSocket,
  editMessageSocket,
  deleteMessageSocket,
} from './use-chat-realtime';
import {
  getConversationsAction,
  getMessagesAction,
  createConversationAction,
  toggleStarAction,
  togglePinAction,
  toggleArchiveAction,
  toggleMuteAction,
  searchConversationsAction,
  searchMessagesAction,
  createAnnouncementAction,
  getAnnouncementsAction,
  markAnnouncementReadAction,
  clearConversationAction,
  deleteConversationAction,
  forwardMessageAction,
} from '../actions/chat-actions';
import { useChatStore } from '../store/chat-store';

type MessagesData = InfiniteData<{ messages: ChatMessage[]; nextCursor: string | undefined }>;

export function useConversations() {
  return useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: async () => {
      const result = await getConversationsAction();
      if (!result.success) throw new Error(result.error ?? 'Failed to fetch conversations');
      return result.data;
    },
    staleTime: 10000,
  });
}

/** Sidebar data for super-admin "school admins" view (event-driven refresh, no polling). */
export function useSchoolAdmins() {
  return useQuery({
    queryKey: ['chat', 'school-admins'],
    queryFn: async () => {
      const res = await fetch('/api/admin/chat/school-admins');
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'Failed to load school admins');
      return json.data as any[];
    },
    staleTime: 10000,
  });
}

export function useMessages(conversationId: string | null) {
  return useInfiniteQuery({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: async ({ pageParam }) => {
      const result = await getMessagesAction(conversationId!, pageParam as string | undefined);
      if (!result.success) throw new Error(result.error ?? 'Failed to fetch messages');
      return { messages: result.data as ChatMessage[], nextCursor: result.nextCursor };
    },
    getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage.nextCursor,
    enabled: !!conversationId,
    initialPageParam: undefined as string | undefined,
  });
}

/** Send a message through the single Socket.IO pipeline (with optimistic insert). */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const created = await sendChatMessage(payload);
      if (!created) throw new Error('Chat server unavailable');
      return created;
    },
    onMutate: async (payload) => {
      const optimistic: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        conversationId: payload.conversationId,
        senderId: '',
        content: payload.content,
        messageType: (payload.messageType ?? 'text') as ChatMessage['messageType'],
        messageStatus: 'sending',
        fileUrl: payload.fileUrl ?? null,
        fileName: payload.fileName ?? null,
        fileSize: payload.fileSize ?? null,
        fileId: payload.fileId ?? null,
        file: null,
        replyToId: payload.replyToId ?? null,
        replyTo: null,
        forwardedFromId: payload.forwardedFromId ?? null,
        forwardedFrom: null,
        isEdited: false,
        isForwarded: !!payload.forwardedFromId,
        metadata: null,
        editedAt: null,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: { id: '', name: 'You', email: '', avatar: null },
        readReceipts: [],
        reactions: [],
      };
      await queryClient.cancelQueries({ queryKey: ['chat', 'messages', payload.conversationId] });
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages', payload.conversationId] }, (old) => {
        if (!old) return old;
        const pages = [...old.pages];
        pages[0] = { ...pages[0], messages: [optimistic, ...(pages[0]?.messages ?? [])] };
        return { ...old, pages } as unknown as MessagesData;
      });
      return { optimistic };
    },
    onError: () => {
      // The optimistic message stays as "sending"; the real one never arrived.
    },
    onSuccess: (data, _vars, ctx) => {
      // Replace optimistic with real message from socket server
      const optimisticId = ctx?.optimistic.id;
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages', data.conversationId] }, (old) => {
        if (!old) return old;
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages
            .filter((m) => m.id !== data.id && m.id !== optimisticId)
            .concat([data]),
        }));
        return { ...old, pages } as unknown as MessagesData;
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'school-admins'] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (participantId: string) => createConversationAction(participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}

/** Mark the active conversation as read through the socket (read receipts + reset unread). */
export function useMarkAsRead() {
  return useMutation({
    mutationFn: async (conversationId: string) => {
      markConversationRead(conversationId);
    },
  });
}

export function useReactToMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string; conversationId: string }) => {
      reactToMessageSocket(messageId, emoji);
      return null;
    },
    onMutate: async ({ messageId, emoji, conversationId }) => {
      const me = useChatStore.getState().activeConversationId;
      void me;
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages', conversationId] }, (old) => {
        if (!old) return old;
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((msg) => {
            if (msg.id !== messageId) return msg;
            const existingIndex = msg.reactions.findIndex((r) => r.emoji === emoji);
            if (existingIndex === -1) {
              return {
                ...msg,
                reactions: [...msg.reactions, { id: '', emoji, userId: '', user: { id: '', name: '', avatar: null }, createdAt: new Date().toISOString() }],
              };
            }
            return { ...msg, reactions: msg.reactions.filter((_, i) => i !== existingIndex) };
          }),
        }));
        return { ...old, pages } as unknown as MessagesData;
      });
    },
  });
}

export function useEditMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      editMessageSocket(messageId, content);
    },
    onMutate: async ({ messageId, content }) => {
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages'] }, (old) => {
        if (!old) return old;
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content, isEdited: true, editedAt: new Date().toISOString() } : msg,
          ),
        }));
        return { ...old, pages } as unknown as MessagesData;
      });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ messageId, forEveryone, conversationId: _conversationId }: { messageId: string; forEveryone?: boolean; conversationId: string }) => {
      void _conversationId;
      deleteMessageSocket(messageId, forEveryone ?? true);
    },
    onMutate: async ({ messageId, conversationId }) => {
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages', conversationId] }, (old) => {
        if (!old) return old;
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((msg) =>
            msg.id === messageId ? { ...msg, deletedAt: new Date().toISOString(), content: '' } : msg,
          ),
        }));
        return { ...old, pages } as unknown as MessagesData;
      });
    },
  });
}

export function useToggleStar() {
  return useMutation({
    mutationFn: async (messageId: string) => toggleStarAction(messageId),
  });
}

export function useTogglePin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => togglePinAction(conversationId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] }); },
  });
}

export function useToggleArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => toggleArchiveAction(conversationId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] }); },
  });
}

export function useToggleMute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => toggleMuteAction(conversationId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] }); },
  });
}

export function useSearchConversations() {
  return useMutation({
    mutationFn: async (query: string) => {
      const result = await searchConversationsAction(query);
      if (!result.success) throw new Error(result.error ?? 'Search failed');
      return result;
    },
  });
}

export function useSearchMessages() {
  return useMutation({
    mutationFn: async ({ query, conversationId }: { query: string; conversationId?: string }) => {
      const result = await searchMessagesAction(query, conversationId);
      if (!result.success) throw new Error(result.error ?? 'Search failed');
      return result;
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAnnouncementPayload) => createAnnouncementAction(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chat', 'announcements'] }); },
  });
}

export function useGetAnnouncements() {
  return useQuery({
    queryKey: ['chat', 'announcements'],
    queryFn: async () => {
      const result = await getAnnouncementsAction();
      if (!result.success) throw new Error(result.error ?? 'Failed to fetch announcements');
      return result.data;
    },
  });
}

export function useMarkAnnouncementRead() {
  return useMutation({
    mutationFn: async (announcementId: string) => markAnnouncementReadAction(announcementId),
  });
}

export function useClearConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => clearConversationAction(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => deleteConversationAction(conversationId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] }); },
  });
}

export function useForwardMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ messageId, targetConversationId }: { messageId: string; targetConversationId: string }) =>
      forwardMessageAction(messageId, targetConversationId),
    onSuccess: (_data, { targetConversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', targetConversationId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}