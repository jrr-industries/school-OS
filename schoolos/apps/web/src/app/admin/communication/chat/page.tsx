'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useConversations, useCreateConversation } from '@/features/chat/hooks/use-chat-conversations';
import { useChatRealtime } from '@/features/chat/hooks/use-chat-realtime';
import { ConversationSidebar } from '@/features/chat/components/conversation-sidebar';
import { ChatWindow } from '@/features/chat/components/chat-window';
import type { Conversation, ChatUser } from '@/features/chat/types';

export default function ChatPage() {
  const { data: conversations, isLoading, error } = useConversations();
  const createConversation = useCreateConversation();
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useChatRealtime(activeConv?.id ?? null);

  useEffect(() => {
    const sessionUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const json = await res.json();
        if (json.success && json.data) {
          setCurrentUserId(json.data.id);
        }
      } catch {}
    };
    sessionUser();
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chat?type=users');
      const json = await res.json();
      if (json.success) setAvailableUsers(json.data);
    } catch {}
  }, []);

  const handleNewChat = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  const handleStartNewChat = useCallback(async (user: ChatUser) => {
    try {
      const conv = await createConversation.mutateAsync({ participantId: user.id });
      setActiveConv(conv);
    } catch {}
  }, [createConversation]);

  const handleSelectConversation = useCallback((conv: Conversation) => {
    setActiveConv(conv);
  }, []);

  const handleBack = useCallback(() => {
    setActiveConv(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-9rem)] flex rounded-xl border bg-background overflow-hidden shadow-sm">
      <ConversationSidebar
        conversations={conversations ?? []}
        activeConversationId={activeConv?.id ?? null}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={isLoading}
        error={error instanceof Error ? error.message : null}
        availableUsers={availableUsers}
        onStartNewChat={handleStartNewChat}
        newChatLoading={createConversation.isPending}
        currentUserId={currentUserId}
      />

      {activeConv ? (
        <ChatWindow
          conversation={activeConv}
          currentUserId={currentUserId}
          onBack={handleBack}
          isOnline={false}
        />
      ) : (
        <div className="flex-1 hidden lg:flex items-center justify-center bg-muted/30">
          <div className="text-center p-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">SchoolOS Chat</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Select a conversation from the sidebar or start a new chat to begin messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
