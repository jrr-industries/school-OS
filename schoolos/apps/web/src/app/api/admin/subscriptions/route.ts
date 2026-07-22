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
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '10');
    const status = url.searchParams.get('status') ?? '';
    const search = url.searchParams.get('search') ?? '';

    const where: Record<string, unknown> = { deletedAt: null };
    if (status) {
      where.status = status;
    }
    if (search) {
      where.school = { name: { contains: search, mode: 'insensitive' } };
    }

    const [total, subscriptions] = await Promise.all([
      prisma.subscription.count({ where: where as any }),
      prisma.subscription.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          school: { select: { id: true, name: true } },
          plan: { select: { id: true, name: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: subscriptions.map((s) => ({
        id: s.id,
        schoolId: s.schoolId,
        schoolName: s.school.name,
        planId: s.planId,
        planName: s.plan.name,
        status: s.status,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt?.toISOString() ?? null,
        trialEndsAt: s.trialEndsAt?.toISOString() ?? null,
        autoRenew: s.autoRenew,
        amount: s.planId ? undefined : undefined,
        createdAt: s.createdAt.toISOString(),
      })),
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
    const message =
      error instanceof Error ? error.message : 'Failed to fetch subscriptions';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
