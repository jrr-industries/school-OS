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
    const search = url.searchParams.get('search') ?? '';

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, plans] = await Promise.all([
      prisma.subscriptionPlan.count({ where: where as any }),
      prisma.subscriptionPlan.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: plans,
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
      error instanceof Error ? error.message : 'Failed to fetch plans';
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
    const { name, slug, price, interval, description, currency, maxStudents, maxTeachers, maxStorageGB, features, isActive, sortOrder } = body;

    if (!name || !slug || price === undefined || !interval) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, slug, price, interval' },
        { status: 400 },
      );
    }

    const existing = await prisma.subscriptionPlan.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A plan with this slug already exists' },
        { status: 409 },
      );
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        slug,
        price,
        interval,
        description: description ?? null,
        currency: currency ?? 'USD',
        maxStudents: maxStudents ?? 100,
        maxTeachers: maxTeachers ?? 10,
        maxStorageGB: maxStorageGB ?? 1,
        features: features ?? [],
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create plan';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
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
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: id' },
        { status: 400 },
      );
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to update plan';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
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
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required query param: id' },
        { status: 400 },
      );
    }

    await prisma.subscriptionPlan.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete plan';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
