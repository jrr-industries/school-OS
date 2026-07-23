-- ============================================================================
-- Storage Bucket & RLS for Chat Attachments
-- Run this in the Supabase SQL Editor after creating the bucket manually:
-- 1. Go to Storage > Create bucket > "chat-attachments" (public bucket)
-- 2. Then run this SQL to set up RLS policies
-- ============================================================================

-- Ensure the bucket exists (idempotent)
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  true,
  false,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
    'audio/webm',
    'audio/webm;codecs=opus'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on the objects table for this bucket (already enabled globally)
-- Only needed if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for the bucket to avoid duplicates
DROP POLICY IF EXISTS "Users can upload chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Super admins can manage all chat attachments" ON storage.objects;

-- Policy: Authenticated users can upload files to chat-attachments
CREATE POLICY "Users can upload chat attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
  AND auth.role() = 'authenticated'
);

-- Policy: Anyone can view files in chat-attachments (public bucket)
CREATE POLICY "Users can view chat attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-attachments');

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete their own chat attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Super admins can manage all files
CREATE POLICY "Super admins can manage all chat attachments"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'chat-attachments'
  AND EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND is_super_admin = true AND deleted_at IS NULL
  )
);

-- Enable Realtime for the files table (for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE files;
