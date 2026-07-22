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
    const role = url.searchParams.get('role') ?? '';
    const schoolId = url.searchParams.get('schoolId') ?? '';

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (schoolId) {
      where.schoolId = schoolId;
    }
    if (role) {
      where.userRoles = {
        some: {
          role: { slug: role },
        },
      };
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where: where as any }),
      prisma.user.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          school: { select: { id: true, name: true } },
          userRoles: {
            include: { role: { select: { id: true, name: true, slug: true } } },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: users.map((u) => ({
        id: u.id,
        schoolId: u.schoolId,
        schoolName: u.school.name,
        email: u.email,
        name: u.name,
        phone: u.phone,
        status: u.status,
        isSuperAdmin: u.isSuperAdmin,
        roles: u.userRoles.map((ur) => ({
          id: ur.role.id,
          name: ur.role.name,
          slug: ur.role.slug,
        })),
        lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
        createdAt: u.createdAt.toISOString(),
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
      error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
