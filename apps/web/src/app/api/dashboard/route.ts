import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    // ── Key Metrics ────────────────────────────────────────
    const [
      totalSchools,
      totalBranches,
      totalClasses,
      totalSections,
      totalSubjects,
      totalTasks,
      totalAnnouncements,
      totalCalendarEvents,
      activeSchools,
      activeAcademicYears,
      upcomingEvents,
      pendingTasks,
    ] = await Promise.all([
      prisma.school.count({ where: { deletedAt: null } }),
      prisma.branch.count({ where: { deletedAt: null } }),
      prisma.class.count({ where: { deletedAt: null } }),
      prisma.section.count({ where: { deletedAt: null } }),
      prisma.subject.count({ where: { deletedAt: null } }),
      prisma.task.count({ where: { deletedAt: null } }),
      prisma.announcement.count({ where: { deletedAt: null, status: 'PUBLISHED' } }),
      prisma.calendarEvent.count({ where: { deletedAt: null } }),
      prisma.school.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      prisma.academicYear.count({ where: { deletedAt: null, isCurrent: true } }),
      prisma.calendarEvent.count({
        where: {
          deletedAt: null,
          eventDate: { gte: new Date() },
        },
      }),
      prisma.task.count({
        where: {
          deletedAt: null,
          status: { in: ['PENDING', 'IN_PROGRESS'] },
        },
      }),
    ]);

    // ── Subscription Overview ──────────────────────────────
    const subscriptionData = await prisma.school.groupBy({
      by: ['subscriptionPlan'],
      _count: { id: true },
      where: { deletedAt: null },
    });
    const subscriptionOverview = {
      TRIAL: 0,
      BASIC: 0,
      STANDARD: 0,
      PREMIUM: 0,
    };
    for (const item of subscriptionData) {
      subscriptionOverview[item.subscriptionPlan as keyof typeof subscriptionOverview] = item._count.id;
    }

    // ── School Status Breakdown ────────────────────────────
    const schoolStatusData = await prisma.school.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { deletedAt: null },
    });
    const schoolStatusBreakdown: Record<string, number> = {};
    for (const item of schoolStatusData) {
      schoolStatusBreakdown[item.status] = item._count.id;
    }

    // ── Task Status Breakdown ──────────────────────────────
    const taskStatusData = await prisma.task.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { deletedAt: null },
    });
    const taskStatusBreakdown: Record<string, number> = {};
    for (const item of taskStatusData) {
      taskStatusBreakdown[item.status] = item._count.id;
    }

    // ── Recent Announcements (last 5 published) ────────────
    const recentAnnouncements = await prisma.announcement.findMany({
      where: { deletedAt: null, status: 'PUBLISHED' },
      orderBy: { publishDate: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        priority: true,
        publishDate: true,
        audience: true,
      },
    });

    // ── Upcoming Events (next 5) ──────────────────────────
    const upcomingCalendarEvents = await prisma.calendarEvent.findMany({
      where: {
        deletedAt: null,
        eventDate: { gte: new Date() },
      },
      orderBy: { eventDate: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        eventDate: true,
        eventType: true,
        audience: true,
        color: true,
      },
    });

    // ── Monthly Stats (current year) ──────────────────────
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear + 1, 0, 1);

    // Schools created per month
    const schoolsByMonth = await prisma.school.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: yearStart, lt: yearEnd },
      },
      select: { createdAt: true },
    });

    const monthlySchoolGrowth = aggregateByMonth(schoolsByMonth);

    return successResponse({
      metrics: {
        totalSchools,
        totalBranches,
        totalClasses,
        totalSections,
        totalSubjects,
        totalTasks,
        totalAnnouncements,
        totalCalendarEvents,
        activeSchools,
        activeAcademicYears,
        upcomingEvents,
        pendingTasks,
      },
      subscriptionOverview,
      schoolStatusBreakdown,
      taskStatusBreakdown,
      recentAnnouncements,
      upcomingCalendarEvents,
      monthlySchoolGrowth,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return errorResponse('Failed to fetch dashboard data', 500);
  }
}

/** Aggregate items by month and return a 12-element array */
function aggregateByMonth(items: { createdAt: Date }[]): number[] {
  const monthly = new Array(12).fill(0);
  for (const item of items) {
    const month = item.createdAt.getMonth();
    monthly[month]++;
  }
  return monthly;
}
