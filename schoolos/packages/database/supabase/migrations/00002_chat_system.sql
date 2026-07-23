-- Chat System RLS Policies
-- Run this after the schema migration

-- Enable RLS on chat tables
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Chat Conversations: users can see conversations they participate in
CREATE POLICY "Users can view their conversations"
ON chat_conversations FOR SELECT
USING (
  id IN (
    SELECT conversation_id FROM chat_conversation_participants
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Super admins can view all conversations"
ON chat_conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND is_super_admin = true AND deleted_at IS NULL
  )
);

CREATE POLICY "Users can create conversations"
ON chat_conversations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Participants can update conversations"
ON chat_conversations FOR UPDATE
USING (
  id IN (
    SELECT conversation_id FROM chat_conversation_participants
    WHERE user_id = auth.uid()
  )
);

-- Chat Conversation Participants: users can see their own participations
CREATE POLICY "Users can view their participations"
ON chat_conversation_participants FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all participants"
ON chat_conversation_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND is_super_admin = true AND deleted_at IS NULL
  )
);

CREATE POLICY "Users can join conversations"
ON chat_conversation_participants FOR INSERT
WITH CHECK (true);

-- Chat Messages: participants can view messages in their conversations
CREATE POLICY "Participants can view messages"
ON chat_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT conversation_id FROM chat_conversation_participants
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Super admins can view all messages"
ON chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND is_super_admin = true AND deleted_at IS NULL
  )
);

CREATE POLICY "Participants can insert messages"
ON chat_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND conversation_id IN (
    SELECT conversation_id FROM chat_conversation_participants
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Senders can update their messages"
ON chat_messages FOR UPDATE
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Message Reads: users can read their own read receipts
CREATE POLICY "Users can view their read receipts"
ON message_reads FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert read receipts"
ON message_reads FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Announcements: everyone can view
CREATE POLICY "Users can view announcements"
ON announcements FOR SELECT
USING (
  status = 'published'
  AND (
    target = 'all_schools'
    OR school_id IS NULL
    OR school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "Super admins can manage announcements"
ON announcements FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND is_super_admin = true AND deleted_at IS NULL
  )
);

-- Create publication for Supabase Realtime
-- This enables PostgreSQL change tracking for the chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE message_reads;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
