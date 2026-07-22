import { NextResponse } from 'next/server';
import { getDevSession } from '@/lib/dev-session';

export async function POST(request: Request) {
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

    const body = await request.json();
    const { stripePublishableKey, stripeSecretKey, stripeWebhookSecret } = body;

    if (!stripePublishableKey || !stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: 'Publishable key and secret key are required' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        stripePublishableKey: stripePublishableKey ? `${stripePublishableKey.substring(0, 8)}...` : null,
        stripeSecretKey: stripeSecretKey ? '••••••••' : null,
        stripeWebhookSecret: stripeWebhookSecret ? '••••••••' : null,
        configured: true,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to save payment config';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
