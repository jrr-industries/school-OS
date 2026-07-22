// ============================================================
// Temporary Development Authentication - Session Management
// Uses HTTP-only cookies with HMAC-signed tokens.
// This will be replaced with Supabase Auth / JWT in production.
// ============================================================

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { DevSession } from '@/features/auth/types';

const COOKIE_NAME = 'dev_session';
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

async function verifyToken(token: string): Promise<string | null> {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const payload = atob(encodedPayload);
    const expectedSig = await signToken(payload);
    const [, expectedSignature] = expectedSig.split('.');

    if (signature !== expectedSignature) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createDevSession(session: DevSession): Promise<string> {
  const cookieStore = await cookies();
  const token = await signToken(JSON.stringify(session));

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return token;
}

export function setDevSessionCookie(
  response: NextResponse,
  token: string,
): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
}

export async function getDevSession(): Promise<DevSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    return JSON.parse(payload) as DevSession;
  } catch {
    return null;
  }
}

export async function getDevSessionFromCookies(
  cookieValue: string | undefined,
): Promise<DevSession | null> {
  try {
    if (!cookieValue) return null;

    const payload = await verifyToken(cookieValue);
    if (!payload) return null;

    return JSON.parse(payload) as DevSession;
  } catch {
    return null;
  }
}

export async function destroyDevSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
