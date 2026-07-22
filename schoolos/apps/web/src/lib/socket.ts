import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

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
  if (s.connected) return s;
  s.auth = { token };
  s.connect();
  return new Promise((resolve, reject) => {
    s.on('connect', () => resolve(s));
    s.on('connect_error', (err) => reject(err));
    setTimeout(() => reject(new Error('Connection timeout')), 10000);
  });
}

export function disconnectChat(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
