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
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '50');

    const where = { deletedAt: { not: null } };

    const [total, schools] = await Promise.all([
      prisma.school.count({ where: where as any }),
      prisma.school.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { deletedAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: schools.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        type: s.type,
        status: s.status,
        email: s.email,
        deletedAt: s.deletedAt?.toISOString() ?? null,
      })),
      meta: { page, limit, total },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch deleted schools';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
