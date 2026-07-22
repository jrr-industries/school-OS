const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
});

const DEV_SECRET = 'schoolos-dev-secret-key-do-not-use-in-production';

async function verifyToken(token) {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(DEV_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPayload));
    const expectedSig = Buffer.from(expectedSigBuffer).toString('base64');
    if (signature !== expectedSig) return null;
    const payload = Buffer.from(encodedPayload, 'base64').toString();
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next(new Error('Authentication required'));

  const session = await verifyToken(token);
  if (!session) return next(new Error('Invalid session'));

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, isSuperAdmin: true, schoolId: true },
  });
  if (!user) return next(new Error('User not found'));

  const role = user.isSuperAdmin ? 'SUPER_ADMIN' : 'SCHOOL_ADMIN';
  socket.data.user = { ...user, role };
  next();
});

io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`[chat] ${user.name} (${user.role}) connected`);

  socket.join(`user:${user.id}`);

  socket.on('chat:join', async ({ conversationId }, callback) => {
    try {
      const participant = await prisma.chatConversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId, userId: user.id } },
      });
      if (!participant) return callback?.({ error: 'Not a participant' });
      socket.join(`conversation:${conversationId}`);
      callback?.({ success: true });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  socket.on('chat:message', async ({ conversationId, content }, callback) => {
    try {
      if (!content?.trim()) return callback?.({ error: 'Message is required' });

      const participant = await prisma.chatConversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId, userId: user.id } },
        include: {
          conversation: {
            include: {
              participants: {
                include: { user: { select: { id: true, name: true, email: true } } },
              },
            },
          },
        },
      });
      if (!participant) return callback?.({ error: 'Not a participant' });

      const message = await prisma.chatMessage.create({
        data: { conversationId, senderId: user.id, content },
        include: { sender: { select: { id: true, name: true, email: true } } },
      });

      await prisma.chatConversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      io.to(`conversation:${conversationId}`).emit('chat:message', message);
      callback?.({ success: true, data: message });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  socket.on('chat:typing', ({ conversationId, isTyping }) => {
    socket.to(`conversation:${conversationId}`).emit('chat:typing', {
      conversationId,
      userId: user.id,
      userName: user.name,
      isTyping,
    });
  });

  socket.on('chat:markRead', async ({ conversationId }, callback) => {
    try {
      await prisma.chatConversationParticipant.update({
        where: { conversationId_userId: { conversationId, userId: user.id } },
        data: { lastReadAt: new Date() },
      });
      callback?.({ success: true });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[chat] ${user.name} disconnected`);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`[socket.io] Chat server running on port ${PORT}`);
});
