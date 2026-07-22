import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const classes = await prisma.studentClass.findMany({
      where: { schoolId: session.schoolId, deletedAt: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true, name: true, code: true, description: true,
        maxCapacity: true, sortOrder: true,
        _count: { select: { students: true, sections: true } },
      },
    });

    return NextResponse.json({ success: true, data: classes });
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

    const { name, code, description, maxCapacity } = await request.json();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const currentYear = await prisma.academicYear.findFirst({
      where: { schoolId: session.schoolId, isCurrent: true, deletedAt: null },
    });

    const cls = await prisma.studentClass.create({
      data: {
        schoolId: session.schoolId,
        academicYearId: currentYear?.id || '',
        name,
        code: code || null,
        description: description || null,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : 40,
      },
    });

    return NextResponse.json({ success: true, data: cls }, { status: 201 });
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

    const { id, name, code, description, maxCapacity } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    await prisma.studentClass.update({
      where: { id, schoolId: session.schoolId },
      data: {
        ...(name !== undefined && { name }),
        ...(code !== undefined && { code }),
        ...(description !== undefined && { description }),
        ...(maxCapacity !== undefined && { maxCapacity: parseInt(maxCapacity) }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    await prisma.studentClass.update({
      where: { id, schoolId: session.schoolId },
      data: { isActive: false, deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
