import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '10');
    const search = url.searchParams.get('search') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const departmentId = url.searchParams.get('departmentId') ?? '';
    const designationId = url.searchParams.get('designationId') ?? '';

    const where: Record<string, unknown> = {
      schoolId: session.schoolId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (departmentId) where.departmentId = departmentId;
    if (designationId) where.designationId = designationId;

    const [total, employees] = await Promise.all([
      prisma.employee.count({ where: where as any }),
      prisma.employee.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          designation: true,
          department: true,
          user: { select: { id: true, email: true, name: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: employees.map((e) => ({
        id: e.id,
        schoolId: e.schoolId,
        userId: e.userId,
        designationId: e.designationId,
        departmentId: e.departmentId,
        employeeId: e.employeeId,
        firstName: e.firstName,
        middleName: e.middleName,
        lastName: e.lastName,
        email: e.email,
        phone: e.phone,
        alternatePhone: e.alternatePhone,
        gender: e.gender,
        dateOfBirth: e.dateOfBirth?.toISOString(),
        bloodGroup: e.bloodGroup,
        photo: e.photo,
        qualification: e.qualification,
        experience: e.experience,
        joiningDate: e.joiningDate?.toISOString(),
        employmentType: e.employmentType,
        status: e.status,
        isClassTeacher: e.isClassTeacher,
        designation: e.designation ? { id: e.designation.id, title: e.designation.title, slug: e.designation.slug } : undefined,
        department: e.department ? { id: e.department.id, name: e.department.name } : undefined,
        user: e.user ? { id: e.user.id, email: e.user.email, name: e.user.name } : undefined,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
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
    const message = error instanceof Error ? error.message : 'Failed to fetch staff';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const employee = await prisma.employee.create({
      data: {
        schoolId: session.schoolId,
        designationId: body.designationId,
        departmentId: body.departmentId || null,
        employeeId: body.employeeId,
        firstName: body.firstName,
        middleName: body.middleName || null,
        lastName: body.lastName,
        email: body.email || null,
        phone: body.phone || null,
        gender: body.gender || null,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        qualification: body.qualification || null,
        experience: body.experience ? parseInt(body.experience) : 0,
        joiningDate: body.joiningDate ? new Date(body.joiningDate) : null,
        employmentType: body.employmentType || 'full_time',
        status: body.status || 'active',
        createdBy: session.id,
      },
      include: {
        designation: true,
        department: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: employee.id,
        schoolId: employee.schoolId,
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        designation: employee.designation ? { id: employee.designation.id, title: employee.designation.title } : undefined,
        department: employee.department ? { id: employee.department.id, name: employee.department.name } : undefined,
        employmentType: employee.employmentType,
        status: employee.status,
        createdAt: employee.createdAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create staff';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}