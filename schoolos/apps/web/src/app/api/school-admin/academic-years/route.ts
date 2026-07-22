import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const years = await prisma.academicYear.findMany({
      where: { schoolId: session.schoolId, deletedAt: null },
      orderBy: { startDate: 'desc' },
      select: { id: true, name: true, startDate: true, endDate: true, isCurrent: true, isActive: true },
    });

    return NextResponse.json({
      success: true,
      data: years.map((y) => ({
        ...y,
        startDate: y.startDate.toISOString(),
        endDate: y.endDate.toISOString(),
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

    const { name, startDate, endDate } = await request.json();
    if (!name || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'name, startDate, and endDate are required' }, { status: 400 });
    }

    const existingCount = await prisma.academicYear.count({
      where: { schoolId: session.schoolId, deletedAt: null },
    });

    const year = await prisma.academicYear.create({
      data: {
        schoolId: session.schoolId,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: existingCount === 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: year }, { status: 201 });
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

    const { id, isCurrent } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { schoolId: session.schoolId, isCurrent: true },
        data: { isCurrent: false },
      });
    }

    await prisma.academicYear.update({
      where: { id, schoolId: session.schoolId },
      data: { isCurrent: isCurrent ?? undefined },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
