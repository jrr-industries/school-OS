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
      select: { settings: true },
    });

    const settings = (school?.settings as Record<string, unknown>) ?? {};
    const busManagement = (settings.busManagement as Record<string, unknown>) ?? {};

    return NextResponse.json({ success: true, data: busManagement });
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
    const school = await prisma.school.findUnique({ where: { id: session.schoolId } });
    if (!school) return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });

    const settings = (school.settings as Record<string, unknown>) ?? {};
    settings.busManagement = body;

    await prisma.school.update({
      where: { id: session.schoolId },
      data: { settings: JSON.parse(JSON.stringify(settings)) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
