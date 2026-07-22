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
      subscriptions,
      recentSubs,
    ] = await Promise.all([
      prisma.school.count({ where: { deletedAt: null } }),
      prisma.subscription.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          status: true,
          startsAt: true,
          endsAt: true,
          autoRenew: true,
          paymentMethod: true,
          createdAt: true,
          school: { select: { id: true, name: true } },
          plan: { select: { id: true, name: true, price: true, interval: true, currency: true } },
        },
      }),
      prisma.subscription.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          status: true,
          paymentMethod: true,
          createdAt: true,
          school: { select: { name: true } },
          plan: { select: { price: true, currency: true, interval: true } },
        },
      }),
    ]);

    const activeSubs = subscriptions.filter((s) => s.status === 'active');
    const overdueSubs = subscriptions.filter((s) => s.status === 'past_due');
    const trialSubs = subscriptions.filter((s) => s.status === 'trial');

    let mrr = 0;
    let totalDue = 0;
    for (const s of activeSubs) {
      const price = Number(s.plan.price);
      if (s.plan.interval === 'yearly') mrr += price / 12;
      else if (s.plan.interval === 'quarterly') mrr += price / 3;
      else mrr += price;
    }
    for (const s of overdueSubs) {
      totalDue += Number(s.plan.price);
    }

    const successRate = subscriptions.length > 0
      ? Math.round((activeSubs.length / subscriptions.length) * 1000) / 10
      : 0;

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const newThisMonth = subscriptions.filter((s) => new Date(s.createdAt) >= monthStart).length;

    const pendingInvoicesCount = subscriptions.filter(
      (s) => s.endsAt && new Date(s.endsAt) > now,
    ).length;

    const transactions = recentSubs.map((s) => ({
      id: s.id,
      school: s.school.name,
      amount: Number(s.plan.price),
      currency: s.plan.currency,
      method: s.paymentMethod || '—',
      interval: s.plan.interval,
      date: s.createdAt.toISOString(),
      status: s.status,
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          monthlyRevenue: Math.round(mrr * 100) / 100,
          pendingInvoices: pendingInvoicesCount,
          overduePayments: overdueSubs.length,
          overdueAmount: Math.round(totalDue * 100) / 100,
          paymentSuccessRate: successRate,
          activeSubscriptions: activeSubs.length,
          totalSchools,
          trialSubscriptions: trialSubs.length,
          newThisMonth,
        },
        transactions,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Billing API Error]', error);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to load billing data.' },
      { status: 500 },
    );
  }
}
