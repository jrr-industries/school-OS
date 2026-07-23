'use client';

import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '@/features/chat/store/chat-store';
import { ConversationSidebar } from '@/features/chat/components/conversation-sidebar';
import { ChatWindow } from '@/features/chat/components/chat-window';
import { AnnouncementList } from '@/features/chat/components/announcement-list';
import { AnnouncementForm } from '@/features/chat/components/announcement-form';
import { SearchDialog } from '@/features/chat/components/search-dialog';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useCreateConversation,
  useMarkAsRead,
  useReactToMessage,
  useEditMessage,
  useDeleteMessage,
  useTogglePin,
  useToggleArchive,
  useToggleMute,
  useSearchConversations,
  useSearchMessages,
  useCreateAnnouncement,
  useGetAnnouncements,
  useMarkAnnouncementRead,
  useClearConversation,
  useDeleteConversation,
} from '@/features/chat/hooks/use-chat-queries';
import { useConversationRealtime, usePresence, useTypingBroadcast, useAnnouncementRealtime } from '@/features/chat/hooks/use-chat-realtime';
import { Megaphone, Search, Loader2, Menu } from 'lucide-react';
import type { ChatMessage } from '@/features/chat/types';

export default function AdminChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [userSchoolId, setUserSchoolId] = useState<string | undefined>(undefined);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

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

  const store = useChatStore();

  useConversationRealtime(activeConversationId);
  usePresence(activeConversationId, currentUserId);
  useTypingBroadcast(activeConversationId, currentUserId);
  useAnnouncementRealtime();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/admin/chat?type=users');
        const json = await res.json();
        if (json.success && json.data?.[0]) {
          setCurrentUserId(json.data[0].id);
          setUserSchoolId(json.data[0].schoolId);
          setIsSuperAdmin(json.data[0].isSuperAdmin);
        }
      } catch {}
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (conversations.length > 0) store.setConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
      markAsRead.mutate(activeConversationId);
      store.resetUnread(activeConversationId);
    }
  }, [activeConversationId]);

  const messages: ChatMessage[] = messagesPages?.pages.flatMap((p) => p.messages) ?? [];

  const handleSendMessage = useCallback((content: string, opts?: { replyToId?: string; fileUrl?: string; fileName?: string; fileSize?: number; fileId?: string; messageType?: string }) => {
    if (!activeConversationId) return;
    sendMessage.mutate({
      conversationId: activeConversationId,
      content,
      replyToId: opts?.replyToId,
      fileUrl: opts?.fileUrl,
      fileName: opts?.fileName,
      fileSize: opts?.fileSize,
      fileId: opts?.fileId,
      messageType: opts?.messageType as any,
    });
  }, [activeConversationId, sendMessage]);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setShowAnnouncements(false);
    setShowSidebar(false);
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 xl:w-96 flex-col border-r bg-card`}>
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowAnnouncements(false); setShowSidebar(true); }}
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-sm">Messages</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setShowAnnouncements(!showAnnouncements); setActiveConversationId(null); }}
              className={`p-2 rounded-lg transition-colors ${showAnnouncements ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              title="Announcements"
            >
              <Megaphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showAnnouncements ? (
          <div className="flex-1 overflow-y-auto p-3">
            <AnnouncementList
              announcements={announcements}
              isLoading={annLoading}
              canCreate={isSuperAdmin}
              onCreate={() => setShowAnnouncementForm(true)}
              onMarkRead={(id) => markAnnouncementRead.mutate(id)}
            />
          </div>
        ) : (
          <ConversationSidebar
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={handleSelectConversation}
            onNewChat={() => {}}
            currentUserId={currentUserId}
            isLoading={convLoading}
          />
        )}
      </div>

      {/* Main Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col min-w-0">
          <button
            onClick={() => setShowSidebar(true)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground border-b"
          >
            <Menu className="h-5 w-5" />
          </button>
          <ChatWindow
            conversation={activeConversation}
            currentUserId={currentUserId}
            onBack={() => { setActiveConversationId(null); setShowSidebar(true); }}
            onSendMessage={handleSendMessage}
            onReact={(messageId, emoji) => reactToMessage.mutate({ messageId, emoji })}
            onEdit={(messageId, content) => editMessage.mutate({ messageId, content })}
            onDelete={(messageId) => deleteMessage.mutate({ messageId })}
            onCopy={(content) => navigator.clipboard.writeText(content)}
            onStar={() => {}}
            onTogglePin={() => activeConversationId && togglePin.mutate(activeConversationId)}
            onToggleArchive={() => activeConversationId && toggleArchive.mutate(activeConversationId)}
            onToggleMute={() => activeConversationId && toggleMute.mutate(activeConversationId)}
            onClearChat={() => activeConversationId && clearConversation.mutate(activeConversationId)}
            onDeleteChat={() => activeConversationId && deleteConversation.mutate(activeConversationId)}
            onLoadMore={() => hasNextPage && fetchNextPage()}
            hasMore={hasNextPage}
            isLoading={msgsLoading}
            messages={messages}
          />
        </div>
      ) : !showAnnouncements ? (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-muted/30">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary">S</span>
            </div>
            <h2 className="text-xl font-semibold">SchoolOS Chat</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Select a conversation or start a new chat
            </p>
          </div>
        </div>
      ) : null}

      {showAnnouncementForm && (
        <AnnouncementForm
          onSubmit={(payload) => {
            createAnnouncement.mutate(payload, { onSuccess: () => setShowAnnouncementForm(false) });
          }}
          onClose={() => setShowAnnouncementForm(false)}
          isSubmitting={createAnnouncement.isPending}
        />
      )}

      {showSearch && (
        <SearchDialog
          onClose={() => setShowSearch(false)}
          onSearchConversations={async (q) => {
            const result = await searchConversations.mutateAsync(q);
            return result.data ?? [];
          }}
          onSearchMessages={async (q, convId) => {
            const result = await searchMessages.mutateAsync({ query: q, conversationId: convId });
            return result.data ?? [];
          }}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            setShowSidebar(false);
          }}
          onJumpToMessage={(convId, msgId) => {
            setActiveConversationId(convId);
            setShowSidebar(false);
          }}
        />
      )}
    </div>
  );
}
