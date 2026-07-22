'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { MessageSquare, Plus, Send, Loader2, ChevronLeft } from 'lucide-react';
import { connectChat, disconnectChat } from '@/lib/socket';

interface ChatUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuperAdmin: boolean;
  schoolId: string;
  school: { name: string; slug: string } | null;
  canChat: boolean;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; email: string };
}

interface Conversation {
  id: string;
  title: string | null;
  isGroup: boolean;
  updatedAt: string;
  participants: {
    id: string;
    userId: string;
    user: { id: string; name: string; email: string; isSuperAdmin: boolean };
    lastReadAt: string | null;
  }[];
  messages: Message[];
  createdAt: string;
}

export default function ChatPage() {
  const [session, setSession] = useState<{ id: string; name: string; role: string } | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, { userName: string }>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  const initSocket = useCallback(async (_sid: string, token: string) => {
    try {
      const s = await connectChat(token);
      socketRef.current = s;
      setConnected(true);

      s.on('chat:message', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
        if (activeConv?.id === msg.conversationId && s) {
          s.emit('chat:markRead', { conversationId: msg.conversationId });
        }
        setConversations((prev) =>
          prev.map((c) =>
            c.id === msg.conversationId
              ? { ...c, messages: [msg], updatedAt: new Date().toISOString() }
              : c,
          ),
        );
      });

      s.on('chat:typing', ({ conversationId, userId: tid, userName, isTyping }) => {
        if (conversationId === activeConv?.id) {
          setTypingUsers((prev) => {
            if (isTyping) return { ...prev, [tid]: { userName } };
            const { [tid]: _, ...rest } = prev;
            return rest;
          });
        }
      });

      s.on('connect', () => setConnected(true));
      s.on('disconnect', () => setConnected(false));
    } catch (err: any) {
      console.error('Socket connection failed:', err);
    }
  }, [activeConv?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/chat/conversations');
        const json = await res.json();
        if (json.success) setConversations(json.data);
        else if (json.error) setApiError(json.error);
      } catch {}
    };
    const init = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const json = await res.json();
        if (json.success) {
          const s = json.data;
          setSession(s);
          const cookieToken = document.cookie.split('; ').find((r) => r.startsWith('dev_session='));
          if (cookieToken) {
            const token = cookieToken.split('=')[1];
            await initSocket(s.id, token);
          }
        }
      } catch {} finally {
        setLoading(false);
      }
      fetchData();
    };
    init();
    return () => { disconnectChat(); };
  }, [initSocket]);

  const selectConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    setTypingUsers({});

    try {
      const res = await fetch(`/api/admin/chat/messages?conversationId=${conv.id}`);
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } catch {}

    if (socketRef.current) {
      socketRef.current.emit('chat:join', { conversationId: conv.id });
      socketRef.current.emit('chat:markRead', { conversationId: conv.id });
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !activeConv || !socketRef.current) return;
    socketRef.current.emit('chat:message', { conversationId: activeConv.id, content: input }, (res: any) => {
      if (!res.success) console.error('Send failed:', res.error);
    });
    setInput('');
  };

  const handleTyping = (isTyping: boolean) => {
    if (!activeConv || !socketRef.current) return;
    socketRef.current.emit('chat:typing', { conversationId: activeConv.id, isTyping });
  };

  const startNewChat = async (user: ChatUser) => {
    try {
      const res = await fetch('/api/admin/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: user.id }),
      });
      const json = await res.json();
      if (json.success) {
        setConversations((prev) => {
          const exists = prev.find((c) => c.id === json.data.id);
          return exists ? prev : [json.data, ...prev];
        });
        setShowNewChat(false);
        selectConversation(json.data);
      }
    } catch {}
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/chat/users');
      const json = await res.json();
      if (json.success) setUsers(json.data);
      else if (json.error) setApiError(json.error);
    } catch {}
  };

  const getOtherParticipant = (conv: Conversation) => {
    if (!session) return null;
    return conv.participants.find((p) => p.userId !== session.id)?.user || null;
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  const sortedConvs = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-9rem)] flex gap-4">
      <div className={`w-80 shrink-0 flex flex-col gap-4 ${activeConv ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Chat</h1>
          <button
            onClick={() => { loadUsers(); setShowNewChat(true); }}
            className="inline-flex items-center justify-center rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            title="New conversation"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {apiError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
            {apiError}
          </div>
        )}

        {showNewChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNewChat(false)}>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">New Conversation</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {users
                  .filter((u) => u.canChat)
                  .map((u) => (
                    <button
                      key={u.id}
                      onClick={() => startNewChat(u)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.role} - {u.school?.name || 'Platform'}</p>
                      </div>
                    </button>
                  ))}
                {users.filter((u) => u.canChat).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No users available to chat with</p>
                )}
              </div>
            </div>
          </div>
        )}

        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            {sortedConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <button onClick={() => { loadUsers(); setShowNewChat(true); }} className="mt-3 text-sm text-primary hover:underline">
                  Start a chat
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 h-full overflow-y-auto">
                {sortedConvs.map((conv) => {
                  const other = getOtherParticipant(conv);
                  const lastMsg = conv.messages[0];
                  return (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${activeConv?.id === conv.id ? 'bg-primary/5' : ''}`}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                        {other ? other.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{other?.name || 'Unknown'}</p>
                          {lastMsg && <span className="text-xs text-muted-foreground shrink-0 ml-2">{formatTime(lastMsg.createdAt)}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {lastMsg ? lastMsg.content : 'No messages yet'}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {other?.email || ''}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden lg:flex' : 'flex'}`}>
        {!activeConv ? (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-sm text-muted-foreground mt-1">Choose a chat from the left or start a new one</p>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 py-3 px-4 shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveConv(null)} className="lg:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                  {(() => {
                    const other = getOtherParticipant(activeConv);
                    return other ? other.name.charAt(0).toUpperCase() : '?';
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-semibold truncate">
                    {(() => {
                      const other = getOtherParticipant(activeConv);
                      return other?.name || 'Unknown';
                    })()}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {connected ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.senderId === session?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                        isMine
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-slate-100 dark:bg-slate-800 rounded-bl-sm'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {Object.keys(typingUsers).length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg rounded-bl-sm px-3 py-2 text-sm text-muted-foreground italic">
                    {Object.values(typingUsers)[0].userName} is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="border-t border-slate-200 dark:border-slate-800 p-3 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (!typingTimeoutRef.current) handleTyping(true);
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => {
                      handleTyping(false);
                      typingTimeoutRef.current = null;
                    }, 2000);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="inline-flex items-center justify-center rounded-md bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
