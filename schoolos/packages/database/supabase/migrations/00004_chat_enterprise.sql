-- ============================================================================
-- SchoolOS Enterprise Communication Module
-- Migration 00004: Extended chat tables, RLS policies, and Realtime config
-- ============================================================================

-- 1. New Tables ---------------------------------------------------------------

-- Chat Message Reactions
CREATE TABLE IF NOT EXISTS chat_message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_chat_message_reactions UNIQUE (message_id, user_id, emoji)
);

CREATE INDEX IF NOT EXISTS idx_chat_message_reactions_message_id ON chat_message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_message_reactions_user_id ON chat_message_reactions(user_id);

-- Chat Starred Messages
CREATE TABLE IF NOT EXISTS chat_starred_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_chat_starred_messages UNIQUE (message_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_starred_messages_message_id ON chat_starred_messages(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_starred_messages_user_id ON chat_starred_messages(user_id);

-- Chat Pinned Conversations
CREATE TABLE IF NOT EXISTS chat_pinned_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_chat_pinned_conversations UNIQUE (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_pinned_conversations_user_id ON chat_pinned_conversations(user_id);

-- Chat Archived Conversations
CREATE TABLE IF NOT EXISTS chat_archived_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_chat_archived_conversations UNIQUE (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_archived_conversations_user_id ON chat_archived_conversations(user_id);

-- Announcement Receipts
CREATE TABLE IF NOT EXISTS announcement_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_announcement_receipts UNIQUE (announcement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_receipts_announcement_id ON announcement_receipts(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_receipts_user_id ON announcement_receipts(user_id);

-- 2. Add missing columns to existing tables -----------------------------------

-- Add new columns to chat_conversations
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;
ALTER TABLE chat_conversations DROP COLUMN IF EXISTS is_pinned;
ALTER TABLE chat_conversations DROP COLUMN IF EXISTS is_archived;

-- Add new columns to chat_conversation_participants
ALTER TABLE chat_conversation_participants ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member';
ALTER TABLE chat_conversation_participants ADD COLUMN IF NOT EXISTS is_muted BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE chat_conversation_participants ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN NOT NULL DEFAULT true;

-- Add new columns to chat_messages
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS message_status TEXT NOT NULL DEFAULT 'sent';
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS forwarded_from_id UUID REFERENCES chat_messages(id);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_edited BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS is_forwarded BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_chat_messages_message_status ON chat_messages(message_status);

-- Add new columns to announcements
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS attachment_size INT;

-- 3. RLS Policies -------------------------------------------------------------

-- Enable RLS on new tables
ALTER TABLE chat_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_starred_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_pinned_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_archived_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_receipts ENABLE ROW LEVEL SECURITY;

-- Chat Message Reactions
CREATE POLICY "Users can view reactions in their conversations"
ON chat_message_reactions FOR SELECT
USING (
  message_id IN (
    SELECT id FROM chat_messages
    WHERE conversation_id IN (
      SELECT conversation_id FROM chat_conversation_participants
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can insert their own reactions"
ON chat_message_reactions FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own reactions"
ON chat_message_reactions FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all reactions"
ON chat_message_reactions FOR ALL
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true AND deleted_at IS NULL)
);

-- Chat Starred Messages
CREATE POLICY "Users can view their starred messages"
ON chat_starred_messages FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can star messages"
ON chat_starred_messages FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unstar messages"
ON chat_starred_messages FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all starred messages"
ON chat_starred_messages FOR ALL
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true AND deleted_at IS NULL)
);

-- Chat Pinned Conversations
CREATE POLICY "Users can view their pinned conversations"
ON chat_pinned_conversations FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can pin conversations"
ON chat_pinned_conversations FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unpin conversations"
ON chat_pinned_conversations FOR DELETE
USING (user_id = auth.uid());

-- Chat Archived Conversations
CREATE POLICY "Users can view their archived conversations"
ON chat_archived_conversations FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can archive conversations"
ON chat_archived_conversations FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unarchive conversations"
ON chat_archived_conversations FOR DELETE
USING (user_id = auth.uid());

-- Announcement Receipts
CREATE POLICY "Users can view their announcement receipts"
ON announcement_receipts FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can mark announcements as read"
ON announcement_receipts FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Super admins can view all receipts"
ON announcement_receipts FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_super_admin = true AND deleted_at IS NULL)
);

-- 4. Realtime Publication -----------------------------------------------------

ALTER PUBLICATION supabase_realtime ADD TABLE chat_message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_starred_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_pinned_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_archived_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE announcement_receipts;

-- 5. Performance Indexes ------------------------------------------------------

-- Conversation list query optimization
CREATE INDEX IF NOT EXISTS idx_chat_conversations_participant_lookup
ON chat_conversation_participants(user_id, left_at)
INCLUDE (conversation_id);

-- Message search optimization (trigram)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_chat_messages_content_trgm
ON chat_messages USING gin (content gin_trgm_ops)
WHERE deleted_at IS NULL;

-- Conversation unread count optimization
CREATE INDEX IF NOT EXISTS idx_message_reads_unread
ON message_reads(message_id, user_id)
INCLUDE (conversation_id);

-- Announcement targeting optimization
CREATE INDEX IF NOT EXISTS idx_announcements_target_status
ON announcements(target, status)
INCLUDE (id, title, created_at);
