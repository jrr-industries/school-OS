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

    const invoices = subscriptions.map((s, i) => {
      const invoiceStatus: 'paid' | 'pending' | 'overdue' | 'cancelled' =
        s.status === 'active' ? 'paid' :
        s.status === 'past_due' ? 'overdue' :
        s.status === 'cancelled' ? 'cancelled' :
        s.status === 'trial' ? 'pending' : 'pending';

      const invoiceNumber = `INV-${new Date(s.createdAt).getFullYear()}-${String(i + 1).padStart(4, '0')}`;

      return {
        id: s.id,
        invoiceId: invoiceNumber,
        schoolName: s.school.name,
        planName: s.plan.name,
        amount: Number(s.plan.price),
        currency: s.plan.currency,
        interval: s.plan.interval,
        date: s.createdAt.toISOString(),
        dueDate: s.endsAt?.toISOString() ?? null,
        status: invoiceStatus,
        autoRenew: s.autoRenew,
      };
    });

    return NextResponse.json({
      success: true,
      data: invoices,
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
      console.error('[Invoices API Error]', error);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to load invoices.' },
      { status: 500 },
    );
  }
}
