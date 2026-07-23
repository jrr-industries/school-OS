import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '10');
    const search = url.searchParams.get('search') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const deleted = url.searchParams.get('deleted') === 'true';

    const where: Record<string, unknown> = deleted ? { deletedAt: { not: null } } : { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }

    const [total, schools] = await Promise.all([
      prisma.school.count({ where: where as any }),
      prisma.school.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: { where: { deletedAt: null } },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: schools.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.slug,
        type: s.type,
        board: '',
        status: s.status,
        city: s.city ?? '',
        state: s.state ?? '',
        phone: s.phone ?? '',
        email: s.email ?? '',
        logo: s.logo ?? '',
        principal: '',
        studentsCount: 0,
        teachersCount: 0,
        staffCount: 0,
        subscription: '',
        subscriptionPlan: '',
        subscriptionStatus: '',
        subscriptionStart: '',
        subscriptionEnd: '',
        lastActivity: s.updatedAt.toISOString(),
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
        address: s.address ?? '',
        country: s.country ?? '',
        postalCode: s.postalCode ?? '',
        website: s.website ?? '',
        academicYear: '',
        medium: '',
        timezone: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        district: '',
        banner: '',
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
    const message = error instanceof Error ? error.message : 'Failed to fetch schools';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const school = await prisma.school.create({
      data: {
        name: body.schoolName,
        slug: body.schoolCode || body.schoolName.toLowerCase().replace(/\s+/g, '-'),
        type: body.schoolType?.toLowerCase().replace(/\s+/g, '_') || 'primary',
        status: 'trial',
        address: body.fullAddress,
        city: body.city,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
        phone: body.phoneNumber,
        email: body.email,
        website: body.website,
        logo: body.schoolLogoUrl,
      },
    });

    return NextResponse.json({ success: true, data: school }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create school';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
