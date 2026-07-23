'use client';

import { useState, useMemo } from 'react';
import { cn } from '@schoolos/ui';
import { Search, Plus, Pin, Archive, Check, CheckCheck, MessageSquare, Loader2, X } from 'lucide-react';
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
  activeId,
  onSelect,
  onStartChat,
  availableUsers,
  currentUserId,
  isLoading,
  searchQuery,
  onSearchChange,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onStartChat?: (userId: string) => void;
  availableUsers?: ChatUser[];
  currentUserId?: string;
  isLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const search = onSearchChange !== undefined ? (searchQuery ?? '') : localSearch;

  const setSearch = onSearchChange ?? setLocalSearch;

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) => {
      if (c.title?.toLowerCase().includes(q)) return true;
      return c.participants.some((p) => p.user.name.toLowerCase().includes(q));
    });
  }, [conversations, search]);

  const pinnedConversations = useMemo(() => filteredConversations.filter((c) => c.isPinned), [filteredConversations]);
  const normalConversations = useMemo(() => filteredConversations.filter((c) => !c.isPinned && !c.isArchived), [filteredConversations]);
  const archivedConversations = useMemo(() => filteredConversations.filter((c) => c.isArchived), [filteredConversations]);

  const filteredUsers = useMemo(() => {
    if (!availableUsers) return [];
    const q = userSearch.toLowerCase();
    return availableUsers.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [availableUsers, userSearch]);

  const getOtherParticipant = (conv: Conversation) => conv.participants.find((p) => p.userId !== currentUserId);

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold mb-3">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full h-9 pl-9 pr-8 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 && !search ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin messaging</p>
          </div>
        ) : (
          <>
            {pinnedConversations.length > 0 && (
              <div className="px-3 pt-3 pb-1">
                <div className="flex items-center gap-1.5 px-2 mb-1">
                  <Pin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Pinned</span>
                </div>
                {pinnedConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeId}
                    onClick={() => onSelect(conv.id)}
                    otherParticipant={getOtherParticipant(conv)}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            )}

            {normalConversations.length > 0 && (
              <div className="px-3 pt-3 pb-1">
                <div className="px-2 mb-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {pinnedConversations.length > 0 ? 'All Messages' : 'Messages'}
                  </span>
                </div>
                {normalConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeId}
                    onClick={() => onSelect(conv.id)}
                    otherParticipant={getOtherParticipant(conv)}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            )}

            {archivedConversations.length > 0 && (
              <div className="px-3 pt-3 pb-1">
                <div className="flex items-center gap-1.5 px-2 mb-1">
                  <Archive className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Archived</span>
                </div>
                {archivedConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeId}
                    onClick={() => onSelect(conv.id)}
                    otherParticipant={getOtherParticipant(conv)}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            )}

            {filteredConversations.length === 0 && search && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <p className="text-sm text-muted-foreground">No conversations match &quot;{search}&quot;</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-3 border-t">
        <button
          onClick={() => setShowNewChat(true)}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {showNewChat && onStartChat && availableUsers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNewChat(false)}>
          <div className="bg-card rounded-xl border shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">New Conversation</h2>
              <button onClick={() => setShowNewChat(false)} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => { onStartChat(user.id); setShowNewChat(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.school ? `${user.school.name} · ` : ''}{user.email}
                      </p>
                    </div>
                  </button>
                ))}
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {availableUsers.length === 0 ? 'Loading users...' : 'No users found'}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
  otherParticipant,
  currentUserId,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  otherParticipant?: { user: { name: string; avatar: string | null } } | null;
  currentUserId?: string;
}) {
  const lastMsg = conversation.messages?.[0];
  const name = conversation.title ?? otherParticipant?.user.name ?? 'Unknown';
  const avatarChar = name.charAt(0).toUpperCase();
  const hasUnread = (conversation.unreadCount ?? 0) > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left',
        isActive ? 'bg-primary/10' : 'hover:bg-muted'
      )}
    >
      <div className="relative shrink-0">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
          {otherParticipant?.user.avatar ? (
            <img src={otherParticipant.user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
          ) : avatarChar}
        </div>
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('text-sm truncate', hasUnread ? 'font-semibold' : 'font-medium')}>{name}</p>
          {lastMsg && <span className="text-[10px] text-muted-foreground shrink-0">{formatTime(lastMsg.createdAt)}</span>}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground truncate">
            {lastMsg ? (
              <>
                {lastMsg.senderId === currentUserId && (
                  lastMsg.readReceipts?.length > 0 ? <CheckCheck className="h-3 w-3 inline mr-0.5 text-blue-400" />
                  : <Check className="h-3 w-3 inline mr-0.5" />
                )}
                {lastMsg.messageType === 'image' ? '📷 Image'
                : lastMsg.messageType === 'video' ? '🎬 Video'
                : lastMsg.messageType === 'audio' || lastMsg.messageType === 'voice' ? '🎵 Audio'
                : lastMsg.messageType !== 'text' ? '📎 File'
                : lastMsg.content}
              </>
            ) : (
              <span className="italic">No messages yet</span>
            )}
          </p>
        </div>
      </div>
    </button>
  );
}
