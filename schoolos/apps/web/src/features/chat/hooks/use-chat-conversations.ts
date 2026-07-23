'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation, CreateConversationPayload } from '../types';

async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch('/api/admin/chat?type=conversations');
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? 'Failed to fetch conversations');
  return json.data;
}

export function useConversations() {
  return useQuery({
    queryKey: ['chat-conversations'],
    queryFn: fetchConversations,
    refetchInterval: 30000,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateConversationPayload) => {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-conversation', ...payload }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'Failed to create conversation');
      return json.data as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
  });
}
