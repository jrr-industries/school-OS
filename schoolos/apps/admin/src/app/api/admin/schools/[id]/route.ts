import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const school = await prisma.school.findUnique({
      where: { id, deletedAt: null },
    });

    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: school.id,
        name: school.name,
        code: school.slug,
        type: school.type,
        board: '',
        status: school.status,
        city: school.city ?? '',
        state: school.state ?? '',
        phone: school.phone ?? '',
        email: school.email ?? '',
        logo: school.logo ?? '',
        principal: '',
        studentsCount: 0,
        teachersCount: 0,
        staffCount: 0,
        subscription: '',
        subscriptionPlan: '',
        subscriptionStatus: '',
        subscriptionStart: '',
        subscriptionEnd: '',
        lastActivity: school.updatedAt.toISOString(),
        createdAt: school.createdAt.toISOString(),
        updatedAt: school.updatedAt.toISOString(),
        address: school.address ?? '',
        country: school.country ?? '',
        postalCode: school.postalCode ?? '',
        website: school.website ?? '',
        academicYear: '',
        medium: '',
        timezone: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        district: '',
        banner: '',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch school';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const school = await prisma.school.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: school });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update school';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.school.update({
      where: { id },
      data: {
        status: 'inactive',
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete school';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
