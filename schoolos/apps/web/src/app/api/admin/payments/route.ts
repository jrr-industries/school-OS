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

    const where: Record<string, unknown> = { deletedAt: null };
    if (statusFilter) {
      where.status = statusFilter;
    }
    if (search) {
      where.school = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [total, subscriptions] = await Promise.all([
      prisma.subscription.count({ where: where as any }),
      prisma.subscription.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          paymentMethod: true,
          paymentReference: true,
          startsAt: true,
          endsAt: true,
          createdAt: true,
          autoRenew: true,
          school: { select: { id: true, name: true } },
          plan: { select: { id: true, name: true, price: true, currency: true, interval: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const payments = subscriptions.map((s, i) => {
      const paymentStatus: 'completed' | 'pending' | 'failed' | 'refunded' =
        s.status === 'active' ? 'completed' :
        s.status === 'past_due' ? 'failed' :
        s.status === 'cancelled' ? 'refunded' :
        s.status === 'trial' ? 'pending' : 'pending';

      const txnId = `TXN-${new Date(s.createdAt).getFullYear()}${String(i + 1).padStart(6, '0')}`;

      return {
        id: s.id,
        transactionId: txnId,
        schoolName: s.school.name,
        planName: s.plan.name,
        amount: Number(s.plan.price),
        currency: s.plan.currency,
        method: s.paymentMethod || (s.status === 'trial' ? 'Trial' : '—'),
        reference: s.paymentReference || null,
        date: s.createdAt.toISOString(),
        status: paymentStatus,
        interval: s.plan.interval,
        autoRenew: s.autoRenew,
      };
    });

    return NextResponse.json({
      success: true,
      data: payments,
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
      console.error('[Payments API Error]', error);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to load payments.' },
      { status: 500 },
    );
  }
}
