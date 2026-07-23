'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ChatMessage, SendMessagePayload } from '../types';

async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  const res = await fetch(`/api/admin/chat?type=messages&conversationId=${conversationId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Failed to fetch messages');
  return json.data;
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: false,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-message', ...payload }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'Failed to send message');
      return json.data as ChatMessage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', data.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-read', conversationId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'Failed to mark as read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
  });
}
