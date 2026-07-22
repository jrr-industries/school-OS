'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@schoolos/ui';
import { MessageSquare, Plus, Send, Loader2, Search, Check, CheckCheck } from 'lucide-react';
import { connectChat, fetchSocketToken, disconnectChat } from '@/lib/socket';
import type { Socket } from 'socket.io-client';
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

interface Sender {
  id: string; name: string; email: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: Sender;
}

interface Participant {
  id: string;
  userId: string;
  user: Sender & { isSuperAdmin: boolean };
  lastReadAt: string | null;
}

interface Conversation {
  id: string;
  title: string | null;
  isGroup: boolean;
  updatedAt: string;
  participants: Participant[];
  messages: Message[];
  createdAt: string;
}

interface SocketInfo {
  token: string; userId: string; name: string; email: string; role: string;
}

export default function ChatPage() {
  const [socketInfo, setSocketInfo] = useState<SocketInfo | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, { userName: string }>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const socketRef = useRef<Socket | null>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const realUserId = socketInfo?.userId;

  useEffect(() => {
    const init = async () => {
      try {
        const info = await fetchSocketToken();
        if (!info) { setLoading(false); return; }
        setSocketInfo(info);

        const s = await connectChat(info.token);
        socketRef.current = s;
        setSocketConnected(true);

        s.on('chat:message', (msg: Message) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setConversations((prev) => prev.map((c) =>
            c.id === msg.conversationId
              ? { ...c, updatedAt: msg.createdAt, messages: [msg, ...c.messages.filter((m) => m.id !== msg.id).slice(0, 0)] }
              : c
          ));
        });

        s.on('chat:typing', (data: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => {
          if (!data.isTyping) {
            setTypingUsers((prev) => { const next = { ...prev }; delete next[data.userId]; return next; });
            if (typingTimers.current[data.userId]) { clearTimeout(typingTimers.current[data.userId]); delete typingTimers.current[data.userId]; }
          } else {
            setTypingUsers((prev) => ({ ...prev, [data.userId]: { userName: data.userName } }));
            if (typingTimers.current[data.userId]) clearTimeout(typingTimers.current[data.userId]);
            typingTimers.current[data.userId] = setTimeout(() => {
              setTypingUsers((prev) => { const next = { ...prev }; delete next[data.userId]; return next; });
              delete typingTimers.current[data.userId];
            }, 4000);
          }
        });

        const res = await fetch('/api/admin/chat/conversations');
        const json = await res.json();
        if (json.success) setConversations(json.data);
        else if (json.error) setApiError(json.error);
      } catch (e) {
        setSocketError(e instanceof Error ? e.message : 'Connection failed');
      } finally {
        setLoading(false);
      }
    };
    init();
    return () => { disconnectChat(); socketRef.current = null; };
  }, []);

  const selectConversation = useCallback(async (conv: Conversation) => {
    setActiveConv(conv);
    setTypingUsers({});
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:join', { conversationId: conv.id }, (res: { success?: boolean; error?: string }) => {
        if (res?.error) setApiError(res.error);
      });
    }
    try {
      const res = await fetch(`/api/admin/chat/messages?conversationId=${conv.id}`);
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
        setTimeout(scrollToBottom, 50);
      }
      if (socketRef.current?.connected) {
        socketRef.current.emit('chat:markRead', { conversationId: conv.id });
      }
    } catch {}
  }, []);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !activeConv || !socketRef.current?.connected) return;
    const content = input;
    setInput('');
    const msg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: realUserId || '',
      content,
      createdAt: new Date().toISOString(),
      sender: { id: realUserId || '', name: socketInfo?.name || '', email: socketInfo?.email || '' },
    };
    setMessages((prev) => [...prev, msg]);
    setConversations((prev) => prev.map((c) =>
      c.id === activeConv.id
        ? { ...c, updatedAt: msg.createdAt, messages: [msg, ...c.messages.slice(0, 0)] }
        : c
    ));
    socketRef.current.emit('chat:message', { conversationId: activeConv.id, content }, (res: any) => {
      if (res?.success && res.data) {
        setMessages((prev) => prev.map((m) => m.id === msg.id ? res.data : m));
      }
    });
  }, [input, activeConv, realUserId, socketInfo]);

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
      } else {
        setApiError(json.error);
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
    if (!realUserId) return null;
    return conv.participants.find((p) => p.userId !== realUserId)?.user || null;
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

  const getLastMessage = (conv: Conversation) => {
    if (conv.messages.length > 0) return conv.messages[0];
    return null;
  };

  const sortedConvs = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const filteredConvs = sortedConvs.filter((conv) => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(conv);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           other?.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleTyping = useCallback(() => {
    if (!activeConv || !socketRef.current?.connected) return;
    socketRef.current.emit('chat:typing', { conversationId: activeConv.id, isTyping: true });
    if (typingTimers.current['typing']) clearTimeout(typingTimers.current['typing']);
    typingTimers.current['typing'] = setTimeout(() => {
      socketRef.current?.emit('chat:typing', { conversationId: activeConv.id, isTyping: false });
    }, 3000);
  }, [activeConv]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-9rem)] flex rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Left Panel - Conversation List */}
      <div className={`w-80 lg:w-96 border-r dark:border-slate-800 flex flex-col ${activeConv ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-3 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold">Chats</h1>
            <div className="flex items-center gap-2">
              <div className={cn('h-2 w-2 rounded-full', socketConnected ? 'bg-green-500' : 'bg-red-500')} title={socketConnected ? 'Connected' : 'Disconnected'} />
              <button
                onClick={() => { loadUsers(); setShowNewChat(true); }}
                className="rounded-full p-2 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="New conversation"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-lg border-0 bg-slate-100 dark:bg-slate-800 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {apiError && (
          <div className="mx-3 mt-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-2 text-xs text-red-700 dark:text-red-400">
            {apiError}
          </div>
        )}

        {socketError && (
          <div className="mx-3 mt-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-2 text-xs text-amber-700 dark:text-amber-400">
            Socket: {socketError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <button onClick={() => { loadUsers(); setShowNewChat(true); }} className="mt-2 text-sm text-primary hover:underline">
                Start a chat
              </button>
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const other = getOtherParticipant(conv);
              const lastMsg = getLastMessage(conv);
              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b dark:border-slate-800/50',
                    activeConv?.id === conv.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                  )}
                >
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
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
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel - Chat View */}
      <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden lg:flex' : 'flex'}`}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center p-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">SchoolOS Chat</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Select a conversation from the left or start a new chat to begin messaging
              </p>
              {socketConnected && <p className="text-xs text-green-600 dark:text-green-400 mt-2">Connected</p>}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <button onClick={() => setActiveConv(null)} className="lg:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-base font-medium text-primary shrink-0">
                {(() => {
                  const other = getOtherParticipant(activeConv);
                  return other ? other.name.charAt(0).toUpperCase() : '?';
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {(() => {
                    const other = getOtherParticipant(activeConv);
                    return other?.name || 'Unknown';
                  })()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(() => {
                    const other = getOtherParticipant(activeConv);
                    return other?.email || '';
                  })()}
                </p>
              </div>
              <div className={cn('h-2 w-2 rounded-full', socketConnected ? 'bg-green-500' : 'bg-red-500')} title={socketConnected ? 'Connected' : 'Disconnected'} />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#e8dcd5] dark:bg-slate-950">
              {messages.map((msg, idx) => {
                const isMine = msg.senderId === realUserId;
                const showAvatar = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId;
                const isTemp = msg.id.startsWith('temp-');
                return (
                  <div key={msg.id} className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}>
                    {!isMine && (
                      <div className={cn('h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0', showAvatar ? 'opacity-100' : 'opacity-0')}>
                        {msg.sender.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[70%] px-3 py-2 text-sm shadow-sm',
                        isMine
                          ? 'bg-[#d9fdd3] dark:bg-primary/20 rounded-lg rounded-br-sm'
                          : 'bg-white dark:bg-slate-800 rounded-lg rounded-bl-sm',
                        isTemp && 'opacity-70'
                      )}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                      <div className={cn('flex items-center justify-end gap-1 text-[10px] mt-0.5', isMine ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground')}>
                        <span>{formatTime(msg.createdAt)}</span>
                        {isMine && (isTemp ? <Check className="h-3 w-3" /> : <CheckCheck className="h-3 w-3" />)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {Object.values(typingUsers).length > 0 && (
                <div className="flex items-end gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                    {getOtherParticipant(activeConv)?.name.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg rounded-bl-sm px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex h-11 w-full rounded-lg border border-input bg-white dark:bg-slate-800 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || !socketConnected}
                  className="inline-flex items-center justify-center rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNewChat(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">New Conversation</h2>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {users
                .filter((u) => u.canChat)
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => startNewChat(u)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
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
    </div>
  );
}
