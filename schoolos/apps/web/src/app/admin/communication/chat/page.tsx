'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MessageSquare, School, Loader2, CheckCheck } from 'lucide-react';
import { cn } from '@schoolos/ui';
import { ChatHeader } from '@/features/chat/components/chat-header';
import { ChatInput } from '@/features/chat/components/chat-input';
import { MessageBubble, DateSeparator } from '@/features/chat/components/message-bubble';
import { TypingIndicator } from '@/features/chat/components/typing-indicator';
import {
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useReactToMessage,
  useDeleteMessage,
} from '@/features/chat/hooks/use-chat-queries';
import { useConversationRealtime, usePresence, useTypingBroadcast, startTyping } from '@/features/chat/hooks/use-chat-realtime';
import { useChatStore } from '@/features/chat/store/chat-store';
import { createClientSupabaseClient } from '@schoolos/auth/client';
import { toast } from 'sonner';
import type { ChatMessage, Conversation } from '@/features/chat/types';

interface SchoolAdmin {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  schoolId: string;
  school: { id: string; name: string; slug: string; logo: string | null };
  conversationId: string | null;
  lastMessage: { id: string; content: string; messageType: string; createdAt: string; senderId: string } | null;
  unreadCount: number;
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

export default function CommunicationChatPage() {
  const [schoolAdmins, setSchoolAdmins] = useState<SchoolAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeAdmin, setActiveAdmin] = useState<SchoolAdmin | null>(null);

  const { data: messagesPages, fetchNextPage, hasNextPage, isLoading: msgsLoading } = useMessages(activeConvId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const reactToMessage = useReactToMessage();
  const deleteMessage = useDeleteMessage();
  const onlineUsers = useChatStore((s) => s.onlineUsers);
  const typingUsers = useChatStore((s) => s.typingUsers);

  useConversationRealtime(activeConvId);
  usePresence(activeConvId, currentUserId);
  useTypingBroadcast(activeConvId, currentUserId);

  const fetchSchoolAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/chat/school-admins');
      const json = await res.json();
      if (json.success) { setSchoolAdmins(json.data); }
      else { toast.error(json.error ?? 'Failed to load school admins'); }
    } catch { toast.error('Failed to load school admins'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch('/api/admin/chat?type=me');
        const meJson = await meRes.json();
        if (meJson.success) setCurrentUserId(meJson.data.id);
      } catch {}
    })();
    fetchSchoolAdmins();
  }, [fetchSchoolAdmins]);

  useEffect(() => {
    if (!activeConvId) return;
    const supabase = createClientSupabaseClient();
    if (!supabase) return;
    const channel = supabase.channel(`admin-sidebar-${activeConvId}`);
    channel
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `conversation_id=eq.${activeConvId}`,
      }, () => { fetchSchoolAdmins(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConvId, fetchSchoolAdmins]);

  useEffect(() => {
    if (activeConvId) {
      markAsRead.mutate(activeConvId);
      setSchoolAdmins((prev) =>
        prev.map((a) => (a.conversationId === activeConvId ? { ...a, unreadCount: 0 } : a))
      );
    }
  }, [activeConvId]);

  const filteredAdmins = useMemo(() => {
    if (!search.trim()) return schoolAdmins;
    const q = search.toLowerCase();
    return schoolAdmins.filter(
      (a) => a.school.name.toLowerCase().includes(q) || a.name.toLowerCase().includes(q),
    );
  }, [schoolAdmins, search]);

  const handleSelect = useCallback(async (admin: SchoolAdmin) => {
    try {
      let convId = admin.conversationId;

      if (!convId) {
        const res = await fetch('/api/admin/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create-conversation', participantId: admin.id }),
        });
        const json = await res.json();
        if (!json.success) { toast.error(json.error ?? 'Failed to create conversation'); return; }
        convId = json.data.id;
        setSchoolAdmins((prev) =>
          prev.map((a) => (a.id === admin.id ? { ...a, conversationId: convId } : a))
        );
      }

      setActiveAdmin(admin);
      setActiveConvId(convId);
    } catch { toast.error('Failed to open conversation'); }
  }, []);

  const handleSendMessage = useCallback((content: string, opts?: { replyToId?: string; fileUrl?: string; fileName?: string; fileSize?: number; fileId?: string; messageType?: string }) => {
    if (!activeConvId) return;
    sendMessage.mutate({
      conversationId: activeConvId,
      content,
      replyToId: opts?.replyToId,
      fileUrl: opts?.fileUrl,
      fileName: opts?.fileName,
      fileSize: opts?.fileSize,
      fileId: opts?.fileId,
      messageType: opts?.messageType as any,
    }, {
      onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to send message'),
    });
  }, [activeConvId, sendMessage]);

  const messages: ChatMessage[] = messagesPages?.pages.flatMap((p) => p.messages) ?? [];

  const conversation = useMemo((): Conversation | null => {
    if (!activeAdmin || !activeConvId) return null;
    return {
      id: activeConvId,
      schoolId: activeAdmin.schoolId,
      title: activeAdmin.name,
      isGroup: false,
      isPinned: false,
      isArchived: false,
      isMuted: false,
      lastMessageAt: activeAdmin.lastMessage?.createdAt ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: [{
        id: activeAdmin.id,
        userId: activeAdmin.id,
        role: 'member',
        isMuted: false,
        notificationsEnabled: true,
        lastReadAt: null,
        joinedAt: new Date().toISOString(),
        leftAt: null,
        user: {
          id: activeAdmin.id,
          name: activeAdmin.name,
          email: activeAdmin.email,
          avatar: activeAdmin.avatar,
          isSuperAdmin: false,
        },
      }],
      messages: [],
      unreadCount: 0,
    };
  }, [activeAdmin, activeConvId]);

  const otherParticipant = conversation?.participants[0] ?? null;
  const isOnline = activeAdmin ? !!onlineUsers[activeAdmin.id] : false;

  const typingNames = activeConvId
    ? (typingUsers[activeConvId] ?? []).filter((t) => t.userId !== currentUserId).map((t) => t.userName)
    : [];

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-xl border bg-background overflow-hidden shadow-sm">
      {/* Left Sidebar */}
      <div className="flex w-80 xl:w-96 flex-col border-r bg-card shrink-0">
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold tracking-tight">School Admins</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {schoolAdmins.length} {schoolAdmins.length === 1 ? 'admin' : 'admins'}
          </p>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by school or admin name..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <School className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                {search ? 'No admins match your search' : 'No school admins found'}
              </p>
            </div>
          ) : (
            filteredAdmins.map((admin) => (
              <button
                key={admin.id}
                onClick={() => handleSelect(admin)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 text-left transition-colors border-b border-border/50 last:border-0 hover:bg-muted/50',
                  activeConvId === admin.conversationId && 'bg-primary/5 hover:bg-primary/5',
                )}
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 relative">
                  {admin.school.logo ? (
                    <img src={admin.school.logo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-primary">{admin.school.name.charAt(0)}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{admin.school.name}</p>
                    {admin.lastMessage && (
                      <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                        {formatTime(admin.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      onlineUsers[admin.id] ? 'bg-green-500' : 'bg-gray-300',
                    )} />
                    <p className="text-xs text-muted-foreground truncate">{admin.name}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {admin.lastMessage ? (
                        <>
                          {admin.lastMessage.senderId === currentUserId && (
                            <CheckCheck className="h-3 w-3 inline mr-0.5 text-blue-400" />
                          )}
                          {admin.lastMessage.messageType === 'image' ? '📷 Photo'
                            : admin.lastMessage.messageType === 'voice' ? '🎤 Voice'
                            : admin.lastMessage.messageType === 'document' ? '📎 File'
                            : admin.lastMessage.content}
                        </>
                      ) : (
                        <span className="italic">No messages yet</span>
                      )}
                    </p>
                    {admin.unreadCount > 0 && (
                      <span className="h-5 min-w-[20px] rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1.5 shrink-0">
                        {admin.unreadCount > 99 ? '99+' : admin.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {conversation && activeAdmin ? (
          <>
            <ChatHeader
              participant={otherParticipant}
              isOnline={isOnline}
              onBack={() => { setActiveConvId(null); setActiveAdmin(null); }}
            />

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-muted/30 relative">
              {msgsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">{activeAdmin.school.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Chat with {activeAdmin.name}
                  </p>
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
                    const isMine = msg.senderId === currentUserId;
                    const showAvatar = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId;
                    const showDateSep = idx === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();
                    return (
                      <div key={msg.id}>
                        {showDateSep && <DateSeparator date={msg.createdAt} />}
                        <MessageBubble
                          message={msg}
                          isMine={isMine}
                          showAvatar={showAvatar}
                          onReply={() => {}}
                          onDelete={(id: string) => deleteMessage.mutate({ messageId: id, forEveryone: true })}
                          onReact={(messageId: string, emoji: string) => reactToMessage.mutate({ messageId, emoji })}
                          onCopy={(content: string) => navigator.clipboard.writeText(content)}
                        />
                      </div>
                    );
                  })}
                  <TypingIndicator names={typingNames} />
                </>
              )}
            </div>

            <ChatInput
              onSend={(content: string) => handleSendMessage(content)}
              onSendFile={async (file: File) => {
                try {
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                  const json = await res.json();
                  if (json.success) {
                    handleSendMessage('', {
                      fileUrl: json.data.url,
                      fileName: json.data.name,
                      fileSize: json.data.size,
                      fileId: json.data.fileRecordId,
                      messageType: json.data.messageType,
                    });
                  } else {
                    toast.error(json.error ?? 'Upload failed');
                  }
                } catch { toast.error('Upload failed'); }
              }}
              onSendVoice={async (blob: Blob, _duration?: number) => {
                try {
                  const file = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type || 'audio/webm' });
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                  const json = await res.json();
                  if (json.success) {
                    handleSendMessage('', {
                      fileUrl: json.data.url,
                      fileName: json.data.name,
                      fileSize: json.data.size,
                      fileId: json.data.fileRecordId,
                      messageType: 'voice',
                    });
                  } else {
                    toast.error(json.error ?? 'Voice upload failed');
                  }
                } catch { toast.error('Voice upload failed'); }
              }}
              onTyping={() => {
                if (activeConvId && currentUserId) {
                  startTyping(activeConvId, currentUserId, 'Super Admin');
                }
              }}
              disabled={!activeConvId}
              placeholder="Type a message..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <div className="text-center max-w-sm px-8">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">SchoolOS Chat</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Select a school admin from the sidebar to start a conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
