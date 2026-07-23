'use client';

import { useState, useMemo } from 'react';
import { cn } from '@schoolos/ui';
import { MessageSquare, Plus, Search, Loader2, Pin, Archive, AlertCircle } from 'lucide-react';
import type { Conversation, ChatUser } from '../types';

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffMins < 1440) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString();
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelect,
  onNewChat,
  searchQuery,
  onSearchChange,
  loading,
  error,
  availableUsers,
  onStartNewChat,
  newChatLoading,
  currentUserId,
}: {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (conv: Conversation) => void;
  onNewChat: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
  error: string | null;
  availableUsers: ChatUser[];
  onStartNewChat: (user: ChatUser) => void;
  newChatLoading: boolean;
  currentUserId?: string;
}) {
  const [showNewChat, setShowNewChat] = useState(false);

  const getOtherParticipant = (conv: Conversation) => {
    const other = conv.participants.find((p) => p.userId !== currentUserId);
    return other?.user ?? conv.participants[0]?.user ?? null;
  };

  const getLastMessage = (conv: Conversation) => {
    return conv.messages[0] ?? null;
  };

  const filteredConvs = useMemo(() => {
    return conversations.filter((conv) => {
      if (!searchQuery) return true;
      const other = getOtherParticipant(conv);
      return other?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             other?.email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  const pinnedConvs = filteredConvs.filter((c) => c.isPinned);
  const normalConvs = filteredConvs.filter((c) => !c.isPinned);

  return (
    <>
      <div className="w-80 lg:w-96 border-r flex flex-col bg-background">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold">Chats</h1>
            <button
              onClick={() => { onNewChat(); setShowNewChat(true); }}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              title="New conversation"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 rounded-lg border-0 bg-muted pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {error && (
          <div className="mx-3 mt-2 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <button
                onClick={() => { onNewChat(); setShowNewChat(true); }}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Start a chat
              </button>
            </div>
          ) : (
            <>
              {pinnedConvs.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 flex items-center gap-1.5">
                    <Pin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Pinned</span>
                  </div>
                  {pinnedConvs.map((conv) => {
                    const other = getOtherParticipant(conv);
                    const lastMsg = getLastMessage(conv);
                    return (
                      <ConversationItem
                        key={conv.id}
                        conv={conv}
                        other={other}
                        lastMsg={lastMsg}
                        isActive={activeConversationId === conv.id}
                        onSelect={() => onSelect(conv)}
                      />
                    );
                  })}
                  <div className="h-px bg-border mx-3 my-1" />
                </div>
              )}

              {normalConvs.map((conv) => {
                const other = getOtherParticipant(conv);
                const lastMsg = getLastMessage(conv);
                return (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    other={other}
                    lastMsg={lastMsg}
                    isActive={activeConversationId === conv.id}
                    onSelect={() => onSelect(conv)}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNewChat(false)}>
          <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 mx-4 border" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">New Conversation</h2>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No users available</p>
              ) : (
                availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onStartNewChat(u);
                      setShowNewChat(false);
                    }}
                    disabled={newChatLoading}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors disabled:opacity-50"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.role} - {u.school?.name ?? 'Platform'}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ConversationItem({
  conv,
  other,
  lastMsg,
  isActive,
  onSelect,
}: {
  conv: Conversation;
  other: { id: string; name: string; email: string; avatar: string | null } | null;
  lastMsg: { content: string; createdAt: string; senderId: string } | null;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0',
        isActive ? 'bg-primary/5' : ''
      )}
    >
      <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0 relative">
        {other ? other.name.charAt(0).toUpperCase() : '?'}
        {conv.unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground px-1">
            {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate flex items-center gap-1.5">
            {other?.name ?? 'Unknown'}
            {conv.isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
            {conv.isArchived && <Archive className="h-3 w-3 text-muted-foreground" />}
          </p>
          {lastMsg && <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{formatTime(lastMsg.createdAt)}</span>}
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className={cn(
            'text-xs truncate',
            conv.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
          )}>
            {lastMsg ? lastMsg.content : 'No messages yet'}
          </p>
        </div>
      </div>
    </button>
  );
}
