export type MessageType = 'text' | 'image' | 'video' | 'pdf' | 'word' | 'excel' | 'powerpoint' | 'zip' | 'voice' | 'audio' | 'document' | 'system' | 'announcement';
export type MessageStatus = 'pending' | 'sending' | 'sent' | 'delivered' | 'seen' | 'failed';
export type AnnouncementTarget = 'all_schools' | 'specific_school' | 'multiple_schools';
export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface Sender {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface FileInfo {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  bucket: string;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  user: { id: string; name: string; avatar: string | null };
  createdAt: string;
}

export interface MessageRead {
  id: string;
  messageId: string;
  userId: string;
  user?: Sender;
  readAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  messageStatus: MessageStatus;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  fileId: string | null;
  file?: FileInfo | null;
  replyToId: string | null;
  replyTo: ChatMessage | null;
  forwardedFromId: string | null;
  forwardedFrom: { id: string; content: string; senderId: string; createdAt: string; sender: Sender } | null;
  isEdited: boolean;
  isForwarded: boolean;
  metadata: Record<string, unknown> | null;
  editedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sender: Sender;
  readReceipts: MessageRead[];
  reactions: MessageReaction[];
  isStarred?: boolean;
}

export interface Participant {
  id: string;
  userId: string;
  role: string;
  isMuted: boolean;
  notificationsEnabled: boolean;
  lastReadAt: string | null;
  joinedAt: string;
  leftAt: string | null;
  user: Sender & { isSuperAdmin: boolean };
}

export interface Conversation {
  id: string;
  schoolId: string;
  title: string | null;
  isGroup: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage?: ChatMessage | null;
}

export interface Announcement {
  id: string;
  schoolId: string | null;
  title: string;
  content: string | null;
  target: AnnouncementTarget;
  targetSchoolIds: string[];
  status: AnnouncementStatus;
  priority: string;
  attachmentUrl: string | null;
  attachmentName: string | null;
  attachmentSize: number | null;
  createdById: string;
  createdBy: Sender;
  receipts: { id: string; readAt: string }[];
  isRead?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  content?: string;
  target: AnnouncementTarget;
  targetSchoolIds?: string[];
  priority?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  messageType?: MessageType;
  messageStatus?: MessageStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileId?: string;
  replyToId?: string;
  forwardedFromId?: string;
}

export interface CreateConversationPayload {
  participantId: string;
  title?: string;
}

export interface TypingUser {
  userId: string;
  userName: string;
  timestamp: number;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  isSuperAdmin?: boolean;
  schoolId?: string;
  school?: { name: string; slug: string };
  userRoles?: { role: { slug: string } }[];
}

export interface PresenceState {
  onlineUsers: Record<string, boolean>;
  lastSeen: Record<string, string>;
}
