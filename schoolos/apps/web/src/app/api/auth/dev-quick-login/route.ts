import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createDevSession, setDevSessionCookie } from '@/lib/dev-session';
import { prisma } from '@schoolos/database';

const ROLE_MAP: Record<string, { role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STAFF' | 'PARENT' | 'STUDENT'; label: string; devEmail: string }> = {
  'super_admin': { role: 'SUPER_ADMIN', label: 'Super Admin', devEmail: 'admin@schoolos.dev' },
  'school_admin': { role: 'SCHOOL_ADMIN', label: 'School Admin', devEmail: 'schooladmin@schoolos.dev' },
  'teacher': { role: 'TEACHER', label: 'Teacher', devEmail: 'teacher@schoolos.dev' },
  'staff': { role: 'STAFF', label: 'Staff', devEmail: 'staff@schoolos.dev' },
  'parent': { role: 'PARENT', label: 'Parent', devEmail: 'parent@schoolos.dev' },
  'student': { role: 'STUDENT', label: 'Student', devEmail: 'student@schoolos.dev' },
};

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { roleSlug, schoolId } = body;

    if (!roleSlug || !ROLE_MAP[roleSlug]) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Valid roles: ' + Object.keys(ROLE_MAP).join(', ') },
        { status: 400 },
      );
    }

    const roleConfig = ROLE_MAP[roleSlug];

    if (roleConfig.role === 'SUPER_ADMIN') {
      const token = await createDevSession({
        id: 'dev-super-admin-001',
        email: 'admin@schoolos.dev',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        permissions: ['*'],
        authenticated: true,
      });

      const response = NextResponse.json({
        success: true,
        data: { redirect: '/admin/dashboard' },
      });
      setDevSessionCookie(response, token);
      return response;
    }

    const targetSchoolId = schoolId || (await getFirstSchoolId());
    if (!targetSchoolId) {
      return NextResponse.json(
        { success: false, error: 'No school found. Create a school first as Super Admin.' },
        { status: 404 },
      );
    }

    const school = await prisma.school.findUnique({
      where: { id: targetSchoolId },
      select: { id: true, name: true },
    });

    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 },
      );
    }

    const token = await createDevSession({
      id: `dev-${roleSlug}-001`,
      email: roleConfig.devEmail,
      name: roleConfig.label,
      role: roleConfig.role,
      schoolId: school.id,
      schoolName: school.name,
      permissions: ['*'],
      authenticated: true,
    });

    const redirectMap: Record<string, string> = {
      school_admin: '/school-admin/dashboard',
      teacher: '/school-admin/dashboard',
      staff: '/school-admin/dashboard',
      parent: '/school-admin/dashboard',
      student: '/school-admin/dashboard',
    };

    const response = NextResponse.json({
      success: true,
      data: { redirect: redirectMap[roleSlug] || '/school-admin/dashboard' },
    });
    setDevSessionCookie(response, token);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Quick login failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

async function getFirstSchoolId(): Promise<string | null> {
  try {
    const school = await prisma.school.findFirst({
      where: { deletedAt: null },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
    });
    return school?.id ?? null;
  } catch {
    return null;
  }
}
