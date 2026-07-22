import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [subjects, groups] = await Promise.all([
      prisma.subject.findMany({
        where: { schoolId: session.schoolId, deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          department: { select: { id: true, name: true } },
          group: { select: { id: true, name: true } },
        },
      }),
      prisma.subjectGroup.findMany({
        where: { schoolId: session.schoolId, isActive: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { subjects: true } } },
      }),
    ]);

    return NextResponse.json({ success: true, data: subjects, groups });
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

    const { name, code, type, departmentId, groupId, creditHours, maxMarks, passMarks, isLanguage, isOptional } = await request.json();
    if (!name || !code) {
      return NextResponse.json({ success: false, error: 'name and code are required' }, { status: 400 });
    }

    const subj = await prisma.subject.create({
      data: {
        schoolId: session.schoolId,
        name, code,
        type: type || 'theory',
        departmentId: departmentId || null,
        groupId: groupId || null,
        creditHours: creditHours || 0,
        maxMarks: maxMarks || 100,
        passMarks: passMarks || 35,
        isLanguage: isLanguage || false,
        isOptional: isOptional || false,
      },
    });

    return NextResponse.json({ success: true, data: subj }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed';
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ success: false, error: 'A subject with this code already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, code, type, departmentId, groupId, creditHours, maxMarks, passMarks, isLanguage, isOptional, isActive } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (code !== undefined) updateData.code = code;
    if (type !== undefined) updateData.type = type;
    if (departmentId !== undefined) updateData.departmentId = departmentId;
    if (groupId !== undefined) updateData.groupId = groupId;
    if (creditHours !== undefined) updateData.creditHours = creditHours;
    if (maxMarks !== undefined) updateData.maxMarks = maxMarks;
    if (passMarks !== undefined) updateData.passMarks = passMarks;
    if (isLanguage !== undefined) updateData.isLanguage = isLanguage;
    if (isOptional !== undefined) updateData.isOptional = isOptional;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.subject.update({
      where: { id, schoolId: session.schoolId },
      data: updateData,
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
    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });

    await prisma.subject.update({
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
