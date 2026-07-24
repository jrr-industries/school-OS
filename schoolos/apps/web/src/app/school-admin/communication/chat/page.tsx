'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, MessageSquare, Plus, Loader2, X, CheckCheck } from 'lucide-react';
import { cn } from '@schoolos/ui';
import { ChatHeader } from '@/features/chat/components/chat-header';
import { ChatInput } from '@/features/chat/components/chat-input';
import { MessageBubble, DateSeparator } from '@/features/chat/components/message-bubble';
import { TypingIndicator } from '@/features/chat/components/typing-indicator';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useReactToMessage,
  useDeleteMessage,
  useCreateConversation,
} from '@/features/chat/hooks/use-chat-queries';
import { useChatRealtime, initChatConnection, teardownChatConnection, emitTyping } from '@/features/chat/hooks/use-chat-realtime';
import { useChatStore } from '@/features/chat/store/chat-store';
import { toast } from 'sonner';
import type { ChatMessage, Conversation, Participant } from '@/features/chat/types';

function getAvatarChar(name: string) {
  return name?.charAt(0).toUpperCase() ?? '?';
}

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

export default function SchoolAdminChatPage() {
  const [myId, setMyId] = useState<string>('');
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversationsData, isLoading: loadingConv } = useConversations();
  const { data: messagesPages, fetchNextPage, hasNextPage, isLoading: msgsLoading } = useMessages(activeConvId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const reactToMessage = useReactToMessage();
  const deleteMessage = useDeleteMessage();
  const createConversation = useCreateConversation();

  const onlineUsers = useChatStore((s) => s.onlineUsers);
  const lastSeen = useChatStore((s) => s.lastSeen);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const resetUnread = useChatStore((s) => s.resetUnread);

  useChatRealtime(activeConvId, myId || undefined);

  useEffect(() => {
    (async () => {
      const info = await initChatConnection('/api/school-admin/chat/socket-token');
      if (info) {
        setMyId(info.userId);
        console.log('[chat] Connected as:', info.userId);
      }
    })();
    return () => { teardownChatConnection(); };
  }, []);

  // Don't render messages until myId is set (prevents alignment bugs)
  const isReady = !!myId;

  // Mark active conversation read + reset unread
  useEffect(() => {
    if (!activeConvId) return;
    setActiveConversation(activeConvId);
    resetUnread(activeConvId);
    markAsRead.mutate(activeConvId);
  }, [activeConvId, markAsRead, resetUnread, setActiveConversation]);

  const conversations: Conversation[] = (conversationsData as Conversation[] | undefined) ?? [];

  const sortedConvs = useMemo(() => {
    const list = [...conversations];
    list.sort((a, b) => new Date(b.lastMessageAt ?? b.updatedAt).getTime() - new Date(a.lastMessageAt ?? a.updatedAt).getTime());
    return list;
  }, [conversations]);

  const filteredConvs = useMemo(() => {
    if (!search.trim()) return sortedConvs;
    const q = search.toLowerCase();
    return sortedConvs.filter((c) => {
      const partner = c.participants.find((p) => p.userId !== myId)?.user.name ?? c.title ?? '';
      return partner.toLowerCase().includes(q);
    });
  }, [sortedConvs, search, myId]);

  const openConversation = useCallback((conv: Conversation) => {
    setActiveConvId(conv.id);
    setReplyTo(null);
  }, []);

  const handleSendMessage = useCallback((content: string, opts?: {
    replyToId?: string; fileUrl?: string; fileName?: string; fileSize?: number; fileId?: string; messageType?: string;
  }) => {
    if (!activeConvId) return;
    sendMessage.mutate({
      conversationId: activeConvId,
      content,
      replyToId: opts?.replyToId ?? (replyTo?.id),
      fileUrl: opts?.fileUrl,
      fileName: opts?.fileName,
      fileSize: opts?.fileSize,
      fileId: opts?.fileId,
      messageType: opts?.messageType as any,
    }, {
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to send message'),
    });
    setReplyTo(null);
  }, [activeConvId, sendMessage, replyTo]);

  const startConversation = useCallback(async (targetId: string) => {
    const result = await createConversation.mutateAsync(targetId);
    if (!result.success) { toast.error(result.error ?? 'Failed to create conversation'); return; }
    setShowNewChat(false);
    setActiveConvId((result.data as unknown as Conversation).id);
  }, [createConversation]);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const partner: Participant | undefined = activeConv?.participants.find((p) => p.userId !== myId);
  const partnerId = partner?.userId;
  const isOnline = partnerId ? !!onlineUsers[partnerId] : false;
  const partnerLastSeen = partnerId ? lastSeen[partnerId] ?? null : null;

  const messagesDesc: ChatMessage[] = messagesPages?.pages.flatMap((p) => p.messages) ?? [];
  const messages = useMemo(() => [...messagesDesc].reverse(), [messagesDesc]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [activeConvId, messages.length, messages[messages.length - 1]?.id]);

  const typingNames = (typingUsers[activeConvId ?? ''] ?? [])
    .filter((t) => t.userId !== myId)
    .map((t) => t.userName);

  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-6 -mt-4">
      {/* Sidebar */}
      <div className="w-80 lg:w-96 border-r flex flex-col bg-background shrink-0">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold">Messages</h1>
            <button
              onClick={() => setShowNewChat(true)}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              title="New conversation"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConv ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="h-11 w-11 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-2 w-32 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 mb-3" />
              <p className="text-sm font-medium">No conversations</p>
              <p className="text-xs mt-1">Start a new chat with staff</p>
            </div>
          ) : filteredConvs.map((conv) => {
            const p = conv.participants.find((pp) => pp.userId !== myId);
            const lastMsg = conv.lastMessage ?? (conv.messages as ChatMessage[])[0];
            const unread = conv.unreadCount ?? 0;
            return (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-border/50 last:border-0',
                  activeConvId === conv.id ? 'bg-primary/5' : 'hover:bg-muted/50',
                )}
              >
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0 relative">
                  {p ? getAvatarChar(p.user.name) : '?'}
                  {p && <span className={cn('absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background', onlineUsers[p.userId] ? 'bg-green-500' : 'bg-muted-foreground/30')} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn('text-sm truncate', unread > 0 && 'font-semibold')}>{p?.user.name || conv.title || 'Unknown'}</p>
                    {lastMsg && <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{formatTime(lastMsg.createdAt)}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-0.5 gap-2">
                    <p className="text-xs text-muted-foreground truncate">
                      {lastMsg ? (
                        <>
                          {lastMsg.senderId === myId && <CheckCheck className="h-3 w-3 inline mr-0.5 text-blue-400" />}
                          {lastMsg.messageType === 'image' ? '📷 Photo'
                            : lastMsg.messageType === 'voice' ? '🎤 Voice message'
                            : lastMsg.messageType === 'document' ? '📎 File'
                            : lastMsg.content || ''}
                        </>
                      ) : <span className="italic">No messages yet</span>}
                    </p>
                    {unread > 0 && (
                      <span className="h-5 min-w-[20px] rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1.5 shrink-0">
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeConv && partner ? (
          <>
            <ChatHeader
              participant={partner}
              isOnline={isOnline}
              lastSeen={partnerLastSeen}
              onBack={() => { setActiveConvId(null); setActiveConversation(null); }}
            />

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-muted/30">
              {!isReady ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Connecting to chat...</span>
                </div>
              ) : msgsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mb-3" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs mt-1">Send a message to start the conversation</p>
                </div>
              ) : (
                <>
                  {hasNextPage && (
                    <div className="flex justify-center py-2">
                      <button onClick={() => fetchNextPage()} className="text-xs text-primary hover:underline">
                        Load older messages
                      </button>
                    </div>
                  )}
                  {messages.map((msg, idx) => {
                    const isMine = msg.senderId === myId;
                    const showAvatar = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId;
                    const showDateSep = idx === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();
                    return (
                      <div key={msg.id}>
                        {showDateSep && <DateSeparator date={msg.createdAt} />}
                        <MessageBubble
                          message={msg}
                          isMine={isMine}
                          showAvatar={showAvatar}
                          onReply={(m) => setReplyTo(m)}
                          onDelete={(id) => deleteMessage.mutate({ messageId: id, forEveryone: true, conversationId: activeConvId! })}
                          onReact={(messageId, emoji) => reactToMessage.mutate({ conversationId: activeConvId!, messageId, emoji })}
                          onCopy={(content) => navigator.clipboard.writeText(content)}
                        />
                      </div>
                    );
                  })}
                  <TypingIndicator names={typingNames} />
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <ChatInput
              onSend={(content) => handleSendMessage(content)}
              replyTo={replyTo ? { name: replyTo.sender.name, content: replyTo.content } : null}
              onCancelReply={() => setReplyTo(null)}
              onSendFile={async (file: File) => {
                try {
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                  const json = await res.json();
                  if (!json.success) throw new Error(json.error);
                  handleSendMessage('', {
                    messageType: json.data.messageType,
                    fileUrl: json.data.url, fileName: json.data.name, fileSize: json.data.size, fileId: json.data.fileRecordId,
                  });
                } catch (e: any) { toast.error(e.message || 'Upload failed'); }
              }}
              onSendVoice={async (blob: Blob) => {
                try {
                  const file = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type || 'audio/webm' });
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                  const json = await res.json();
                  if (!json.success) throw new Error(json.error);
                  handleSendMessage('', {
                    messageType: 'voice',
                    fileUrl: json.data.url, fileName: json.data.name, fileSize: json.data.size, fileId: json.data.fileRecordId,
                  });
                } catch (e: any) { toast.error(e.message || 'Voice upload failed'); }
              }}
              onTyping={() => { if (activeConvId) emitTyping(activeConvId, true); }}
              disabled={!activeConvId}
              placeholder="Type a message..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <div className="text-center p-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">SchoolOS Chat</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Select a conversation from the sidebar or start a new chat
              </p>
            </div>
          </div>
        )}
      </div>

      {showNewChat && <NewChatModal onSelect={startConversation} onClose={() => setShowNewChat(false)} />}
    </div>
  );
}

function NewChatModal({ onSelect, onClose }: { onSelect: (id: string) => void; onClose: () => void }) {
  const [users, setUsers] = useState<{ id: string; name: string; email: string; userRoles?: { role: { slug: string; name: string } }[] }[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/school-admin/chat/users')
      .then((r) => r.json())
      .then((json) => { if (json.success) setUsers(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 mx-4 border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">New Conversation</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg border-0 bg-muted pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="space-y-1 max-h-72 overflow-y-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-2 w-32 rounded bg-muted" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No users found</p>
          ) : filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => onSelect(u.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                {getAvatarChar(u.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {u.userRoles?.map((r) => r.role.name).join(', ') || u.email}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}