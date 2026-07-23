'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Paperclip, Image, Mic, Square, X, Search, MessageSquare, Plus, CheckCheck, Pause, Play } from 'lucide-react';
import { cn } from '@schoolos/ui';
import { connectChat, disconnectChat, getSocket } from '@/lib/socket';
import { toast } from 'sonner';
import type { Socket } from 'socket.io-client';

interface Sender {
  id: string; name: string; email: string; avatar: string | null;
}

interface Message {
  id: string; conversationId: string; senderId: string;
  content: string; messageType: string; fileUrl: string | null; fileName: string | null; fileSize: number | null;
  createdAt: string; sender: Sender;
}

interface Participant {
  userId: string; user: Sender; lastReadAt: string | null;
}

interface Conversation {
  id: string; title: string | null; isGroup: boolean;
  updatedAt: string;
  participants: Participant[];
  messages: { id: string; content: string; createdAt: string; sender: { id: string; name: string }; messageType?: string }[];
}

async function fetchToken() {
  try {
    const res = await fetch('/api/school-admin/chat/socket-token');
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success) return json.data as { token: string; userId: string; name: string; email: string; role: string };
  } catch { /* ignore */ }
  return null;
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

function formatFullTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isToday(date: Date) {
  return date.toDateString() === new Date().toDateString();
}

function isYesterday(date: Date) {
  const y = new Date(); y.setDate(y.getDate() - 1);
  return date.toDateString() === y.toDateString();
}

function formatDateSeparator(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function getAvatarChar(name: string) {
  return name?.charAt(0).toUpperCase() ?? '?';
}

export default function SchoolAdminChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [myId, setMyId] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState('');
  const [gifResults, setGifResults] = useState<{ url: string; preview: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
    try {
      const res = await fetch(`/api/school-admin/chat/messages?conversationId=${convId}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } catch { /* ignore */ }
  }, []);

  const openConversation = useCallback(async (convId: string) => {
    setActiveConvId(convId);
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
      if (msg.conversationId === activeConvId) setMessages((prev) => [...prev, msg]);
      fetchConversations();
    };
    socket.on('chat:message', onMessage);
    return () => { socket.off('chat:message', onMessage); };
  }, [socket, activeConvId, fetchConversations]);

  const convPartner = (conv: Conversation): Sender | undefined =>
    conv.participants.find((p) => p.userId !== myId)?.user;

  const isUnread = (conv: Conversation): boolean => {
    const lastMsg = conv.messages?.[0];
    if (!lastMsg) return false;
    const me = conv.participants.find((p) => p.userId === myId);
    if (!me?.lastReadAt) return lastMsg.sender.id !== myId;
    return new Date(lastMsg.createdAt) > new Date(me.lastReadAt) && lastMsg.sender.id !== myId;
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const partner = activeConv ? convPartner(activeConv) : undefined;

  const startConversation = async (targetId: string) => {
    try {
      const res = await fetch('/api/school-admin/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: targetId }),
      });
      if (!res.ok) { toast.error(`Request failed (${res.status})`); return; }
      const json = await res.json();
      if (json.success) {
        setConversations((prev) => {
          const idx = prev.findIndex((c) => c.id === json.data.id);
          if (idx >= 0) { const u = [...prev]; u[idx] = json.data; return u; }
          return [json.data, ...prev];
        });
        setShowNewChat(false);
        openConversation(json.data.id);
      } else toast.error(json.error || 'Failed to create conversation');
    } catch { toast.error('Failed to create conversation'); }
  };

  const sendText = async (content: string) => {
    if (!content.trim() || !activeConvId) return;
    const sock = getSocket();
    if (!sock?.connected) { toast.error('Not connected'); return; }
    sock.emit('chat:message', { conversationId: activeConvId, content: content.trim() });
    sock.emit('chat:typing', { conversationId: activeConvId, isTyping: false });
  };

  const sendFile = async (file: File, messageType: string) => {
    if (!activeConvId) return;
    const sock = getSocket();
    if (!sock?.connected) { toast.error('Not connected'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      sock.emit('chat:message', {
        conversationId: activeConvId,
        content: '',
        messageType,
        fileUrl: json.data.url,
        fileName: json.data.name,
        fileSize: json.data.size,
      });
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const sendGif = async (gifUrl: string) => {
    if (!activeConvId) return;
    const sock = getSocket();
    if (!sock?.connected) { toast.error('Not connected'); return; }
    sock.emit('chat:message', {
      conversationId: activeConvId,
      content: '',
      messageType: 'image',
      fileUrl: gifUrl,
      fileName: 'gif.gif',
    });
    setShowGifPicker(false);
  };

  const sendVoice = async () => {
    if (!recordingBlob || !activeConvId) return;
    const file = new File([recordingBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
    setRecordingBlob(null);
    setIsRecording(false);
    setRecordingTime(0);
    await sendFile(file, 'voice');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        setRecordingBlob(new Blob(chunks, { type: 'audio/webm' }));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch { toast.error('Microphone access denied'); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    mediaRecorderRef.current?.stop();
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setRecordingBlob(null);
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { sendFile(file, 'image'); e.target.value = ''; }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { sendFile(file, 'document'); e.target.value = ''; }
  };

  const searchGifs = useCallback(async (query: string) => {
    setGifSearch(query);
    if (!query.trim()) { setGifResults([]); return; }
    const apiKey = process.env.NEXT_PUBLIC_TENOR_API_KEY;
    if (!apiKey) return;
    try {
      const res = await fetch(`https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${apiKey}&limit=20`);
      const json = await res.json();
      if (json.results) {
        setGifResults(json.results.map((r: any) => ({
          url: r.media_formats?.gif?.url ?? r.url,
          preview: r.media_formats?.tinygif?.url ?? r.media_formats?.gif?.url ?? '',
        })));
      }
    } catch { /* ignore */ }
  }, []);

  const sortedConvs = [...conversations].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

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
          ) : sortedConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 mb-3" />
              <p className="text-sm font-medium">No conversations</p>
              <p className="text-xs mt-1">Start a new chat with staff</p>
            </div>
          ) : sortedConvs.map((conv) => {
            const p = convPartner(conv);
            const lastMsg = conv.messages?.[0];
            const unread = isUnread(conv);
            return (
              <button
                key={conv.id}
                onClick={() => openConversation(conv.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-border/50 last:border-0',
                  activeConvId === conv.id ? 'bg-primary/5' : 'hover:bg-muted/50'
                )}
              >
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0 relative">
                  {p ? getAvatarChar(p.name) : '?'}
                  {unread && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn('text-sm truncate', unread && 'font-semibold')}>{p?.name || conv.title || 'Unknown'}</p>
                    {lastMsg && <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{formatTime(lastMsg.createdAt)}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {lastMsg?.messageType === 'image' ? '📷 Photo'
                      : lastMsg?.messageType === 'voice' ? '🎤 Voice message'
                      : lastMsg?.messageType === 'document' ? '📎 File'
                      : lastMsg?.content || 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeConv && partner ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-base font-medium text-primary shrink-0">
                {getAvatarChar(partner.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{partner.name}</p>
                <p className="text-xs text-muted-foreground">{partner.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-muted/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mb-3" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs mt-1">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.senderId === myId;
                  const showAvatar = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId;
                  const showDateSep = idx === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();

                  return (
                    <div key={msg.id}>
                      {showDateSep && (
                        <div className="flex items-center gap-3 py-2">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs font-medium text-muted-foreground shrink-0">{formatDateSeparator(msg.createdAt)}</span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}
                      <div className={cn('flex items-end gap-2 group', isMine ? 'justify-end' : 'justify-start')}>
                        {!isMine && (
                          <div className={cn(
                            'h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0',
                            showAvatar ? 'opacity-100' : 'opacity-0'
                          )}>
                            {getAvatarChar(msg.sender.name)}
                          </div>
                        )}
                        <div className={cn('max-w-[75%] sm:max-w-[65%]', isMine ? 'items-end' : 'items-start')}>
                          {msg.messageType === 'image' && msg.fileUrl ? (
                            <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
                              <img
                                src={msg.fileUrl}
                                alt={msg.fileName ?? 'Image'}
                                className="max-w-full max-h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                loading="lazy"
                              />
                              <div className={cn('flex items-center gap-1 px-3 py-1.5', isMine ? 'bg-primary' : 'bg-card')}>
                                <span className={cn('text-[10px]', isMine ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{formatFullTime(msg.createdAt)}</span>
                                {isMine && <CheckCheck className="h-3 w-3 text-primary-foreground/70" />}
                              </div>
                            </div>
                          ) : msg.messageType === 'voice' && msg.fileUrl ? (
                            <div className={cn('rounded-2xl px-4 py-3 shadow-sm', isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border rounded-bl-sm')}>
                              <VoicePlayer src={msg.fileUrl} isMine={isMine} />
                              <div className={cn('flex items-center gap-1 mt-1', isMine ? 'justify-end' : 'justify-start')}>
                                <span className="text-[10px] opacity-60">{formatFullTime(msg.createdAt)}</span>
                                {isMine && <CheckCheck className="h-3 w-3 opacity-60" />}
                              </div>
                            </div>
                          ) : msg.messageType === 'document' && msg.fileUrl ? (
                            <div className={cn('rounded-2xl px-4 py-3 shadow-sm', isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border rounded-bl-sm')}>
                              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 shrink-0" />
                                <span className="text-sm truncate">{msg.fileName ?? 'File'}</span>
                              </a>
                              <div className={cn('flex items-center gap-1 mt-1', isMine ? 'justify-end' : 'justify-start')}>
                                <span className="text-[10px] opacity-60">{formatFullTime(msg.createdAt)}</span>
                                {isMine && <CheckCheck className="h-3 w-3 opacity-60" />}
                              </div>
                            </div>
                          ) : (
                            <div className={cn('rounded-2xl px-4 py-2 shadow-sm', isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border rounded-bl-sm')}>
                              {!isMine && msg.sender.name && (
                                <p className="text-[10px] font-medium opacity-70 mb-0.5">{msg.sender.name}</p>
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                              <div className={cn('flex items-center gap-1 mt-0.5', isMine ? 'justify-end' : 'justify-start')}>
                                <span className="text-[10px] opacity-60">{formatFullTime(msg.createdAt)}</span>
                                {isMine && <CheckCheck className="h-3 w-3 opacity-60" />}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              {showGifPicker && (
                <div className="border-b p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        value={gifSearch}
                        onChange={(e) => searchGifs(e.target.value)}
                        placeholder="Search GIFs..."
                        className="w-full h-8 rounded-lg border-0 bg-muted pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <button onClick={() => setShowGifPicker(false)} className="p-1 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {gifSearch && !process.env.NEXT_PUBLIC_TENOR_API_KEY ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Set NEXT_PUBLIC_TENOR_API_KEY in your .env for GIF search
                    </p>
                  ) : gifResults.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto">
                      {gifResults.map((gif, i) => (
                        <button key={i} onClick={() => sendGif(gif.url)} className="rounded overflow-hidden hover:opacity-80 transition-opacity">
                          <img src={gif.preview || gif.url} alt="GIF" className="w-full h-20 object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  ) : gifSearch ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No GIFs found</p>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">Type to search GIFs</p>
                  )}
                </div>
              )}

              {isRecording || recordingBlob ? (
                <div className="p-3 flex items-center gap-3">
                  <button onClick={cancelRecording} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-medium">
                        {isRecording ? `Recording ${recordingTime}s` : `Voice ${recordingTime}s`}
                      </span>
                    </div>
                    <div className="flex-1 h-1 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${Math.min((recordingTime / 30) * 100, 100)}%` }} />
                    </div>
                  </div>
                  {isRecording ? (
                    <button onClick={stopRecording} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                      <Square className="h-4 w-4" />
                    </button>
                  ) : (
                    <button onClick={sendVoice} className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <ChatInput
                  activeConvId={activeConvId}
                  onSend={sendText}
                  onStartRecording={startRecording}
                  onImageClick={() => imageInputRef.current?.click()}
                  onFileClick={() => fileInputRef.current?.click()}
                  onGifClick={() => { setShowGifPicker((prev) => !prev); setGifSearch(''); setGifResults([]); }}
                  uploading={uploading}
                />
              )}
            </div>

            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
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

function ChatInput({
  activeConvId, onSend, onStartRecording, onImageClick, onFileClick, onGifClick, uploading,
}: {
  activeConvId: string | null; onSend: (text: string) => void; onStartRecording: () => void;
  onImageClick: () => void; onFileClick: () => void; onGifClick: () => void; uploading: boolean;
}) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { if (activeConvId) inputRef.current?.focus(); }, [activeConvId]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="p-3 flex items-end gap-2">
      <div className="flex items-center gap-1">
        <button onClick={onImageClick} disabled={!activeConvId || uploading} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors disabled:opacity-40" title="Send photo">
          <Image className="h-5 w-5" />
        </button>
        <button onClick={onGifClick} disabled={!activeConvId || uploading} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors disabled:opacity-40" title="GIF">
          <span className="text-sm font-bold tracking-wide leading-none">GIF</span>
        </button>
        <button onClick={onStartRecording} disabled={!activeConvId || uploading} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors disabled:opacity-40" title="Voice message">
          <Mic className="h-5 w-5" />
        </button>
        <button onClick={onFileClick} disabled={!activeConvId || uploading} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors disabled:opacity-40" title="Attach file">
          <Paperclip className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const sock = getSocket();
            if (activeConvId && sock?.connected) {
              sock.emit('chat:typing', { conversationId: activeConvId, isTyping: true });
              if (typingRef.current) clearTimeout(typingRef.current);
              typingRef.current = setTimeout(() => {
                sock.emit('chat:typing', { conversationId: activeConvId, isTyping: false });
              }, 2000);
            }
          }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={uploading ? 'Uploading...' : 'Type a message...'}
          disabled={!activeConvId || uploading}
          className="w-full h-10 rounded-xl border border-border bg-muted/50 px-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || !activeConvId || uploading}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:opacity-40 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function VoicePlayer({ src, isMine }: { src: string; isMine: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => { setPlaying(false); if (intervalRef.current) clearInterval(intervalRef.current); };
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <audio ref={audioRef} src={src} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} preload="metadata" />
      <button onClick={togglePlay} className={cn('p-1 rounded-full transition-colors', isMine ? 'hover:bg-primary-foreground/20' : 'hover:bg-muted')}>
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <div className="flex-1 h-1.5 rounded-full bg-muted-foreground/20 relative cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          if (audioRef.current && duration > 0) {
            audioRef.current.currentTime = pct * duration;
            setCurrentTime(pct * duration);
          }
        }}
      >
        <div className={cn('h-full rounded-full transition-all', isMine ? 'bg-primary-foreground/60' : 'bg-primary')} style={{ width: `${progress}%` }} />
      </div>
      <span className={cn('text-[10px] min-w-[28px] text-right', isMine ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
        {duration > 0 ? formatTime(playing ? currentTime : duration - currentTime) : formatTime(0)}
      </span>
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
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
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
