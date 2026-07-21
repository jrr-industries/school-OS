import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const designations = await prisma.designation.findMany({
      where: { schoolId: session.schoolId, deletedAt: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { department: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      success: true,
      data: designations.map((d) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        description: d.description,
        departmentId: d.departmentId,
        department: d.department ? { id: d.department.id, name: d.department.name } : undefined,
        hierarchyLevel: d.hierarchyLevel,
        isTeaching: d.isTeaching,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch designations';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}