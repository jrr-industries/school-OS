import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

const DEFAULT_ROLES = [
  { name: 'School Admin', slug: 'school_admin', description: 'Full school management access', isSystem: true, sortOrder: 1 },
  { name: 'Teacher', slug: 'teacher', description: 'Teaching staff access', isSystem: true, sortOrder: 2 },
  { name: 'Staff', slug: 'staff', description: 'Non-teaching staff access', isSystem: true, sortOrder: 3 },
  { name: 'Parent', slug: 'parent', description: 'Parent/guardian access', isSystem: true, sortOrder: 4 },
  { name: 'Student', slug: 'student', description: 'Student access', isSystem: true, sortOrder: 5 },
];

const DEFAULT_DESIGNATIONS = [
  { title: 'Principal', slug: 'principal', description: 'Head of the school', hierarchyLevel: 90, isTeaching: false, sortOrder: 1 },
  { title: 'Vice Principal', slug: 'vice_principal', description: 'Deputy head of the school', hierarchyLevel: 80, isTeaching: true, sortOrder: 2 },
  { title: 'Head of Department', slug: 'hod', description: 'Department head', hierarchyLevel: 70, isTeaching: true, sortOrder: 3 },
  { title: 'Senior Teacher', slug: 'senior_teacher', description: 'Experienced teacher', hierarchyLevel: 60, isTeaching: true, sortOrder: 4 },
  { title: 'Teacher', slug: 'teacher', description: 'Classroom teacher', hierarchyLevel: 50, isTeaching: true, sortOrder: 5 },
  { title: 'Associate Teacher', slug: 'associate_teacher', description: 'Junior teacher', hierarchyLevel: 40, isTeaching: true, sortOrder: 6 },
  { title: 'Counselor', slug: 'counselor', description: 'Student counselor', hierarchyLevel: 55, isTeaching: false, sortOrder: 7 },
  { title: 'Librarian', slug: 'librarian', description: 'Library manager', hierarchyLevel: 45, isTeaching: false, sortOrder: 8 },
  { title: 'Lab Assistant', slug: 'lab_assistant', description: 'Laboratory assistant', hierarchyLevel: 35, isTeaching: false, sortOrder: 9 },
  { title: 'Accountant', slug: 'accountant', description: 'School accountant', hierarchyLevel: 50, isTeaching: false, sortOrder: 10 },
  { title: 'HR Manager', slug: 'hr_manager', description: 'Human resources manager', hierarchyLevel: 55, isTeaching: false, sortOrder: 11 },
  { title: 'Office Staff', slug: 'office_staff', description: 'Administrative staff', hierarchyLevel: 30, isTeaching: false, sortOrder: 12 },
  { title: 'Receptionist', slug: 'receptionist', description: 'Front desk receptionist', hierarchyLevel: 25, isTeaching: false, sortOrder: 13 },
  { title: 'IT Support', slug: 'it_support', description: 'IT support technician', hierarchyLevel: 40, isTeaching: false, sortOrder: 14 },
  { title: 'Transport Manager', slug: 'transport_manager', description: 'Transport department head', hierarchyLevel: 45, isTeaching: false, sortOrder: 15 },
  { title: 'Bus Driver', slug: 'bus_driver', description: 'School bus driver', hierarchyLevel: 20, isTeaching: false, sortOrder: 16 },
  { title: 'Hostel Warden', slug: 'hostel_warden', description: 'Hostel supervisor', hierarchyLevel: 40, isTeaching: false, sortOrder: 17 },
  { title: 'Security Guard', slug: 'security_guard', description: 'Security personnel', hierarchyLevel: 15, isTeaching: false, sortOrder: 18 },
  { title: 'Janitor', slug: 'janitor', description: 'Custodial staff', hierarchyLevel: 10, isTeaching: false, sortOrder: 19 },
  { title: 'Sports Coach', slug: 'sports_coach', description: 'Physical education coach', hierarchyLevel: 45, isTeaching: true, sortOrder: 20 },
];

const DEFAULT_DEPARTMENTS = [
  { name: 'Administration', code: 'ADMIN', description: 'School administration and management' },
  { name: 'Science', code: 'SCI', description: 'Science department' },
  { name: 'Mathematics', code: 'MATH', description: 'Mathematics department' },
  { name: 'Languages', code: 'LANG', description: 'Languages department' },
  { name: 'Social Studies', code: 'SOC', description: 'Social studies department' },
  { name: 'Arts', code: 'ARTS', description: 'Arts and creative education' },
  { name: 'Physical Education', code: 'PE', description: 'Physical education and sports' },
  { name: 'Finance', code: 'FIN', description: 'Finance and accounting' },
  { name: 'Human Resources', code: 'HR', description: 'Human resources department' },
  { name: 'Library', code: 'LIB', description: 'Library and media center' },
  { name: 'Transport', code: 'TRANS', description: 'Transport department' },
  { name: 'Hostel', code: 'HOST', description: 'Hostel management' },
  { name: 'IT', code: 'IT', description: 'Information technology' },
  { name: 'Security', code: 'SEC', description: 'Security department' },
];

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
    const { name, slug, type, address, email, phone, adminName, adminEmail } = body;

    if (!name || !slug || !type || !adminName || !adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, slug, type, adminName, adminEmail' },
        { status: 400 },
      );
    }

    const existingSchool = await prisma.school.findUnique({ where: { slug } });
    if (existingSchool) {
      return NextResponse.json(
        { success: false, error: 'A school with this slug already exists' },
        { status: 409 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A user with this email already exists' },
        { status: 409 },
      );
    }

    const school = await prisma.school.create({
      data: {
        name,
        slug,
        type,
        address: address || null,
        email: email || null,
        phone: phone || null,
        status: 'active',
        createdBy: session.id,
      },
    });

    const roles = await Promise.all(
      DEFAULT_ROLES.map((role) =>
        prisma.role.create({
          data: {
            schoolId: school.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            isSystem: role.isSystem,
            sortOrder: role.sortOrder,
            createdBy: session.id,
          },
        }),
      ),
    );

    await Promise.all(
      DEFAULT_DESIGNATIONS.map((des) =>
        prisma.designation.create({
          data: {
            schoolId: school.id,
            title: des.title,
            slug: des.slug,
            description: des.description,
            hierarchyLevel: des.hierarchyLevel,
            isTeaching: des.isTeaching,
            isActive: true,
            sortOrder: des.sortOrder,
            createdBy: session.id,
          },
        }),
      ),
    );

    await Promise.all(
      DEFAULT_DEPARTMENTS.map((dep) =>
        prisma.department.create({
          data: {
            schoolId: school.id,
            name: dep.name,
            code: dep.code,
            description: dep.description,
            isActive: true,
            createdBy: session.id,
          },
        }),
      ),
    );

    const adminRole = roles.find((r) => r.slug === 'school_admin')!;

    const adminUser = await prisma.user.create({
      data: {
        schoolId: school.id,
        email: adminEmail,
        name: adminName,
        status: 'active',
        isSuperAdmin: false,
        createdBy: session.id,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
        schoolId: school.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        school: {
          id: school.id,
          name: school.name,
          slug: school.slug,
          type: school.type,
          email: school.email,
          phone: school.phone,
          status: school.status,
        },
        admin: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
        },
        credentials: {
          email: adminUser.email,
          password: 'Admin@123',
        },
        roles: roles.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
        })),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create school';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
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

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '10');
    const search = url.searchParams.get('search') ?? '';

    const where: Record<string, unknown> = { deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, schools] = await Promise.all([
      prisma.school.count({ where: where as any }),
      prisma.school.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: { where: { deletedAt: null } },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: schools.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        type: s.type,
        status: s.status,
        email: s.email,
        phone: s.phone,
        address: s.address,
        city: s.city,
        state: s.state,
        users: s._count.users,
        createdAt: s.createdAt.toISOString(),
      })),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch schools';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}