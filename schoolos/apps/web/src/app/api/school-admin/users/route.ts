import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';
import { createHash } from 'crypto';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: { schoolId: session.schoolId, deletedAt: null, isSuperAdmin: false },
      include: {
        userRoles: {
          include: { role: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: users.map((u) => ({
        id: u.id,
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
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, roleSlug } = await request.json();

    if (!name || !email || !password || !roleSlug) {
      return NextResponse.json({ success: false, error: 'name, email, password, and roleSlug are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A user with this email already exists' }, { status: 409 });
    }

    const role = await prisma.role.findUnique({
      where: { schoolId_slug: { schoolId: session.schoolId, slug: roleSlug } },
    });
    if (!role) {
      return NextResponse.json({ success: false, error: `Role "${roleSlug}" not found for this school` }, { status: 400 });
    }

    const passwordHash = createHash('sha256').update(password).digest('hex');

    const user = await prisma.user.create({
      data: {
        schoolId: session.schoolId,
        email,
        name,
        status: 'active',
        isSuperAdmin: false,
        metadata: {
          passwordHash,
          createdByRole: 'school_admin',
          isDevModeOnly: true,
        },
        userRoles: {
          create: {
            roleId: role.id,
            schoolId: session.schoolId,
          },
        },
      },
      include: {
        userRoles: {
          include: { role: { select: { id: true, name: true, slug: true } } },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        status: user.status,
        roles: user.userRoles.map((ur) => ({
          id: ur.role.id,
          name: ur.role.name,
          slug: ur.role.slug,
        })),
        createdAt: user.createdAt.toISOString(),
      },
      }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, status } = await request.json();
    if (!userId || !status) {
      return NextResponse.json({ success: false, error: 'userId and status are required' }, { status: 400 });
    }

    const target = await prisma.user.findFirst({
      where: { id: userId, schoolId: session.schoolId, deletedAt: null },
    });
    if (!target) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
