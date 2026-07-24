// ============================================================
// SchoolOS Chat — Socket.IO Server (single realtime pipeline)
// Pipeline: Client -> Auth -> Permission -> Prisma -> Commit -> Broadcast (conversation rooms only)
// Plain JS + @prisma/client. Permission matrix is enforced at
// conversation-creation time (server actions); here we enforce
// authentication, tenant isolation (schoolId) and participant membership.
// ============================================================

const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true },
  pingInterval: 20000,
  pingTimeout: 25000,
});

const DEV_SECRET = process.env.DEV_SESSION_SECRET || 'schoolos-dev-secret-key-do-not-use-in-production';
const subtle = globalThis.crypto.subtle;

// In-memory presence: userId -> Set<socketId>; lastSeen: userId -> ISO string
const onlineSockets = new Map();
const lastSeen = new Map();
/** conversationId -> Set<userId> participants cache (kept warm per process) */
const convParticipants = new Map();

async function verifyToken(token) {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;
    // Signature is over the raw JSON payload string (matches dev-session/socket-token signing).
    const rawPayload = Buffer.from(encodedPayload, 'base64').toString();
    const key = await subtle.importKey(
      'raw',
      new TextEncoder().encode(DEV_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const ok = await subtle.verify('HMAC', key, Buffer.from(signature, 'base64'), new TextEncoder().encode(rawPayload));
    if (!ok) return null;
    return JSON.parse(rawPayload);
  } catch {
    return null;
  }
}

async function loadUser(session) {
  // Authenticate against the real database user. Never auto-create. Never hardcode roles.
  return prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      schoolId: true,
      isSuperAdmin: true,
      status: true,
      deletedAt: true,
      userRoles: { select: { role: { select: { slug: true } } } },
    },
  });
}

const messageInclude = {
  sender: { select: { id: true, name: true, email: true, avatar: true } },
  replyTo: { select: { id: true, conversationId: true, senderId: true, content: true, messageType: true, fileUrl: true, fileName: true, createdAt: true, sender: { select: { id: true, name: true, avatar: true } } } },
  forwardedFrom: { select: { id: true, content: true, senderId: true, createdAt: true, sender: { select: { id: true, name: true } } } },
  file: { select: { id: true, name: true, originalName: true, mimeType: true, size: true, path: true, bucket: true } },
  readReceipts: { select: { id: true, messageId: true, userId: true, readAt: true, user: { select: { id: true, name: true, avatar: true } } } },
  reactions: { select: { id: true, emoji: true, userId: true, createdAt: true, user: { select: { id: true, name: true, avatar: true } } } },
};

function serializeMessage(m) {
  if (!m) return null;
  return {
    ...m,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
    updatedAt: m.updatedAt instanceof Date ? m.updatedAt.toISOString() : m.updatedAt,
    editedAt: m.editedAt instanceof Date ? m.editedAt.toISOString() : m.editedAt,
    deletedAt: m.deletedAt instanceof Date ? m.deletedAt.toISOString() : m.deletedAt,
    replyTo: m.replyTo
      ? { ...m.replyTo, createdAt: m.replyTo.createdAt instanceof Date ? m.replyTo.createdAt.toISOString() : m.replyTo.createdAt }
      : null,
    forwardedFrom: m.forwardedFrom
      ? { ...m.forwardedFrom, createdAt: m.forwardedFrom.createdAt instanceof Date ? m.forwardedFrom.createdAt.toISOString() : m.forwardedFrom.createdAt }
      : null,
    readReceipts: (m.readReceipts ?? []).map((r) => ({ ...r, readAt: r.readAt instanceof Date ? r.readAt.toISOString() : r.readAt })),
    reactions: (m.reactions ?? []).map((r) => ({ ...r, createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt })),
  };
}

async function getConversation(conversationId) {
  const conv = await prisma.chatConversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      schoolId: true,
      deletedAt: true,
      participants: { where: { leftAt: null }, select: { userId: true, leftAt: true } },
    },
  });
  return conv;
}

function canAccessConversation(user, conv) {
  if (!conv || conv.deletedAt) return { allowed: false, reason: 'Conversation not found' };
  // Tenant isolation
  if (!user.isSuperAdmin && conv.schoolId !== user.schoolId) {
    return { allowed: false, reason: 'Conversation belongs to a different school' };
  }
  // Participant membership (super admin can access any in scope; enforced by tenant above)
  if (user.isSuperAdmin) return { allowed: true };
  const isParticipant = conv.participants.some((p) => p.userId === user.id);
  if (!isParticipant) return { allowed: false, reason: 'Not a participant' };
  return { allowed: true };
}

async function broadcastPresence(userId, isOnline) {
  const conversations = await prisma.chatConversationParticipant.findMany({
    where: { userId, leftAt: null },
    select: { conversationId: true },
  });
  const payload = { userId, isOnline, lastSeen: isOnline ? null : (lastSeen.get(userId) ?? null) };
  for (const { conversationId } of conversations) {
    io.to(`conversation:${conversationId}`).emit('presence:update', payload);
  }
}

function setOnline(userId, socketId) {
  let set = onlineSockets.get(userId);
  if (!set) { set = new Set(); onlineSockets.set(userId, set); }
  set.add(socketId);
  if (set.size === 1) broadcastPresence(userId, true);
}

function setOffline(userId, socketId) {
  const set = onlineSockets.get(userId);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) {
    onlineSockets.delete(userId);
    lastSeen.set(userId, new Date().toISOString());
    broadcastPresence(userId, false);
  }
}

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next(new Error('Authentication required'));

  const session = await verifyToken(token);
  if (!session) return next(new Error('Invalid session'));

  const user = await loadUser(session);
  if (!user) return next(new Error('User not found'));
  if (user.deletedAt) return next(new Error('Account removed'));
  if (user.status === 'suspended' || user.status === 'disabled') return next(new Error('Account suspended'));

  socket.data.user = user;
  next();
});

io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`[chat] ${user.name} connected (socket=${socket.id})`);
  socket.join(`user:${user.id}`);
  setOnline(user.id, socket.id);

  socket.on('chat:join', async ({ conversationId }, callback) => {
    try {
      const conv = await getConversation(conversationId);
      const access = canAccessConversation(user, conv);
      if (!access.allowed) return callback?.({ error: access.reason });
      socket.join(`conversation:${conversationId}`);
      // Bootstrap presence for this conversation to the joining socket
      const participantIds = conv.participants.map((p) => p.userId);
      const online = {};
      for (const pid of participantIds) online[pid] = onlineSockets.has(pid);
      socket.emit('presence:sync', { conversationId, online, lastSeen: Object.fromEntries(lastSeen) });
      callback?.({ success: true });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  socket.on('chat:leave', ({ conversationId }) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // ── Message send (single pipeline) ──────────────────────────
  socket.on('message:send', async (payload, callback) => {
    try {
      const conversationId = payload?.conversationId;
      if (!conversationId) return callback?.({ error: 'conversationId required' });
      const content = (payload?.content ?? '').trim();
      const hasFile = !!(payload?.fileUrl || payload?.fileId);
      if (!content && !hasFile) return callback?.({ error: 'Message is empty' });

      const conv = await getConversation(conversationId);
      const access = canAccessConversation(user, conv);
      if (!access.allowed) return callback?.({ error: access.reason });

      const message = await prisma.chatMessage.create({
        data: {
          conversationId,
          senderId: user.id,
          content: payload.content ?? '',
          messageType: payload.messageType || (hasFile ? 'document' : 'text'),
          messageStatus: 'sent',
          fileUrl: payload.fileUrl || null,
          fileName: payload.fileName || null,
          fileSize: payload.fileSize || null,
          fileId: payload.fileId || null,
          replyToId: payload.replyToId || null,
          forwardedFromId: payload.forwardedFromId || null,
          isForwarded: !!payload.forwardedFromId,
        },
        include: messageInclude,
      });

      await prisma.chatConversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      });
      await prisma.chatConversationParticipant.updateMany({
        where: { conversationId, userId: user.id },
        data: { lastReadAt: new Date() },
      });

      const serialized = serializeMessage(message);
      io.to(`conversation:${conversationId}`).emit('message:new', { conversationId, message: serialized });
      callback?.({ success: true, data: serialized });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  // ── Edit ─────────────────────────────────────────────────────
  socket.on('message:edit', async ({ messageId, content }, callback) => {
    try {
      const msg = await prisma.chatMessage.findUnique({ where: { id: messageId }, select: { id: true, senderId: true, conversationId: true, deletedAt: true } });
      if (!msg || msg.deletedAt) return callback?.({ error: 'Message not found' });
      if (msg.senderId !== user.id) return callback?.({ error: 'Can only edit your own messages' });
      const updated = await prisma.chatMessage.update({
        where: { id: messageId },
        data: { content, isEdited: true, editedAt: new Date() },
        include: messageInclude,
      });
      io.to(`conversation:${msg.conversationId}`).emit('message:updated', { conversationId: msg.conversationId, message: serializeMessage(updated) });
      callback?.({ success: true, data: serializeMessage(updated) });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  // ── Delete (soft) ────────────────────────────────────────────
  socket.on('message:delete', async ({ messageId, forEveryone }, callback) => {
    try {
      const msg = await prisma.chatMessage.findUnique({ where: { id: messageId }, select: { id: true, senderId: true, conversationId: true } });
      if (!msg) return callback?.({ error: 'Message not found' });
      if (msg.senderId !== user.id && !user.isSuperAdmin) return callback?.({ error: 'Not allowed' });
      await prisma.chatMessage.update({ where: { id: messageId }, data: { deletedAt: new Date(), content: forEveryone ? '' : undefined } });
      io.to(`conversation:${msg.conversationId}`).emit('message:deleted', { conversationId: msg.conversationId, messageId });
      callback?.({ success: true });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  // ── Reaction toggle ─────────────────────────────────────────
  socket.on('message:react', async ({ messageId, emoji }, callback) => {
    try {
      const msg = await prisma.chatMessage.findUnique({ where: { id: messageId }, select: { conversationId: true, deletedAt: true } });
      if (!msg || msg.deletedAt) return callback?.({ error: 'Message not found' });
      const conv = await getConversation(msg.conversationId);
      const access = canAccessConversation(user, conv);
      if (!access.allowed) return callback?.({ error: access.reason });

      const existing = await prisma.chatMessageReaction.findUnique({
        where: { messageId_userId_emoji: { messageId, userId: user.id, emoji } },
      });
      let active = true;
      if (existing) {
        await prisma.chatMessageReaction.delete({ where: { id: existing.id } });
        active = false;
      } else {
        await prisma.chatMessageReaction.create({ data: { messageId, userId: user.id, emoji } });
      }
      io.to(`conversation:${msg.conversationId}`).emit('message:reaction', {
        conversationId: msg.conversationId,
        messageId,
        emoji,
        userId: user.id,
        user: { id: user.id, name: user.name, avatar: user.avatar },
        active,
      });
      callback?.({ success: true, active });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  // ── Read receipts ───────────────────────────────────────────
  socket.on('message:read', async ({ conversationId }, callback) => {
    try {
      const conv = await getConversation(conversationId);
      const access = canAccessConversation(user, conv);
      if (!access.allowed) return callback?.({ error: access.reason });

      const unread = await prisma.chatMessage.findMany({
        where: {
          conversationId,
          senderId: { not: user.id },
          deletedAt: null,
          readReceipts: { none: { userId: user.id } },
        },
        select: { id: true, senderId: true },
      });
      if (unread.length) {
        await prisma.messageRead.createMany({
          data: unread.map((m) => ({ messageId: m.id, userId: user.id, conversationId })),
          skipDuplicates: true,
        });
        await prisma.chatConversationParticipant.updateMany({
          where: { conversationId, userId: user.id },
          data: { lastReadAt: new Date() },
        });
        // Notify senders their messages were seen
        const bySender = new Map();
        for (const m of unread) { if (!bySender.has(m.senderId)) bySender.set(m.senderId, []); bySender.get(m.senderId).push(m.id); }
        for (const [senderId, ids] of bySender) {
          io.to(`user:${senderId}`).emit('message:status', { conversationId, messageIds: ids, status: 'seen', byUserId: user.id });
        }
      }
      io.to(`conversation:${conversationId}`).emit('message:read', { conversationId, userId: user.id });
      callback?.({ success: true });
    } catch (err) {
      callback?.({ error: err.message });
    }
  });

  // ── Delivered status (client reports receipt of others' messages) ──
  socket.on('message:delivered', async ({ conversationId, messageIds }) => {
    try {
      if (!Array.isArray(messageIds) || !messageIds.length) return;
      const updated = await prisma.chatMessage.updateMany({
        where: { id: { in: messageIds }, senderId: { not: user.id }, messageStatus: 'sent' },
        data: { messageStatus: 'delivered' },
      });
      // Tell each sender (per message) about delivery
      const msgs = await prisma.chatMessage.findMany({
        where: { id: { in: messageIds }, senderId: { not: user.id } },
        select: { id: true, senderId: true },
      });
      const bySender = new Map();
      for (const m of msgs) { if (!bySender.has(m.senderId)) bySender.set(m.senderId, []); bySender.get(m.senderId).push(m.id); }
      for (const [senderId, ids] of bySender) {
        io.to(`user:${senderId}`).emit('message:status', { conversationId, messageIds: ids, status: 'delivered', byUserId: user.id });
      }
    } catch (err) {
      // best-effort
    }
  });

  // ── Typing ──────────────────────────────────────────────────
  socket.on('typing:update', ({ conversationId, isTyping }) => {
    if (!conversationId) return;
    socket.to(`conversation:${conversationId}`).emit('typing:update', {
      conversationId,
      userId: user.id,
      userName: user.name,
      isTyping: !!isTyping,
    });
  });

  socket.on('disconnect', () => {
    if (socket.data.user) setOffline(user.id, socket.id);
    console.log(`[chat] ${user.name} disconnected`);
  });
});

const PORT = process.env.SOCKET_PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`[socket.io] Chat server running on port ${PORT}`);
});