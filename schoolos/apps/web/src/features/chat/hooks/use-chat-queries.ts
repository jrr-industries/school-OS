'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type {
  ChatMessage,
  SendMessagePayload,
  CreateConversationPayload,
  CreateAnnouncementPayload,
} from '../types';
import {
  getConversationsAction,
  getMessagesAction,
  sendMessageAction,
  createConversationAction,
  markAsReadAction,
  reactToMessageAction,
  editMessageAction,
  deleteMessageAction,
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

export function useConversations() {
  return useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: async () => {
      const result = await getConversationsAction();
      if (!result.success) throw new Error(result.error ?? 'Failed to fetch conversations');
      return result.data;
    },
    refetchInterval: 30000,
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

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const result = await sendMessageAction(payload);
      if (!result.success) throw new Error(result.error ?? 'Failed to send message');
      return result.data;
    },
    onSuccess: (data) => {
      if (data) queryClient.invalidateQueries({ queryKey: ['chat', 'messages', data.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantId: string) => {
      return createConversationAction(participantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return markAsReadAction(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}

export function useReactToMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      return reactToMessageAction(messageId, emoji);
    },
    onMutate: async ({ messageId, emoji }) => {
      queryClient.setQueriesData<InfiniteData<{ messages: ChatMessage[]; nextCursor: string | undefined }>>(
        { queryKey: ['chat', 'messages'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) => {
                if (msg.id !== messageId) return msg;
                const existingIndex = msg.reactions.findIndex((r) => r.emoji === emoji);
                if (existingIndex === -1) {
                  return {
                    ...msg,
                    reactions: [
                      ...msg.reactions,
                      { id: '', emoji, userId: '', user: { id: '', name: '', avatar: null }, createdAt: new Date().toISOString() },
                    ],
                  };
                }
                return {
                  ...msg,
                  reactions: msg.reactions.filter((_, i) => i !== existingIndex),
                };
              }),
            })),
          };
        },
      );
    },
  });
}

export function useEditMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      return editMessageAction(messageId, content);
    },
    onMutate: async ({ messageId, content }) => {
      queryClient.setQueriesData<InfiniteData<{ messages: ChatMessage[]; nextCursor: string | undefined }>>(
        { queryKey: ['chat', 'messages'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, content, isEdited: true, editedAt: new Date().toISOString() }
                  : msg,
              ),
            })),
          };
        },
      );
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, forEveryone }: { messageId: string; forEveryone?: boolean }) => {
      return deleteMessageAction(messageId, forEveryone ?? false);
    },
    onMutate: async ({ messageId }) => {
      queryClient.setQueriesData<InfiniteData<{ messages: ChatMessage[]; nextCursor: string | undefined }>>(
        { queryKey: ['chat', 'messages'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, content: 'This message has been deleted', deletedAt: new Date().toISOString() }
                  : msg,
              ),
            })),
          };
        },
      );
    },
  });
}

export function useToggleStar() {
  return useMutation({
    mutationFn: async (messageId: string) => {
      return toggleStarAction(messageId);
    },
  });
}

export function useTogglePin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return togglePinAction(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}

export function useToggleArchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return toggleArchiveAction(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}

export function useToggleMute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return toggleMuteAction(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
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
    mutationFn: async (payload: CreateAnnouncementPayload) => {
      return createAnnouncementAction(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'announcements'] });
    },
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
    refetchInterval: 60000,
  });
}

export function useMarkAnnouncementRead() {
  return useMutation({
    mutationFn: async (announcementId: string) => {
      return markAnnouncementReadAction(announcementId);
    },
  });
}

export function useClearConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return clearConversationAction(conversationId);
    },
    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return deleteConversationAction(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}

export function useForwardMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, targetConversationId }: { messageId: string; targetConversationId: string }) => {
      return forwardMessageAction(messageId, targetConversationId);
    },
    onSuccess: (_data, { targetConversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', targetConversationId] });
    },
  });
}