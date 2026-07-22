import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET(request: Request) {
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

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20')));
    const statusFilter = url.searchParams.get('status') ?? '';
    const search = url.searchParams.get('search') ?? '';
    const planFilter = url.searchParams.get('plan') ?? '';
    const autoRenewFilter = url.searchParams.get('autoRenew') ?? '';
    const sort = url.searchParams.get('sort') ?? 'newest';

    const where: Record<string, unknown> = { deletedAt: null };

    if (statusFilter) {
      where.status = statusFilter;
    }

    if (planFilter) {
      where.planId = planFilter;
    }

    if (autoRenewFilter === 'true') {
      where.autoRenew = true;
    } else if (autoRenewFilter === 'false') {
      where.autoRenew = false;
    }

    if (search) {
      where.school = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    let orderBy: Record<string, unknown> = { createdAt: 'desc' };
    if (sort === 'expiry') {
      orderBy = { endsAt: { sort: 'asc', nulls: 'last' } };
    } else if (sort === 'name') {
      orderBy = { school: { name: 'asc' } };
    }

    const [total, subscriptions] = await Promise.all([
      prisma.subscription.count({ where: where as any }),
      prisma.subscription.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: orderBy as any,
        include: {
          school: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
              _count: {
                select: {
                  users: { where: { deletedAt: null } },
                  students: { where: { deletedAt: null } },
                },
              },
            },
          },
          plan: {
            select: {
              id: true,
              name: true,
              price: true,
              currency: true,
              interval: true,
              maxStudents: true,
              maxTeachers: true,
            },
          },
        },
      }),
    ]);

    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 86400000);

    const [allSubs, allPlans] = await Promise.all([
      prisma.subscription.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          status: true,
          endsAt: true,
          autoRenew: true,
          plan: { select: { price: true, interval: true } },
        },
      }),
      prisma.subscriptionPlan.findMany({
        where: { deletedAt: null, isActive: true },
        select: { id: true, name: true },
      }),
    ]);

    const activeSubs = allSubs.filter((s) => s.status === 'active');
    const expiringSoon = activeSubs.filter(
      (s) => s.endsAt && s.endsAt >= today && s.endsAt <= thirtyDaysFromNow,
    );
    const autoRenewOn = activeSubs.filter((s) => s.autoRenew);
    const trialSubs = allSubs.filter((s) => s.status === 'trial');

    let mrr = 0;
    for (const s of activeSubs) {
      const price = Number(s.plan.price);
      if (s.plan.interval === 'yearly') mrr += price / 12;
      else if (s.plan.interval === 'quarterly') mrr += price / 3;
      else mrr += price;
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: subscriptions.map((s) => ({
        id: s.id,
        schoolId: s.schoolId,
        schoolName: s.school.name,
        schoolSlug: s.school.slug,
        schoolStatus: s.school.status,
        planId: s.planId,
        planName: s.plan.name,
        planPrice: Number(s.plan.price),
        planCurrency: s.plan.currency,
        planInterval: s.plan.interval,
        planMaxStudents: s.plan.maxStudents,
        planMaxTeachers: s.plan.maxTeachers,
        status: s.status,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt?.toISOString() ?? null,
        trialEndsAt: s.trialEndsAt?.toISOString() ?? null,
        autoRenew: s.autoRenew,
        studentCount: s.school._count.students,
        teacherCount: s.school._count.users,
        createdAt: s.createdAt.toISOString(),
      })),
      summary: {
        totalActiveSubscriptions: activeSubs.length,
        monthlyRecurringRevenue: Math.round(mrr * 100) / 100,
        annualRecurringRevenue: Math.round(mrr * 12 * 100) / 100,
        expiringNext30Days: expiringSoon.length,
        autoRenewEnabled: autoRenewOn.length,
        trialSchools: trialSubs.length,
        availablePlans: allPlans.map((p) => ({ id: p.id, name: p.name })),
      },
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Subscriptions API Error]', error);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to load subscriptions.' },
      { status: 500 },
    );
  }
}
