import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true, name: true, email: true, phone: true, avatar: true, status: true, createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { settings: true, name: true, slug: true },
    });

    const settings = (school?.settings as Record<string, unknown>) ?? {};
    const profileSessions = (settings.profileSessions as Record<string, unknown>[]) ?? [];
    const profileDevices = (settings.profileDevices as Record<string, unknown>[]) ?? [];
    const profileLanguage = (settings.language as string) || 'en';
    const profileTheme = (settings.theme as string) || 'system';

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          photo: user.avatar || '',
          status: user.status,
          role: session.role,
          createdAt: user.createdAt.toISOString(),
        },
        schoolName: school?.name || '',
        schoolCode: school?.slug || '',
        language: profileLanguage,
        theme: profileTheme,
        sessions: profileSessions,
        devices: profileDevices,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, photo, language, theme, sessions, devices } = body;

    if (name || phone || photo) {
      await prisma.user.update({
        where: { id: session.id },
        data: {
          ...(name !== undefined && { name }),
          ...(phone !== undefined && { phone }),
          ...(photo !== undefined && { avatar: photo }),
        },
      });
    }

    if (language || theme || sessions || devices) {
      const school = await prisma.school.findUnique({
        where: { id: session.schoolId },
        select: { settings: true },
      });
      const settings = (school?.settings as Record<string, unknown>) ?? {};
      if (language) settings.language = language;
      if (theme) settings.theme = theme;
      if (sessions) settings.profileSessions = sessions;
      if (devices) settings.profileDevices = devices;
      await prisma.school.update({
        where: { id: session.schoolId },
        data: { settings: JSON.parse(JSON.stringify(settings)) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
