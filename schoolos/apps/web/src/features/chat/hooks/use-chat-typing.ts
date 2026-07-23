'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClientSupabaseClient } from '@schoolos/auth/client';

interface TypingUser {
  userId: string;
  userName: string;
}

export function useTypingIndicator(conversationId: string | null, currentUserId: string | undefined) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClientSupabaseClient>['channel']> | null>(null);

  const broadcastTyping = useCallback((isTyping: boolean) => {
    if (!conversationId || !currentUserId) return;
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel(`typing-${conversationId}`);
    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== currentUserId) {
          setTypingUsers((prev) => {
            if (payload.isTyping) {
              const exists = prev.find((u) => u.userId === payload.userId);
              if (exists) return prev;
              return [...prev, { userId: payload.userId, userName: payload.userName }];
            }
            return prev.filter((u) => u.userId !== payload.userId);
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: currentUserId, userName: '', isTyping },
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  const startTyping = useCallback(() => {
    if (!conversationId || !currentUserId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    broadcastTyping(true);

    typingTimeoutRef.current = setTimeout(() => {
      broadcastTyping(false);
    }, 3000);
  }, [conversationId, currentUserId, broadcastTyping]);

  useEffect(() => {
    if (!conversationId) return;
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel(`typing-${conversationId}`);
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== currentUserId) {
          setTypingUsers((prev) => {
            if (payload.isTyping) {
              const exists = prev.find((u) => u.userId === payload.userId);
              if (exists) return prev;
              return [...prev, { userId: payload.userId, userName: payload.userName }];
            }
            return prev.filter((u) => u.userId !== payload.userId);
          });
        }
      })
      .subscribe();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      supabase.removeChannel(channel);
      setTypingUsers([]);
    };
  }, [conversationId, currentUserId]);

  return { typingUsers, startTyping };
}
