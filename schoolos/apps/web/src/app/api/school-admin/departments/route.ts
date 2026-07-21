import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const departments = await prisma.department.findMany({
      where: { schoolId: session.schoolId, deletedAt: null, isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, code: true, description: true },
    });

    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch departments';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}