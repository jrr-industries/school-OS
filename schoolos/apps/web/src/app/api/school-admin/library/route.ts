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
    const libraryData = (settings.libraryData as Record<string, unknown>) ?? {};

    return NextResponse.json({
      success: true,
      data: {
        totalBooks: libraryData.totalBooks || 0,
        issuedBooks: libraryData.issuedBooks || 0,
        returnedBooks: libraryData.returnedBooks || 0,
        overdueBooks: libraryData.overdueBooks || 0,
        lostBooks: libraryData.lostBooks || 0,
        fineCollected: libraryData.fineCollected || 0,
        popularBooks: libraryData.popularBooks || [],
        categoryDistribution: libraryData.categoryDistribution || [],
        usageTrend: libraryData.usageTrend || [],
        lastUpdated: new Date().toISOString(),
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

    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { settings: true },
    });

    const settings = (school?.settings as Record<string, unknown>) ?? {};
    settings.libraryData = body;

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
