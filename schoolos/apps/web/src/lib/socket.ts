import { io, type Socket } from 'socket.io-client';
import type { ChatMessage } from '@/features/chat/types';

let socket: Socket | null = null;
let currentToken: string | null = null;
let connectPromise: Promise<Socket> | null = null;

/** Rooms this client has joined (re-joined automatically on reconnect). */
const joinedRooms = new Set<string>();
let onReconnectCb: (() => void) | null = null;

export interface ChatServerEvents {
  'message:new': (payload: { conversationId: string; message: ChatMessage }) => void;
  'message:updated': (payload: { conversationId: string; message: ChatMessage }) => void;
  'message:deleted': (payload: { conversationId: string; messageId: string }) => void;
  'message:reaction': (payload: { conversationId: string; messageId: string; emoji: string; userId: string; user: { id: string; name: string; avatar: string | null }; active: boolean }) => void;
  'message:read': (payload: { conversationId: string; userId: string }) => void;
  'message:status': (payload: { conversationId: string; messageIds: string[]; status: string; byUserId: string }) => void;
  'typing:update': (payload: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => void;
  'presence:update': (payload: { userId: string; isOnline: boolean; lastSeen: string | null }) => void;
  'presence:sync': (payload: { conversationId: string; online: Record<string, boolean>; lastSeen: Record<string, string> }) => void;
}

/** Client -> Server events (single pipeline write path). */
export interface ChatClientEvents {
  'chat:join': (payload: { conversationId: string }, ack?: (res: { success?: boolean; error?: string }) => void) => void;
  'chat:leave': (payload: { conversationId: string }) => void;
  'message:send': (payload: SendMessagePayloadLike, ack: (res: { success: boolean; data?: ChatMessage; error?: string }) => void) => void;
  'message:edit': (payload: { messageId: string; content: string }, ack?: (res: { success?: boolean; error?: string }) => void) => void;
  'message:delete': (payload: { messageId: string; forEveryone?: boolean }, ack?: (res: { success?: boolean; error?: string }) => void) => void;
  'message:react': (payload: { messageId: string; emoji: string }, ack?: (res: { success?: boolean; active?: boolean; error?: string }) => void) => void;
  'message:read': (payload: { conversationId: string }, ack?: (res: { success?: boolean; error?: string }) => void) => void;
  'message:delivered': (payload: { conversationId: string; messageIds: string[] }) => void;
  'typing:update': (payload: { conversationId: string; isTyping: boolean }) => void;
}

export interface SendMessagePayloadLike {
  conversationId: string;
  content: string;
  messageType?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileId?: string;
  replyToId?: string;
  forwardedFromId?: string;
}

export type ChatSocket = Socket<ChatServerEvents, ChatClientEvents>;

function create(): Socket {
  const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002', {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
  s.on('connect', () => {
    // Re-join all rooms after (re)connect
    for (const room of joinedRooms) {
      s.emit('chat:join', { conversationId: room }, () => {});
    }
    onReconnectCb?.();
  });
  return s as unknown as Socket;
}

export function getSocket(): ChatSocket {
  if (!socket) socket = create() as unknown as ChatSocket;
  return socket;
}

export async function connectChat(token: string): Promise<ChatSocket> {
  if (socket?.connected && currentToken === token) return socket as unknown as ChatSocket;
  const s = getSocket();
  if (s.connected && currentToken !== token) s.disconnect();
  currentToken = token;
  s.auth = { token };
  if (s.connected) return s;
  if (connectPromise) return connectPromise as unknown as Promise<ChatSocket>;

  s.connect();
  connectPromise = new Promise<ChatSocket>((resolve, reject) => {
    const onConnect = () => { cleanup(); resolve(s); };
    const onError = (err: Error) => { cleanup(); reject(err); };
    const timeout = setTimeout(() => { cleanup(); reject(new Error('Connection timeout')); }, 10000);
    const cleanup = () => {
      clearTimeout(timeout);
      s.off('connect', onConnect);
      s.off('connect_error', onError);
      connectPromise = null;
    };
    s.on('connect', onConnect);
    s.on('connect_error', onError);
  });
  return connectPromise as unknown as Promise<ChatSocket>;
}

export function joinConversation(conversationId: string): void {
  const s = getSocket();
  joinedRooms.add(conversationId);
  if (s.connected) s.emit('chat:join', { conversationId }, () => {});
}

export function leaveConversation(conversationId: string): void {
  const s = getSocket();
  joinedRooms.delete(conversationId);
  if (s.connected) s.emit('chat:leave', { conversationId });
}

export function onReconnect(cb: () => void): void {
  onReconnectCb = cb;
}

export async function fetchSocketToken(
  endpoint = '/api/admin/chat/socket-token',
): Promise<{ token: string; userId: string; name: string; email: string; role: string } | null> {
  try {
    const res = await fetch(endpoint);
    const json = await res.json();
    if (json.success) return json.data;
    return null;
  } catch {
    return null;
  }
}

export function disconnectChat(): void {
  joinedRooms.clear();
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  currentToken = null;
  connectPromise = null;
  onReconnectCb = null;
}

export function getCurrentSocket(): ChatSocket | null {
  return (socket as unknown as ChatSocket) ?? null;
}