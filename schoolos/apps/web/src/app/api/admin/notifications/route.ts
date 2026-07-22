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
    const type = url.searchParams.get('type') ?? '';
    const category = url.searchParams.get('category') ?? '';
    const isRead = url.searchParams.get('isRead') ?? '';

    const where: Record<string, unknown> = { deletedAt: null };
    if (type) where.type = type;
    if (category) where.category = category;
    if (isRead !== '') where.isRead = isRead === 'true';

    const [total, notifications] = await Promise.all([
      prisma.notification.count({ where: where as any }),
      prisma.notification.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: notifications.map((n) => ({
        id: n.id,
        schoolId: n.schoolId,
        userId: n.userId,
        user: n.user,
        type: n.type,
        category: n.category,
        title: n.title,
        message: n.message,
        link: n.link,
        isRead: n.isRead,
        readAt: n.readAt?.toISOString() ?? null,
        createdAt: n.createdAt.toISOString(),
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
      error instanceof Error ? error.message : 'Failed to fetch notifications';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { schoolId, userId, type, category, title, message, link, metadata } = body;

    if (!schoolId || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: schoolId, title' },
        { status: 400 },
      );
    }

    const notification = await prisma.notification.create({
      data: {
        schoolId,
        userId: userId ?? null,
        type: type ?? 'info',
        category: category ?? 'system',
        title,
        message: message ?? null,
        link: link ?? null,
        metadata: metadata ?? {},
      },
    });

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create notification';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
