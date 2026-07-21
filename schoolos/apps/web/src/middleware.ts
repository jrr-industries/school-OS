// ============================================================
// Middleware - Route Protection
// Production: Supabase Auth
// Development: Temporary Dev Auth for /admin/*
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getDevSessionFromCookies } from '@/lib/dev-session';

const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/callback',
  '/api/auth/dev-login',
  '/api/health',
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
];

const adminPaths = ['/admin', '/school-admin'];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path),
  );
}

function isAdminPath(pathname: string): boolean {
  return adminPaths.some((path) => pathname === path || pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================================
  // Temporary Development Authentication
  // Protects /admin/* routes using dev session cookie
  // ============================================================
  if (process.env.NODE_ENV === 'development' && isAdminPath(pathname)) {
    const session = await getDevSessionFromCookies(
      request.cookies.get('dev_session')?.value,
    );

    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Allow public paths through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ============================================================
  // Production Authentication - Supabase
  // ============================================================
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      `[Middleware] Missing Supabase environment variables. ` +
      `Create apps/web/.env with SUPABASE_URL and SUPABASE_ANON_KEY ` +
      `from https://supabase.com/dashboard/project/_/settings/api`,
    );

    if (process.env.NODE_ENV === 'development') {
      // In development, allow access without Supabase
      // so developers can work on UI without configuring Supabase
      return NextResponse.next();
    }

    return new NextResponse('Configuration Error: Supabase credentials not configured.', { status: 500 });
  }

  const response = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const tenantHeader = request.headers.get('x-school-id');
  if (!tenantHeader && !pathname.startsWith('/api/auth')) {
    const schoolSlug = pathname.split('/')[1];
    if (schoolSlug && schoolSlug !== 'api' && schoolSlug !== '_next') {
      response.headers.set('x-tenant-slug', schoolSlug);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
