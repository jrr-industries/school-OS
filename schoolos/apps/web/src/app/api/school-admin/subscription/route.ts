import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });

    const currentSubscription = await prisma.subscription.findFirst({
      where: { schoolId: session.schoolId, deletedAt: null },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: { plans, currentSubscription } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, paymentMethod, paymentReference } = await request.json();
    if (!planId) {
      return NextResponse.json({ success: false, error: 'planId is required' }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan || !plan.isActive) {
      return NextResponse.json({ success: false, error: 'Plan not found or inactive' }, { status: 404 });
    }

    const existing = await prisma.subscription.findFirst({
      where: { schoolId: session.schoolId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    const meta: Record<string, unknown> = {};
    if (paymentMethod) meta.paymentMethod = paymentMethod;
    if (paymentReference) meta.paymentReference = paymentReference;

    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          planId,
          status: 'active',
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelledAt: null,
          paymentMethod: paymentMethod || existing.paymentMethod,
          paymentReference: paymentReference || existing.paymentReference,
          metadata: { ...((existing.metadata as Record<string, unknown>) || {}), ...meta, lastPaymentAt: new Date().toISOString() },
          updatedBy: session.id,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          schoolId: session.schoolId,
          planId,
          status: 'active',
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentMethod: paymentMethod || null,
          paymentReference: paymentReference || null,
          metadata: { paymentMethod, paymentReference, paidAt: new Date().toISOString() },
          createdBy: session.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
