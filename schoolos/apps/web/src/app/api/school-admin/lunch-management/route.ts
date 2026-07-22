import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role) || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [school, students] = await Promise.all([
      prisma.school.findUnique({ where: { id: session.schoolId }, select: { settings: true } }),
      prisma.student.count({ where: { schoolId: session.schoolId, deletedAt: null, status: 'active' } }),
    ]);

    const settings = (school?.settings as Record<string, unknown>) ?? {};
    const lunchData = (settings.lunchData as Record<string, unknown>) ?? {};

    return NextResponse.json({
      success: true,
      data: {
        totalStudents: students,
        todayMenu: lunchData.todayMenu || [],
        weeklyMenu: lunchData.weeklyMenu || [],
        inventory: lunchData.inventory || [],
        suppliers: lunchData.suppliers || [],
        specialMeals: lunchData.specialMeals || [],
        foodWaste: lunchData.foodWaste || 0,
        nutritionReport: lunchData.nutritionReport || [],
        wasteDistribution: lunchData.wasteDistribution || [],
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
      where: { id: session.schoolId }, select: { settings: true },
    });
    const settings = (school?.settings as Record<string, unknown>) ?? {};
    settings.lunchData = body;
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
