import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role) || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { settings: true },
    });

    const settings = (school?.settings as Record<string, unknown>) ?? {};
    const transportRoutes = (settings.transportRoutes as Record<string, unknown>[]) ?? [];
    const transportStats = (settings.transportStats as Record<string, unknown>) ?? {};

    const students = await prisma.student.count({
      where: { schoolId: session.schoolId, deletedAt: null, status: 'active' },
    });

    return NextResponse.json({
      success: true,
      data: {
        routes: transportRoutes,
        stats: {
          totalBuses: transportRoutes.length,
          activeTrips: transportRoutes.filter((r: any) => r.status === 'active').length,
          studentsUsingBus: transportStats.studentsUsingBus || Math.round(students * 0.6),
          driversAvailable: transportStats.driversAvailable || 0,
          ...transportStats,
        },
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
