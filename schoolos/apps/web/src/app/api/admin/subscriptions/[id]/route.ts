import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { id } = await params;

    const subscription = await prisma.subscription.findUnique({ where: { id } });
    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 },
      );
    }

    if (subscription.deletedAt) {
      return NextResponse.json(
        { success: false, error: 'Subscription already removed' },
        { status: 400 },
      );
    }

    await prisma.subscription.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Remove Subscription API Error]', error);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to remove subscription.' },
      { status: 500 },
    );
  }
}
