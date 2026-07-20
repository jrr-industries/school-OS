import type { NextRequest } from 'next/server';

export function extractTenant(request: NextRequest): string | null {
  const headers = request.headers;
  const schoolId = headers.get('x-school-id');
  const tenantSlug = headers.get('x-tenant-slug');

  if (schoolId) return schoolId;
  if (tenantSlug) return tenantSlug;

  const hostname = headers.get('host') ?? '';
  const subdomain = hostname.split('.')[0];

  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    return subdomain;
  }

  return null;
}

export function requireTenant(
  request: NextRequest,
  tenantId: string | null,
): boolean {
  const protectedPaths = ['/dashboard', '/api/private'];
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !tenantId) {
    return false;
  }

  return true;
}
