'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClientSupabaseClient } from '@schoolos/auth/client';

export function useChatRealtime(conversationId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel('chat-realtime');

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined,
        },
        () => {
          if (conversationId) {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', conversationId] });
          }
          queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined,
        },
        () => {
          if (conversationId) {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', conversationId] });
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversation_participants',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reads',
          filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined,
        },
        () => {
          if (conversationId) {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', conversationId] });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);
}

export function useAnnouncementsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel('announcements-realtime');

    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
