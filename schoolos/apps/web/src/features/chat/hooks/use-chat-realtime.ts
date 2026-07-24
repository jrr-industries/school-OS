'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { createClientSupabaseClient } from '@schoolos/auth/client';
import {
  connectChat,
  disconnectChat,
  fetchSocketToken,
  getCurrentSocket,
  joinConversation,
  leaveConversation,
} from '@/lib/socket';
import { useChatStore } from '../store/chat-store';
import type { ChatMessage } from '../types';

type MessagesData = InfiniteData<{ messages: ChatMessage[]; nextCursor: string | undefined }>;

function upsertMessageInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: string,
  message: ChatMessage,
  mode: 'prepend' | 'replace' = 'prepend',
) {
  queryClient.setQueriesData<MessagesData>(
    { queryKey: ['chat', 'messages', conversationId] },
    (old) => {
      if (!old) return old; // don't fabricate a cache for a conversation that isn't open
      const pages = [...old.pages];
      const first = pages[0];
      if (!first) {
        pages[0] = { messages: [message], nextCursor: undefined };
        return { ...old, pages } as unknown as MessagesData;
      }
      const exists = first.messages.some((m) => m.id === message.id);
      if (exists) {
        pages[0] = { ...first, messages: first.messages.map((m) => (m.id === message.id ? message : m)) };
      } else if (mode === 'prepend') {
        // messages are stored newest-first (desc); new message goes to the front
        pages[0] = { ...first, messages: [message, ...first.messages] };
      }
      return { ...old, pages } as unknown as MessagesData;
    },
  );
}

/**
 * Single source of realtime for chat. Connects the Socket.IO once per mount,
 * joins the active conversation room, and applies all server events to the
 * React Query cache + Zustand store (instant UI, no polling).
 */
export function useChatRealtime(activeConversationId: string | null, userId: string | undefined) {
  const queryClient = useQueryClient();

  // Join / leave the conversation room
  useEffect(() => {
    if (!activeConversationId) return;
    joinConversation(activeConversationId);
    return () => {
      leaveConversation(activeConversationId);
    };
  }, [activeConversationId]);

  // Register global event listeners once (socket lives in singleton)
  useEffect(() => {
    if (!userId) return;
    const socket = getCurrentSocket();
    if (!socket) return;

    const onNewMessage = ({ conversationId, message }: { conversationId: string; message: ChatMessage }) => {
      // 1. Insert / dedup into the active message cache
      upsertMessageInCache(queryClient, conversationId, message, 'prepend');
      // 2. Sidebar: refresh conversation list (event-driven, not polling)
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'school-admins'] });
      // 3. Unread badge + reorder via store
      const store = useChatStore.getState();
      if (message.senderId !== userId && store.activeConversationId !== conversationId) {
        store.incrementUnread(conversationId);
      }
      store.updateConversationLastMessage(conversationId, message);
      store.reorderConversation(conversationId);
      // 4. Report delivery to sender for others' messages
      if (message.senderId !== userId) {
        socket.emit('message:delivered', { conversationId, messageIds: [message.id] });
      }
    };

    const onUpdated = ({ conversationId, message }: { conversationId: string; message: ChatMessage }) => {
      upsertMessageInCache(queryClient, conversationId, message, 'replace');
    };

    const onDeleted = ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages', conversationId] }, (old) => {
        if (!old) return old;
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) =>
            m.id === messageId ? { ...m, deletedAt: new Date().toISOString(), content: '' } : m,
          ),
        }));
        return { ...old, pages } as unknown as MessagesData;
      });
    };

    const onReaction = ({ conversationId, messageId, emoji, userId: reactorId, user, active }: {
      conversationId: string; messageId: string; emoji: string; userId: string;
      user: { id: string; name: string; avatar: string | null }; active: boolean;
    }) => {
      void conversationId;
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages', conversationId] }, (old) => {
        if (!old) return old;
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) => {
            if (m.id !== messageId) return m;
            const reactions = active
              ? [...m.reactions, { id: '', emoji, userId: reactorId, user, createdAt: new Date().toISOString() }]
              : m.reactions.filter((r) => !(r.emoji === emoji && r.userId === reactorId));
            return { ...m, reactions };
          }),
        }));
        return { ...old, pages } as unknown as MessagesData;
      });
    };

    const onRead = ({ conversationId, userId: readerId }: { conversationId: string; userId: string }) => {
      // Reset unread for the active viewer and refresh receipts
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'school-admins'] });
      if (useChatStore.getState().activeConversationId === conversationId) {
        useChatStore.getState().resetUnread(conversationId);
      }
      // Mark messages not sent by the reader as seen by this reader (read receipt UI)
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages', conversationId] }, (old) => {
        if (!old) return old;
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) => {
            if (m.senderId === readerId) return m;
            const already = m.readReceipts?.some((r) => r.userId === readerId);
            if (already) return m;
            return {
              ...m,
              readReceipts: [...(m.readReceipts ?? []), {
                id: '', messageId: m.id, userId: readerId,
                user: { id: readerId, name: '', avatar: null },
                readAt: new Date().toISOString(),
              }],
            };
          }),
        }));
        return { ...old, pages } as unknown as MessagesData;
      });
    };

    const onStatus = ({ conversationId, messageIds, status }: {
      conversationId: string; messageIds: string[]; status: string;
    }) => {
      void conversationId;
      const set = new Set(messageIds);
      queryClient.setQueriesData<MessagesData>({ queryKey: ['chat', 'messages'] }, (old) => {
        if (!old) return old;
        const pages = old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) =>
            set.has(m.id) ? { ...m, messageStatus: status as ChatMessage['messageStatus'] } : m,
          ),
        }));
        return { ...old, pages } as unknown as MessagesData;
      });
    };

    const onTyping = ({ conversationId, userId: typerId, userName, isTyping }: {
      conversationId: string; userId: string; userName: string; isTyping: boolean;
    }) => {
      const store = useChatStore.getState();
      if (typerId === userId) return;
      if (isTyping) {
        store.addTypingUser(conversationId, typerId, userName);
        setTimeout(() => store.removeTypingUser(conversationId, typerId), 3000);
      } else {
        store.removeTypingUser(conversationId, typerId);
      }
    };

    const onPresenceUpdate = ({ userId: pid, isOnline, lastSeen }: {
      userId: string; isOnline: boolean; lastSeen: string | null;
    }) => {
      const store = useChatStore.getState();
      store.setOnline(pid, isOnline);
      if (!isOnline && lastSeen) store.setLastSeen(pid, lastSeen);
    };

    const onPresenceSync = ({ online, lastSeen }: {
      conversationId: string; online: Record<string, boolean>; lastSeen: Record<string, string>;
    }) => {
      useChatStore.getState().applyPresenceSnapshot(online, lastSeen);
    };

    socket.on('message:new', onNewMessage);
    socket.on('message:updated', onUpdated);
    socket.on('message:deleted', onDeleted);
    socket.on('message:reaction', onReaction);
    socket.on('message:read', onRead);
    socket.on('message:status', onStatus);
    socket.on('typing:update', onTyping);
    socket.on('presence:update', onPresenceUpdate);
    socket.on('presence:sync', onPresenceSync);

    return () => {
      socket.off('message:new', onNewMessage);
      socket.off('message:updated', onUpdated);
      socket.off('message:deleted', onDeleted);
      socket.off('message:reaction', onReaction);
      socket.off('message:read', onRead);
      socket.off('message:status', onStatus);
      socket.off('typing:update', onTyping);
      socket.off('presence:update', onPresenceUpdate);
      socket.off('presence:sync', onPresenceSync);
    };
  }, [userId, queryClient]);
}

/** Establish the Socket.IO connection for the chat. Call once on mount. */
export async function initChatConnection(tokenEndpoint: string): Promise<{
  userId: string; name: string; email: string; role: string;
} | null> {
  const token = await fetchSocketToken(tokenEndpoint);
  if (!token) return null;
  try {
    await connectChat(token.token);
  } catch (err) {
    // Surface but don't crash — realtime will retry to connect
    console.warn('[chat] socket connect failed', err);
  }
  return token;
}

export function teardownChatConnection() {
  disconnectChat();
}

// ── Socket emit mutators (single write/broadcast path) ────────────────────

export function sendChatMessage(
  payload: {
    conversationId: string;
    content: string;
    messageType?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileId?: string;
    replyToId?: string;
    forwardedFromId?: string;
  },
): Promise<ChatMessage | null> {
  return new Promise((resolve) => {
    const socket = getCurrentSocket();
    if (!socket || !socket.connected) {
      resolve(null);
      return;
    }
    socket.timeout(5000).emit('message:send', payload, (_err: unknown, res: { success: boolean; data?: ChatMessage; error?: string }) => {
      if (res?.success && res.data) resolve(res.data);
      else resolve(null);
    });
  });
}

export function markConversationRead(conversationId: string) {
  const socket = getCurrentSocket();
  if (socket?.connected) socket.emit('message:read', { conversationId });
}

export function reactToMessageSocket(messageId: string, emoji: string) {
  const socket = getCurrentSocket();
  if (socket?.connected) socket.emit('message:react', { messageId, emoji });
}

export function editMessageSocket(messageId: string, content: string) {
  const socket = getCurrentSocket();
  if (socket?.connected) socket.emit('message:edit', { messageId, content });
}

export function deleteMessageSocket(messageId: string, forEveryone = true) {
  const socket = getCurrentSocket();
  if (socket?.connected) socket.emit('message:delete', { messageId, forEveryone });
}

export function emitTyping(conversationId: string, isTyping: boolean) {
  const socket = getCurrentSocket();
  if (socket?.connected) socket.emit('typing:update', { conversationId, isTyping });
}

// ── Announcements realtime (Supabase, out of chat-message scope) ───────────
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