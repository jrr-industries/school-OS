import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role) || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const schoolId = session.schoolId;

    const [school, userCounts] = await Promise.all([
      prisma.school.findUnique({ where: { id: schoolId } }),
      prisma.user.groupBy({
        by: ['status'],
        where: { schoolId, deletedAt: null },
        _count: { id: true },
      }),
    ]);

    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    const roleCounts = await prisma.userRole.findMany({
      where: {
        schoolId,
        user: { deletedAt: null, status: 'active' },
      },
      include: { role: { select: { slug: true } } },
      distinct: ['userId'],
    });

    const roleMap = new Map<string, Set<string>>();
    for (const ur of roleCounts) {
      if (!roleMap.has(ur.role.slug)) roleMap.set(ur.role.slug, new Set());
      roleMap.get(ur.role.slug)!.add(ur.userId);
    }

    const totalActiveUsers = userCounts.find((u) => u.status === 'active');
    const totalStudents = roleMap.get('student')?.size ?? 0;
    const totalTeachers = roleMap.get('teacher')?.size ?? 0;
    const totalParents = roleMap.get('parent')?.size ?? 0;
    const totalStaff = roleMap.get('staff')?.size ?? 0;

    const settings = (school.settings as Record<string, unknown>) ?? {};
    const board = typeof settings.board === 'string' ? settings.board : school.curriculum || 'CBSE';
    const academicYear = typeof settings.academicYear === 'string' ? settings.academicYear : '2026-27';
    const principalName = typeof settings.principalName === 'string' ? settings.principalName : 'Not assigned';

    return NextResponse.json({
      success: true,
      data: {
        schoolId: school.id,
        name: school.name,
        code: school.slug,
        board,
        type: school.type,
        address: school.address || '',
        phone: school.phone || '',
        email: school.email || '',
        website: school.website || '',
        principalName,
        academicYear,
        status: school.status,
        studentCount: totalStudents,
        teacherCount: totalTeachers,
        parentCount: totalParents,
        staffCount: totalStaff,
        activeUsers: totalActiveUsers?._count.id ?? 0,
        createdAt: school.createdAt.toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
