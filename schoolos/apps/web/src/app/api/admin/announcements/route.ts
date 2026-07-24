import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDevSession } from '@/lib/dev-session';
import { getUserWithRoles } from '@/features/chat/permissions/get-user-roles';
import { isSameSchool } from '@/features/chat/permissions/chat-permissions';
import { ChatRepository } from '@schoolos/database/repositories/chat.repository';

export async function GET() {
  const session = await getDevSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await getUserWithRoles(session);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const announcements = await ChatRepository.getAnnouncements(user.id, user.schoolId);
    const filtered = announcements.filter((a: any) => {
      if (user.isSuperAdmin) return true;
      return isSameSchool(user, a.schoolId);
    });
    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch announcements';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getDevSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const user = await getUserWithRoles(session);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  if (!user.isSuperAdmin) {
    return NextResponse.json({ success: false, error: 'Only super admins can create announcements' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const announcement = await ChatRepository.createAnnouncement({
      title: body.title,
      content: body.content,
      target: body.target ?? 'all_schools',
      targetSchoolIds: body.targetSchoolIds,
      priority: body.priority,
      createdById: user.id,
      schoolId: user.schoolId,
    });
    return NextResponse.json({ success: true, data: announcement });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create announcement';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}