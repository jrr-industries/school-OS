import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const [
      totalSchools,
      totalUsers,
      totalPlans,
      activeSubscriptions,
      schoolsByStatus,
      recentSchools,
      recentActivity,
    ] = await Promise.all([
      prisma.school.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.subscriptionPlan.count({ where: { deletedAt: null } }),
      prisma.subscription.count({
        where: { deletedAt: null, status: 'active' },
      }),
      prisma.school.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: { id: true },
      }),
      prisma.school.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalSchools,
        totalUsers,
        totalPlans,
        activeSubscriptions,
        schoolsByStatus: schoolsByStatus.map((s) => ({
          status: s.status,
          count: s._count.id,
        })),
        recentSchools: recentSchools.map((s) => ({
          ...s,
          createdAt: s.createdAt.toISOString(),
        })),
        recentActivity: recentActivity.map((a) => ({
          id: a.id,
          action: a.action,
          entity: a.entity,
          description: a.description,
          user: a.user,
          createdAt: a.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch dashboard stats';

    const isDbError =
      message.includes('Can\'t reach database server') ||
      message.includes('connect ECONNREFUSED') ||
      message.includes('connection refused') ||
      message.includes('getaddrinfo ENOTFOUND');

    return NextResponse.json(
      {
        success: false,
        error: isDbError ? 'Database connection unavailable.' : message,
      },
      { status: 500 },
    );
  }
}
