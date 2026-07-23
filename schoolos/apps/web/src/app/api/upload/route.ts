import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { StorageService, getMessageTypeFromMime } from '@schoolos/auth';
import { getDevSession } from '@/lib/dev-session';
import { resolveDevUser } from '@/lib/chat-utils';

export async function POST(request: Request) {
  try {
    const session = await getDevSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await resolveDevUser(session);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, schoolId: true },
    });
    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User not found in DB' }, { status: 404 });
    }

    const uploaded = await StorageService.uploadChatFile(file, dbUser.id, dbUser.schoolId);

    const fileRecord = await prisma.file.create({
      data: {
        schoolId: dbUser.schoolId,
        userId: dbUser.id,
        name: uploaded.name,
        originalName: uploaded.originalName,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        path: uploaded.path,
        bucket: uploaded.bucket,
        category: 'chat',
        metadata: {
          uploadedVia: 'chat',
          messageType: getMessageTypeFromMime(uploaded.mimeType),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: fileRecord.id,
        url: uploaded.url,
        name: uploaded.originalName,
        size: uploaded.size,
        mimeType: uploaded.mimeType,
        messageType: getMessageTypeFromMime(uploaded.mimeType),
        fileRecordId: fileRecord.id,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
