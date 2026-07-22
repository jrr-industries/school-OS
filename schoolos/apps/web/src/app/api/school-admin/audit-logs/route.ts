import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: Record<string, unknown> = { schoolId: session.schoolId };
    if (action) where.action = action;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) (where.createdAt as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.createdAt as Record<string, unknown>).lte = new Date(endDate);
    }

    const logs = await prisma.auditLog.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    const mapped = logs.map((log) => ({
      id: log.id,
      schoolId: log.schoolId,
      action: log.action,
      performedBy: log.user?.name || log.userId || 'System',
      performedByUid: log.userId,
      target: log.entity ? `${log.entity}:${log.entityId || ''}` : log.entityId || '-',
      details: log.description || '',
      ipAddress: log.ipAddress || '',
      device: log.userAgent || '',
      timestamp: log.createdAt.toISOString(),
    }));

    const total = await prisma.auditLog.count({ where: where as any });

    return NextResponse.json({
      success: true,
      data: mapped,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
