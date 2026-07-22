'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Plus, Send, Search, CheckCheck } from 'lucide-react';
import { Card, CardContent, Button, Input, Avatar, cn } from '@schoolos/ui';
import { connectChat, disconnectChat, getSocket } from '@/lib/socket';
import { toast } from 'sonner';
import { PageHeader } from '@/features/school-admin/components/page-header';
import type { Socket } from 'socket.io-client';

interface ChatUser {
  id: string; name: string; email: string; avatar: string | null;
  isSuperAdmin: boolean;
  userRoles: { role: { slug: string; name: string } }[];
}

interface Sender {
  id: string; name: string; email: string; avatar: string | null;
}

interface Message {
  id: string; conversationId: string; senderId: string;
  content: string; createdAt: string; sender: Sender;
}

interface Participant {
  userId: string; user: Sender;
  lastReadAt: string | null;
}

interface Conversation {
  id: string; title: string | null; isGroup: boolean;
  updatedAt: string; createdAt: string;
  participants: Participant[];
  messages: { sender: { id: string; name: string }; content: string; createdAt: string }[];
}

async function fetchToken() {
  const res = await fetch('/api/school-admin/chat/socket-token');
  const json = await res.json();
  if (json.success) return json.data as { token: string; userId: string; name: string; email: string; role: string };
  return null;
}

export default function SchoolAdminChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [myId, setMyId] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [loadingConv, setLoadingConv] = useState(true);
  const [typing, setTyping] = useState<{ userId: string; userName: string } | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    (async () => {
      const info = await fetchToken();
      if (!info) { toast.error('Failed to authenticate chat'); return; }
      setMyId(info.userId);
      try {
        const s = await connectChat(info.token);
        setSocket(s);
      } catch { toast.error('Failed to connect to chat server'); }
    })();
    return () => { disconnectChat(); };
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/school-admin/chat/conversations');
      const json = await res.json();
      if (json.success) setConversations(json.data);
    } catch { /* ignore */ }
    finally { setLoadingConv(false); }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const fetchMessages = useCallback(async (convId: string) => {
    const res = await fetch(`/api/school-admin/chat/messages?conversationId=${convId}`);
    const json = await res.json();
    if (json.success) setMessages(json.data);
  }, []);

  const openConversation = useCallback(async (convId: string) => {
    setActiveConv(convId);
    setMessages([]);
    fetchMessages(convId);
    const sock = getSocket();
    if (sock?.connected) {
      sock.emit('chat:join', { conversationId: convId });
      sock.emit('chat:markRead', { conversationId: convId });
    }
  }, [fetchMessages]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (msg: Message) => {
      if (msg.conversationId === activeConv) setMessages((prev) => [...prev, msg]);
    };
    const onTyping = (data: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => {
      if (data.conversationId === activeConv && data.userId !== myId) {
        setTyping(data.isTyping ? { userId: data.userId, userName: data.userName } : null);
      }
    };
    socket.on('chat:message', onMessage);
    socket.on('chat:typing', onTyping);
    return () => { socket.off('chat:message', onMessage); socket.off('chat:typing', onTyping); };
  }, [socket, activeConv, myId]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return;
    const content = input.trim();
    setInput('');
    const sock = getSocket();
    if (!sock?.connected) { toast.error('Not connected'); return; }
    sock.emit('chat:message', { conversationId: activeConv, content }, (res: any) => {
      if (res?.error) toast.error(res.error);
      else fetchConversations();
    });
    sock.emit('chat:typing', { conversationId: activeConv, isTyping: false });
  };

  const handleTyping = (val: string) => {
    setInput(val);
    const sock = getSocket();
    if (!activeConv || !sock?.connected) return;
    sock.emit('chat:typing', { conversationId: activeConv, isTyping: true });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      sock.emit('chat:typing', { conversationId: activeConv, isTyping: false });
    }, 2000);
  };

  const startConversation = async (targetId: string) => {
    const res = await fetch('/api/school-admin/chat/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId: targetId }),
    });
    const json = await res.json();
    if (json.success) {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === json.data.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = json.data;
          return updated;
        }
        return [json.data, ...prev];
      });
      setShowNewChat(false);
      openConversation(json.data.id);
    } else {
      toast.error(json.error || 'Failed to create conversation');
    }
  };

  const convPartner = (conv: Conversation): Sender | undefined =>
    conv.participants.find((p) => p.userId !== myId)?.user;

  const isUnread = (conv: Conversation): boolean => {
    const lastMsg = conv.messages?.[0];
    if (!lastMsg) return false;
    const me = conv.participants.find((p) => p.userId === myId);
    if (!me?.lastReadAt) return lastMsg.sender.id !== myId;
    return new Date(lastMsg.createdAt) > new Date(me.lastReadAt) && lastMsg.sender.id !== myId;
  };

  const activeConvData = conversations.find((c) => c.id === activeConv);
  const activePartner = activeConvData ? convPartner(activeConvData) : undefined;

  return (
    <div className="space-y-4">
      <PageHeader title="Chat" description="Real-time messaging with staff" />
      <div className="flex h-[calc(100vh-12rem)] gap-4">
        <Card className="w-80 shrink-0 flex flex-col">
          <CardContent className="p-3 border-b">
            <Button size="sm" className="w-full gap-2" onClick={() => setShowNewChat(true)}>
              <Plus className="h-4 w-4" /> New Chat
            </Button>
          </CardContent>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingConv ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-2 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              ))
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">No conversations</p>
                <p className="text-xs">Start a new chat with staff</p>
              </div>
            ) : conversations.map((conv) => {
              const partner = convPartner(conv);
              const lastMsg = conv.messages?.[0];
              const unread = isUnread(conv);
              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv.id)}
                  className={cn(
                    'flex items-center gap-3 w-full rounded-lg p-2.5 text-left transition-colors',
                    activeConv === conv.id ? 'bg-primary/10' : 'hover:bg-muted',
                  )}
                >
                  <Avatar size="sm" fallback={partner?.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn('text-sm truncate', unread && 'font-semibold')}>
                        {partner?.name || conv.title || 'Unknown'}
                      </p>
                      {unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    {lastMsg && (
                      <p className="text-xs text-muted-foreground truncate">{lastMsg.content}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="flex-1 flex flex-col">
          {activeConv ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b">
                <Avatar size="sm" fallback={activePartner?.name} />
                <div>
                  <p className="text-sm font-medium">{activePartner?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{activePartner?.email}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.senderId === myId;
                  return (
                    <div key={msg.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-2',
                        isMine ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md',
                      )}>
                        {!isMine && <p className="text-[10px] font-medium opacity-70 mb-0.5">{msg.sender.name}</p>}
                        <p className="text-sm">{msg.content}</p>
                        <div className={cn('flex items-center gap-1 mt-0.5', isMine ? 'justify-end' : 'justify-start')}>
                          <span className="text-[10px] opacity-60">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && <CheckCheck className="h-3 w-3 opacity-60 inline" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {typing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    {typing.userName} is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-sm mt-1">Choose a chat from the left or start a new one</p>
            </div>
          )}
        </Card>
      </div>

      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNewChat(false)}>
          <Card className="w-96 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Start a New Chat</h3>
              <NewChatUserList onSelect={startConversation} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function NewChatUserList({ onSelect }: { onSelect: (id: string) => void }) {
  const [users, setUsers] = useState<ChatUser[]>([]);
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
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />)}</div>;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
      ) : filtered.map((u) => (
        <button
          key={u.id}
          onClick={() => onSelect(u.id)}
          className="flex items-center gap-3 w-full rounded-lg p-2.5 hover:bg-muted transition-colors text-left"
        >
          <Avatar size="sm" fallback={u.name} />
          <div>
            <p className="text-sm font-medium">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.userRoles?.map((r) => r.role.name).join(', ') || u.email}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
