import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';

export async function GET() {
  try {
    const [
      totalSchools,
      activeSchools,
      trialSchools,
      totalUsers,
      totalStudents,
      totalTeachers,
      totalParents,
      totalStaff,
      activeSubscriptions,
      plans,
      recentSchools,
      schoolsByStatus,
    ] = await Promise.all([
      prisma.school.count({ where: { deletedAt: null } }),
      prisma.school.count({ where: { deletedAt: null, status: 'active' } }),
      prisma.school.count({ where: { deletedAt: null, status: 'trial' } }),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.employee.count({ where: { deletedAt: null, isTeaching: true } }),
      prisma.parent.count({ where: { deletedAt: null } }),
      prisma.employee.count({ where: { deletedAt: null, isTeaching: false } }),
      prisma.subscription.count({ where: { deletedAt: null, status: 'active' } }),
      prisma.subscriptionPlan.findMany({ where: { deletedAt: null, isActive: true } }),
      prisma.school.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, type: true, status: true, createdAt: true },
      }),
      prisma.school.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
    ]);

    const planDistribution: Record<string, number> = {};
    for (const plan of plans) {
      const count = await prisma.subscription.count({
        where: { deletedAt: null, planId: plan.id },
      });
      if (count > 0) planDistribution[plan.name.toLowerCase()] = count;
    }

    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    const expiringSoon = await prisma.subscription.count({
      where: {
        deletedAt: null,
        status: 'active',
        endsAt: { lte: thirtyDays },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalSchools,
        activeSchools,
        trialSchools,
        totalUsers,
        totalStudents,
        totalTeachers,
        totalParents,
        totalStaff,
        activeSubscriptions,
        revenue: 0,
        schoolsByStatus: schoolsByStatus.map((s) => ({
          status: s.status,
          count: s._count.id,
        })),
        recentSchools: recentSchools.map((s) => ({
          ...s,
          createdAt: s.createdAt.toISOString(),
        })),
        planDistribution,
        expiringSoon,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
