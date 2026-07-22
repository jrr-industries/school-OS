import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { schoolId: session.schoolId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: notifications.map((n) => {
        const meta = (n.metadata as Record<string, unknown>) ?? {};
        return {
          id: n.id,
          title: n.title,
          message: n.message || '',
          type: meta.type || n.type,
          priority: meta.priority || 'normal',
          targetRole: meta.targetRole || 'all',
          createdBy: meta.createdBy as string || '',
          createdAt: n.createdAt.toISOString(),
          read: n.isRead,
          archived: !!n.deletedAt,
        };
      }),
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

    const { title, message, type, priority, targetRole } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ success: false, error: 'title and message are required' }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        schoolId: session.schoolId,
        title,
        message,
        type: 'info',
        category: 'system',
        metadata: {
          type: type || 'announcement',
          priority: priority || 'normal',
          targetRole: targetRole || 'all',
          createdBy: session.id,
        },
      },
    });

    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
