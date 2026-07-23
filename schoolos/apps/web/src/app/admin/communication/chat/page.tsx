'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Megaphone, Search, Menu } from 'lucide-react';
import { useConversations, useMessages, useSendMessage, useCreateConversation, useMarkAsRead, useReactToMessage, useEditMessage, useDeleteMessage, useTogglePin, useToggleArchive, useToggleMute, useSearchConversations, useSearchMessages, useCreateAnnouncement, useGetAnnouncements, useMarkAnnouncementRead, useClearConversation, useDeleteConversation } from '@/features/chat/hooks/use-chat-queries';
import { useConversationRealtime, usePresence, useTypingBroadcast, useAnnouncementRealtime } from '@/features/chat/hooks/use-chat-realtime';
import { ConversationSidebar } from '@/features/chat/components/conversation-sidebar';
import { ChatWindow } from '@/features/chat/components/chat-window';
import { AnnouncementList } from '@/features/chat/components/announcement-list';
import { AnnouncementForm } from '@/features/chat/components/announcement-form';
import { SearchDialog } from '@/features/chat/components/search-dialog';
import type { Conversation, ChatMessage, ChatUser } from '@/features/chat/types';

export default function ChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);

  const { data: conversations = [], isLoading: convLoading } = useConversations();
  const { data: messagesPages, fetchNextPage, hasNextPage, isLoading: msgsLoading } = useMessages(activeConversationId);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();
  const markAsRead = useMarkAsRead();
  const reactToMessage = useReactToMessage();
  const editMessage = useEditMessage();
  const deleteMessage = useDeleteMessage();
  const togglePin = useTogglePin();
  const toggleArchive = useToggleArchive();
  const toggleMute = useToggleMute();
  const searchConversations = useSearchConversations();
  const searchMessages = useSearchMessages();
  const createAnnouncement = useCreateAnnouncement();
  const { data: announcements = [], isLoading: annLoading } = useGetAnnouncements();
  const markAnnouncementRead = useMarkAnnouncementRead();
  const clearConversation = useClearConversation();
  const deleteConversation = useDeleteConversation();

  useConversationRealtime(activeConversationId);
  usePresence(activeConversationId, currentUserId);
  useTypingBroadcast(activeConversationId, currentUserId);
  useAnnouncementRealtime();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const json = await res.json();
        if (json.success && json.data) setCurrentUserId(json.data.id);
      } catch {}
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (activeConversationId) markAsRead.mutate(activeConversationId);
  }, [activeConversationId]);

  const messages: ChatMessage[] = messagesPages?.pages.flatMap((p) => p.messages) ?? [];
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const handleSendMessage = useCallback((content: string, opts?: any) => {
    if (!activeConversationId) return;
    sendMessage.mutate({ conversationId: activeConversationId, content, ...opts } as any);
  }, [activeConversationId, sendMessage]);

  const handleLoadUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chat?type=users');
      const json = await res.json();
      if (json.success) setAvailableUsers(json.data);
    } catch {}
  }, []);

  if (convLoading && !activeConversationId) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-9rem)] flex rounded-xl border bg-background overflow-hidden shadow-sm">
      <div className="w-80 xl:w-96 flex flex-col border-r bg-card">
        <div className="flex items-center justify-between p-3 border-b">
          <h1 className="font-semibold text-sm">Messages</h1>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowSearch(true)} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors" title="Search">
              <Search className="h-4 w-4" />
            </button>
            <button onClick={() => { setShowAnnouncements(!showAnnouncements); setActiveConversationId(null); }}
              className={`p-2 rounded-lg transition-colors ${showAnnouncements ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`} title="Announcements">
              <Megaphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showAnnouncements ? (
          <div className="flex-1 overflow-y-auto p-3">
            <AnnouncementList announcements={announcements} isLoading={annLoading}
              onMarkRead={(id) => markAnnouncementRead.mutate(id)} onCreate={() => setShowAnnouncementForm(true)} canCreate={false} />
          </div>
        ) : (
          <ConversationSidebar conversations={conversations} activeId={activeConversationId}
            onSelect={(id) => { setActiveConversationId(id); setShowAnnouncements(false); }}
            onNewChat={handleLoadUsers} availableUsers={availableUsers} currentUserId={currentUserId} isLoading={convLoading} />
        )}
      </div>

      {activeConversation ? (
        <ChatWindow conversation={activeConversation} currentUserId={currentUserId}
          onBack={() => setActiveConversationId(null)}
          onSendMessage={handleSendMessage}
          onReact={(messageId, emoji) => reactToMessage.mutate({ messageId, emoji })}
          onEdit={(messageId, content) => editMessage.mutate({ messageId, content })}
          onDelete={(messageId) => deleteMessage.mutate({ messageId })}
          onCopy={(content) => navigator.clipboard.writeText(content)}
          onTogglePin={() => activeConversationId && togglePin.mutate(activeConversationId)}
          onToggleArchive={() => activeConversationId && toggleArchive.mutate(activeConversationId)}
          onToggleMute={() => activeConversationId && toggleMute.mutate(activeConversationId)}
          onClearChat={() => activeConversationId && clearConversation.mutate(activeConversationId)}
          onDeleteChat={() => activeConversationId && deleteConversation.mutate(activeConversationId)}
          onLoadMore={() => hasNextPage && fetchNextPage()} hasMore={hasNextPage}
          isLoading={msgsLoading} messages={messages}
        />
      ) : (
        <div className="flex-1 hidden lg:flex items-center justify-center bg-muted/30">
          <div className="text-center p-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">S</span>
            </div>
            <h3 className="text-lg font-medium">SchoolOS Chat</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Select a conversation from the sidebar or start a new chat to begin messaging
            </p>
          </div>
        </div>
      )}

      {showAnnouncementForm && (
        <AnnouncementForm onSubmit={(payload) => { createAnnouncement.mutate(payload, { onSuccess: () => setShowAnnouncementForm(false) }); }}
          onClose={() => setShowAnnouncementForm(false)} isSubmitting={createAnnouncement.isPending} />
      )}

      {showSearch && (
        <SearchDialog onClose={() => setShowSearch(false)}
          onSearchConversations={async (q) => { const r = await searchConversations.mutateAsync(q); return r.data ?? []; }}
          onSearchMessages={async (q, convId) => { const r = await searchMessages.mutateAsync({ query: q, conversationId: convId }); return r.data ?? []; }}
          onSelectConversation={(id) => setActiveConversationId(id)}
          onJumpToMessage={(convId, msgId) => setActiveConversationId(convId)} />
      )}
    </div>
  );
}
