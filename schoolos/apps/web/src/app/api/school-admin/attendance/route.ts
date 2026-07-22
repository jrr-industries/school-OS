import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      where: { schoolId: session.schoolId, deletedAt: null, status: 'active' },
      include: { class: { select: { name: true } } },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: students.map((s) => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        className: s.class?.name || 'Unassigned',
        status: 'present',
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

    const { records } = await request.json();
    if (!records?.length) {
      return NextResponse.json({ success: false, error: 'No attendance records provided' }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: records.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
