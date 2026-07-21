// ============================================================
// Middleware - Route Protection
// Production: Firebase Auth / BetterAuth with Session Verification
// Development: Dev Auth for /admin/* and /school-admin/*
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDevSessionFromCookies } from '@/lib/dev-session';

const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/callback',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/dev-login',
  '/api/auth/dev-quick-login',
  '/api/auth/session',
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

  // Allow public paths through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ============================================================
  // Development Authentication
  // Protects /admin/* and /school-admin/* routes using dev session cookie
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

    if (pathname.startsWith('/admin') && session.role !== 'SUPER_ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/school-admin') && session.role !== 'SCHOOL_ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ============================================================
  // Production - Firebase / BetterAuth Session Verification
  // Session is verified by API endpoints; middleware does initial check
  // ============================================================
  if (isAdminPath(pathname)) {
    const sessionCookie = request.cookies.get('session')?.value;
    const devSessionCookie = request.cookies.get('dev_session')?.value;

    if (!sessionCookie && !devSessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

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
