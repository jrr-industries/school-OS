export type MessageType = 'text' | 'image' | 'pdf' | 'document' | 'voice' | 'system';

export type AnnouncementTarget = 'all_schools' | 'specific_school' | 'multiple_schools';

export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  isSuperAdmin: boolean;
  schoolId: string;
  school: { name: string; slug: string } | null;
}

export interface Sender {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface MessageRead {
  id: string;
  messageId: string;
  userId: string;
  readAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  replyToId: string | null;
  replyTo: ChatMessage | null;
  editedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sender: Sender;
  readReceipts: MessageRead[];
}

export interface Participant {
  id: string;
  userId: string;
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
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  messages: ChatMessage[];
  unreadCount: number;
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
  createdById: string;
  createdBy: Sender;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  content?: string;
  target: AnnouncementTarget;
  targetSchoolIds?: string[];
  priority?: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  messageType?: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyToId?: string;
}

export interface CreateConversationPayload {
  participantId: string;
  title?: string;
}
