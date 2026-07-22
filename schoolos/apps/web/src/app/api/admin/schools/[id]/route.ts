import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: { where: { deletedAt: null } },
            students: true,
            employees: true,
          },
        },
      },
    });

    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: school.id,
        name: school.name,
        slug: school.slug,
        type: school.type,
        status: school.status,
        email: school.email,
        phone: school.phone,
        address: school.address,
        city: school.city,
        state: school.state,
        country: school.country,
        postalCode: school.postalCode,
        website: school.website,
        logo: school.logo,
        curriculum: school.curriculum,
        establishedYear: school.establishedYear,
        users: school._count.users,
        students: school._count.students,
        employees: school._count.employees,
        createdAt: school.createdAt.toISOString(),
        updatedAt: school.updatedAt.toISOString(),
        deletedAt: school.deletedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch school';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.school.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'name', 'slug', 'type', 'status', 'email', 'phone', 'address',
      'city', 'state', 'country', 'postalCode', 'website', 'logo',
      'curriculum', 'establishedYear',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.deletedAt !== undefined) {
      updateData.deletedAt = body.deletedAt === null ? null : new Date(body.deletedAt);
    }

    const updated = await prisma.school.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        type: updated.type,
        status: updated.status,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        city: updated.city,
        state: updated.state,
        country: updated.country,
        postalCode: updated.postalCode,
        website: updated.website,
        logo: updated.logo,
        curriculum: updated.curriculum,
        establishedYear: updated.establishedYear,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        deletedAt: updated.deletedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update school';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
