'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClientSupabaseClient } from '@schoolos/auth/client';

interface PresenceState {
  onlineUsers: Record<string, { name: string; lastSeen: string }>;
}

export function useChatPresence(conversationId: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, { name: string; lastSeen: string }>>({});
  const channelRef = useRef<ReturnType<ReturnType<typeof createClientSupabaseClient>['channel']> | null>(null);

  const trackPresence = useCallback(async (userName: string) => {
    const supabase = createClientSupabaseClient();
    if (!supabase || !conversationId) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`presence-${conversationId}`, {
      config: { presence: { key: conversationId } },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>();
        const users: Record<string, { name: string; lastSeen: string }> = {};
        for (const [key, presences] of Object.entries(state)) {
          for (const presence of presences as any[]) {
            users[key] = { name: presence.name, lastSeen: new Date().toISOString() };
          }
        }
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setOnlineUsers((prev) => {
          const next = { ...prev };
          for (const p of newPresences as any[]) {
            next[key] = { name: p.name, lastSeen: new Date().toISOString() };
          }
          return next;
        });
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user: userName, online_at: new Date().toISOString() });
        }
      });
  }, [conversationId]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        const supabase = createClientSupabaseClient();
        if (supabase) {
          supabase.removeChannel(channelRef.current);
        }
        channelRef.current = null;
      }
    };
  }, []);

  return { onlineUsers, trackPresence };
}
