// ============================================================
// Temporary Development Authentication - Login API
// This will be replaced with Supabase Auth / JWT in production
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DevAuthService } from '@/features/auth/services/dev-auth.service';
import { createDevSession } from '@/lib/dev-session';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Development authentication is only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const authService = new DevAuthService();
    const session = await authService.login({ email, password });

    await createDevSession(session);

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.id,
          email: session.email,
          name: session.name,
          role: session.role,
          schoolId: session.schoolId,
          schoolName: session.schoolName,
        },
      },
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
