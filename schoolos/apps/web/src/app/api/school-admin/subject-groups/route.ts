import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const groups = await prisma.subjectGroup.findMany({
      where: { schoolId: session.schoolId, isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { subjects: true } } },
    });

    return NextResponse.json({ success: true, data: groups });
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

    const { name, code } = await request.json();
    if (!name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const group = await prisma.subjectGroup.create({
      data: {
        schoolId: session.schoolId,
        name,
        code: code || name.toUpperCase().slice(0, 10),
      },
    });

    return NextResponse.json({ success: true, data: group }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed';
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ success: false, error: 'A group with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
