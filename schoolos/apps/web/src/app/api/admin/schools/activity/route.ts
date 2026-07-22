import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const period = url.searchParams.get('period') ?? '';

    let dateFilter: Date | null = null;
    const now = new Date();
    if (period === 'today') {
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'this_week') {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'this_month') {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const where: Record<string, unknown> = {};
    if (dateFilter) {
      where.createdAt = { gte: dateFilter };
    }

    const [logs, recentSchools] = await Promise.all([
      prisma.auditLog.findMany({
        where: where as any,
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          school: { select: { id: true, name: true } },
        },
      }),
      prisma.school.findMany({
        where: { deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        select: { id: true, name: true, status: true, updatedAt: true, createdAt: true, deletedAt: true },
      }),
    ]);

    const logActivities = logs.map((log) => ({
      id: log.id,
      schoolName: log.school?.name ?? 'Unknown School',
      action: log.action,
      description: log.description ?? `Audit log: ${log.action} on ${log.entity}`,
      timestamp: log.createdAt.toISOString(),
      icon: mapActionToIcon(log.action),
    }));

    const schoolActivities = recentSchools.map((school) => {
      const isNew = school.createdAt.getTime() === school.updatedAt.getTime();
      return {
        id: `school-${school.id}`,
        schoolName: school.name,
        action: isNew ? 'created' : 'updated',
        description: isNew
          ? `${school.name} was registered on the platform`
          : `${school.name} details were updated`,
        timestamp: school.updatedAt.toISOString(),
        icon: isNew ? 'created' : 'updated',
      };
    });

    const merged = [...logActivities, ...schoolActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);

    return NextResponse.json({ success: true, data: merged });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch activity';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

function mapActionToIcon(action: string): string {
  switch (action) {
    case 'CREATE': return 'created';
    case 'UPDATE': return 'updated';
    case 'DELETE': return 'deleted';
    case 'SUSPEND': return 'suspended';
    case 'ACTIVATE': return 'activated';
    case 'RESTORE': return 'restored';
    default: return 'default';
  }
}
