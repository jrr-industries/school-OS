import { NextResponse } from 'next/server';
import { getDevSession } from '@/lib/dev-session';
import { resolveDevUser } from '@/lib/chat-utils';

const DEV_SECRET = 'schoolos-dev-secret-key-do-not-use-in-production';

async function signToken(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(DEV_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${btoa(payload)}.${sig}`;
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ success: false, error: 'Dev only' }, { status: 403 });
  }
  const session = await getDevSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const user = await resolveDevUser(session);
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }
  const token = await signToken(JSON.stringify({
    id: user.id,
    name: session.name,
    email: session.email,
    role: session.role,
  }));
  return NextResponse.json({
    success: true,
    data: { token, userId: user.id, name: session.name, email: session.email, role: session.role },
  });
}
