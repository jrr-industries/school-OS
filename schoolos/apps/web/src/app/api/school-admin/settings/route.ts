import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { id: true, name: true, address: true, phone: true, email: true, website: true, settings: true, logo: true },
    });

    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    const s = (school.settings as Record<string, unknown>) ?? {};

    return NextResponse.json({
      success: true,
      data: {
        schoolId: school.id,
        schoolName: school.name,
        address: school.address || '',
        phone: school.phone || '',
        email: school.email || '',
        website: school.website || '',
        logo: school.logo || '',
        board: (s.board as string) || 'CBSE',
        schoolType: (s.schoolType as string) || 'Private School',
        principalName: (s.principalName as string) || '',
        academicYear: (s.academicYear as string) || '2026-27',
        timezone: (s.timezone as string) || 'UTC',
        language: (s.language as string) || 'en',
        theme: (s.theme as string) || 'light',
        banner: (s.banner as string) || '',
        notificationSettings: (s.notificationSettings as Record<string, boolean>) ?? {},
        attendanceSettings: (s.attendanceSettings as Record<string, unknown>) ?? {},
        examSettings: (s.examSettings as Record<string, unknown>) ?? {},
        feeSettings: (s.feeSettings as Record<string, unknown>) ?? {},
        transportSettings: (s.transportSettings as Record<string, unknown>) ?? {},
        librarySettings: (s.librarySettings as Record<string, unknown>) ?? {},
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const existing = await prisma.school.findUnique({ where: { id: session.schoolId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    const currentSettings = (existing.settings as Record<string, unknown>) ?? {};

    const updateData: Record<string, unknown> = {};
    if (body.schoolName) updateData.name = body.schoolName;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.logo !== undefined) updateData.logo = body.logo;

    const settingsFields = [
      'board', 'schoolType', 'principalName', 'academicYear',
      'timezone', 'language', 'theme', 'banner',
      'notificationSettings', 'attendanceSettings', 'examSettings',
      'feeSettings', 'transportSettings', 'librarySettings',
    ];

    const mergedSettings = { ...currentSettings };
    for (const field of settingsFields) {
      if (body[field] !== undefined) {
        mergedSettings[field] = body[field];
      }
    }
    updateData.settings = mergedSettings;

    await prisma.school.update({
      where: { id: session.schoolId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
