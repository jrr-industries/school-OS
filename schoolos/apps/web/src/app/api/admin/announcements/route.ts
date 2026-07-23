import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDevSession } from '@/lib/dev-session';
import { ChatService } from '@/features/chat/services/chat.service';

export async function GET() {
  const session = await getDevSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const announcements = await ChatService.getAnnouncements(session);
    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch announcements';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getDevSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const announcement = await ChatService.createAnnouncement(session, {
      title: body.title,
      content: body.content,
      target: body.target ?? 'all_schools',
      targetSchoolIds: body.targetSchoolIds,
      priority: body.priority,
    });
    return NextResponse.json({ success: true, data: announcement });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create announcement';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
