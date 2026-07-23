'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClientSupabaseClient } from '@schoolos/auth/client';
import { useChatStore } from '../store/chat-store';

export function useChatRealtime(conversationId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel('chat-realtime');

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined },
        () => {
          if (conversationId) queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined },
        () => {
          if (conversationId) queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chat_messages', filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined },
        () => {
          if (conversationId) queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_conversation_participants' },
        () => { queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] }); },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_message_reactions', filter: conversationId ? `message_id=in.${conversationId}` : undefined },
        () => {
          if (conversationId) queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'message_reads', filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined },
        () => {
          if (conversationId) queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, queryClient]);
}

export function useConversationRealtime(conversationId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel(`conversation-${conversationId}`);

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_message_reactions' }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'message_reads', filter: `conversation_id=eq.${conversationId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, queryClient]);
}

export function usePresence(conversationId: string | null, userId: string | undefined) {
  useEffect(() => {
    if (!conversationId || !userId) return;
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel(`presence-chat-${conversationId}`, {
      config: { presence: { key: userId } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const onlineUsers: Record<string, boolean> = {};
        for (const key of Object.keys(state)) {
          onlineUsers[key] = true;
        }
        useChatStore.getState().setOnlineUsers(onlineUsers);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        useChatStore.getState().setOnlineUsers({ ...useChatStore.getState().onlineUsers, [key]: true });
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        const users = { ...useChatStore.getState().onlineUsers };
        delete users[key];
        useChatStore.getState().setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ userId, onlineAt: new Date().toISOString() });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, userId]);
}

export function useTypingBroadcast(conversationId: string | null, userId: string | undefined) {
  useEffect(() => {
    if (!conversationId || !userId) return;
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel(`typing-chat-${conversationId}`);

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }: { payload: { userId: string; userName: string; timestamp: number } }) => {
        const store = useChatStore.getState();
        store.addTypingUser(conversationId, payload.userId, payload.userName);
        setTimeout(() => {
          store.removeTypingUser(conversationId, payload.userId);
        }, 2000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, userId]);
}

let cachedClient: ReturnType<typeof createClientSupabaseClient> | null = null;
function getSupabaseClient() {
  if (!cachedClient) cachedClient = createClientSupabaseClient();
  return cachedClient;
}

export const startTyping = (conversationId: string, userId: string, userName: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  supabase.channel(`typing-chat-${conversationId}`).send({
    type: 'broadcast',
    event: 'typing',
    payload: { userId, userName, timestamp: Date.now() },
  });
};

export function useAnnouncementsRealtime() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const supabase = createClientSupabaseClient();
    if (!supabase) return;
    const channel = supabase.channel('announcements-realtime');
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        queryClient.invalidateQueries({ queryKey: ['chat', 'announcements'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);
}

export function useAnnouncementRealtime() {
  return useAnnouncementsRealtime();
}
