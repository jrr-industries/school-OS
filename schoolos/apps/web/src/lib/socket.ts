import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let currentToken: string | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export async function connectChat(token: string): Promise<Socket> {
  const s = getSocket();
  if (s.connected) {
    if (currentToken === token) return s;
    s.disconnect();
  }
  currentToken = token;
  s.auth = { token };
  s.connect();
  return new Promise((resolve, reject) => {
    s.on('connect', () => resolve(s));
    s.on('connect_error', (err) => reject(err));
    setTimeout(() => reject(new Error('Connection timeout')), 10000);
  });
}

export async function fetchSocketToken(): Promise<{
  token: string; userId: string; name: string; email: string; role: string;
} | null> {
  try {
    const res = await fetch('/api/admin/chat/socket-token');
    const json = await res.json();
    if (json.success) return json.data;
    return null;
  } catch {
    return null;
  }
}

export function disconnectChat(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  currentToken = null;
}

export function getCurrentSocket(): Socket | null {
  return socket;
}
