import { createSupabaseAdminClient } from '../supabase';

const CHAT_BUCKET = 'chat-attachments';

export type UploadedFile = {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  bucket: string;
  url: string;
};

const ALLOWED_MIME_TYPES = [
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
  'audio/webm;codecs=opus',
  'audio/x-caani',
  'audio/x-recordable',
  'audio/x-speex',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function getMessageTypeFromMime(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') return 'excel';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}

function validateFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not supported`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 50 MB limit');
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function ensureBucketExists(): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === CHAT_BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(CHAT_BUCKET, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
    });
    if (error && !error.message.includes('already exists')) {
      throw new Error(`Failed to create storage bucket: ${error.message}`);
    }
  }
}

export class StorageService {
  static async uploadChatFile(
    file: File,
    userId: string,
    schoolId: string,
  ): Promise<UploadedFile> {
    validateFile(file);
    await ensureBucketExists();

    const supabase = createSupabaseAdminClient();
    const sanitized = sanitizeFileName(file.name);
    const timestamp = Date.now();
    const uniquePath = `${schoolId}/${userId}/${timestamp}_${sanitized}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(CHAT_BUCKET)
      .upload(uniquePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw new Error(`Supabase upload failed: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from(CHAT_BUCKET)
      .getPublicUrl(uploadData.path);

    return {
      id: '',
      name: uploadData.path,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      path: uploadData.path,
      bucket: CHAT_BUCKET,
      url: urlData.publicUrl,
    };
  }

  static async deleteFile(path: string): Promise<void> {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.storage
      .from(CHAT_BUCKET)
      .remove([path]);

    if (error) throw new Error(`Failed to delete file: ${error.message}`);
  }

  static getPublicUrl(path: string): string {
    const supabase = createSupabaseAdminClient();
    const { data } = supabase.storage
      .from(CHAT_BUCKET)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  static getBucketName(): string {
    return CHAT_BUCKET;
  }
}
