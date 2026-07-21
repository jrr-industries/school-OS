// ============================================================
// Temporary Development Authentication - Logout API
// This will be replaced with Supabase Auth / JWT in production
// ============================================================

import { NextResponse } from 'next/server';
import { destroyDevSession } from '@/lib/dev-session';

export async function POST() {
  await destroyDevSession();

  return NextResponse.json({ success: true });
}
