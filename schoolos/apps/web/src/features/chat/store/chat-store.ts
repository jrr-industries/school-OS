import { create } from 'zustand';
import type { ChatMessage, Conversation } from '../types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messagesByConversation: Record<string, ChatMessage[]>;
  /** userId -> isOnline */
  onlineUsers: Record<string, boolean>;
  /** userId -> lastSeen ISO string */
  lastSeen: Record<string, string>;
  typingUsers: Record<string, { userId: string; userName: string; timestamp: number }[]>;
  replyToMessage: ChatMessage | null;
  showEmojiPicker: boolean;
  showAttachmentPicker: boolean;
  searchQuery: string;
  searchResults: ChatMessage[];
  isSearching: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  upsertMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (messageId: string) => void;
  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  setOnline: (userId: string, isOnline: boolean) => void;
  setOnlineUsers: (users: Record<string, boolean>) => void;
  setLastSeen: (userId: string, iso: string | null) => void;
  applyPresenceSnapshot: (online: Record<string, boolean>, lastSeen: Record<string, string>) => void;
  addTypingUser: (conversationId: string, userId: string, userName: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
  setReplyToMessage: (message: ChatMessage | null) => void;
  setShowEmojiPicker: (show: boolean) => void;
  setShowAttachmentPicker: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: ChatMessage[]) => void;
  setIsSearching: (searching: boolean) => void;
  updateConversationLastMessage: (conversationId: string, message: ChatMessage) => void;
  reorderConversation: (conversationId: string) => void;
  incrementUnread: (conversationId: string) => void;
  resetUnread: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {},
  onlineUsers: {},
  lastSeen: {},
  typingUsers: {},
  replyToMessage: null,
  showEmojiPicker: false,
  showAttachmentPicker: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id, replyToMessage: null }),

  upsertMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messagesByConversation[conversationId] ?? [];
      if (existing.some((m) => m.id === message.id)) {
        // dedup: replace in place (keeps order, updates content)
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: existing.map((m) => (m.id === message.id ? message : m)),
          },
        };
      }
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...existing, message],
        },
      };
    }),

  updateMessage: (messageId, updates) =>
    set((state) => {
      const updated = { ...state.messagesByConversation };
      for (const convId of Object.keys(updated)) {
        const list = updated[convId];
        if (list.some((m) => m.id === messageId)) {
          updated[convId] = list.map((m) => (m.id === messageId ? { ...m, ...updates } : m));
        }
      }
      return { messagesByConversation: updated };
    }),

  removeMessage: (messageId) =>
    set((state) => {
      const updated = { ...state.messagesByConversation };
      for (const convId of Object.keys(updated)) {
        updated[convId] = updated[convId].map((m) =>
          m.id === messageId ? { ...m, deletedAt: new Date().toISOString(), content: '' } : m,
        );
      }
      return { messagesByConversation: updated };
    }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: { ...state.messagesByConversation, [conversationId]: messages },
    })),

  setOnline: (userId, isOnline) =>
    set((state) => {
      if (state.onlineUsers[userId] === isOnline) return {};
      const onlineUsers = { ...state.onlineUsers, [userId]: isOnline };
      return { onlineUsers };
    }),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setLastSeen: (userId, iso) =>
    set((state) => {
      if (!iso) return {};
      return { lastSeen: { ...state.lastSeen, [userId]: iso } };
    }),

  applyPresenceSnapshot: (online, lastSeen) =>
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, ...online },
      lastSeen: { ...state.lastSeen, ...lastSeen },
    })),

  addTypingUser: (conversationId, userId, userName) =>
    set((state) => {
      const existing = state.typingUsers[conversationId] ?? [];
      const filtered = existing.filter((t) => t.userId !== userId);
      return {
        typingUsers: { ...state.typingUsers, [conversationId]: [...filtered, { userId, userName, timestamp: Date.now() }] },
      };
    }),

  removeTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] ?? []).filter((t) => t.userId !== userId),
      },
    })),

  setReplyToMessage: (message) => set({ replyToMessage: message }),

  setShowEmojiPicker: (show) => set({ showEmojiPicker: show, showAttachmentPicker: show ? false : undefined }),
  setShowAttachmentPicker: (show) => set({ showAttachmentPicker: show, showEmojiPicker: show ? false : undefined }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (searching) => set({ isSearching: searching }),

  updateConversationLastMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, lastMessage: message, lastMessageAt: message.createdAt, updatedAt: message.createdAt } : c,
      ),
    })),

  reorderConversation: (conversationId) =>
    set((state) => {
      const idx = state.conversations.findIndex((c) => c.id === conversationId);
      if (idx <= 0) return {};
      const next = [...state.conversations];
      const [item] = next.splice(idx, 1);
      next.unshift(item);
      return { conversations: next };
    }),

  incrementUnread: (conversationId) =>
    set((state) => {
      const active = state.activeConversationId === conversationId;
      if (active) return {}; // don't increment if user is viewing it
      const exists = state.conversations.some((c) => c.id === conversationId);
      if (!exists) return {};
      return {
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 } : c,
        ),
      };
    }),

  resetUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    })),
}));