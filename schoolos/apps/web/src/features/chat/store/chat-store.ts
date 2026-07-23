import { create } from 'zustand';
import type { ChatMessage, Conversation } from '../types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messagesByConversation: Record<string, ChatMessage[]>;
  onlineUsers: Record<string, boolean>;
  typingUsers: Record<string, { userId: string; userName: string; timestamp: number }[]>;
  replyToMessage: ChatMessage | null;
  showEmojiPicker: boolean;
  showAttachmentPicker: boolean;
  searchQuery: string;
  searchResults: ChatMessage[];
  isSearching: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (messageId: string) => void;
  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  setOnlineUsers: (users: Record<string, boolean>) => void;
  addTypingUser: (conversationId: string, userId: string, userName: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
  setReplyToMessage: (message: ChatMessage | null) => void;
  setShowEmojiPicker: (show: boolean) => void;
  setShowAttachmentPicker: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: ChatMessage[]) => void;
  setIsSearching: (searching: boolean) => void;
  updateConversationLastMessage: (conversationId: string, message: ChatMessage) => void;
  incrementUnread: (conversationId: string) => void;
  resetUnread: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {},
  onlineUsers: {},
  typingUsers: {},
  replyToMessage: null,
  showEmojiPicker: false,
  showAttachmentPicker: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id, replyToMessage: null }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [...(state.messagesByConversation[conversationId] ?? []), message],
      },
    })),

  updateMessage: (messageId, updates) =>
    set((state) => {
      const updated = { ...state.messagesByConversation };
      for (const convId of Object.keys(updated)) {
        updated[convId] = updated[convId].map((m) => (m.id === messageId ? { ...m, ...updates } : m));
      }
      return { messagesByConversation: updated };
    }),

  removeMessage: (messageId) =>
    set((state) => {
      const updated = { ...state.messagesByConversation };
      for (const convId of Object.keys(updated)) {
        updated[convId] = updated[convId].map((m) => (m.id === messageId ? { ...m, deletedAt: new Date().toISOString(), content: '' } : m));
      }
      return { messagesByConversation: updated };
    }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: { ...state.messagesByConversation, [conversationId]: messages },
    })),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

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
        c.id === conversationId ? { ...c, lastMessage: message, updatedAt: message.createdAt } : c,
      ),
    })),

  incrementUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 } : c,
      ),
    })),

  resetUnread: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    })),
}));
