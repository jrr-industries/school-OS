import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET(_request: Request, context: { params: Promise<Record<string, string>> }) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const employee = await prisma.employee.findFirst({
      where: { id, schoolId: session.schoolId, deletedAt: null },
      include: {
        designation: true,
        department: true,
        user: { select: { id: true, email: true, name: true } },
        documents: { where: { deletedAt: null } },
        addresses: { where: { deletedAt: null } },
        emergencyContacts: { where: { deletedAt: null } },
      },
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: employee.id,
        schoolId: employee.schoolId,
        userId: employee.userId,
        designationId: employee.designationId,
        departmentId: employee.departmentId,
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        alternatePhone: employee.alternatePhone,
        gender: employee.gender,
        dateOfBirth: employee.dateOfBirth?.toISOString(),
        bloodGroup: employee.bloodGroup,
        photo: employee.photo,
        signature: employee.signature,
        qualification: employee.qualification,
        experience: employee.experience,
        joiningDate: employee.joiningDate?.toISOString(),
        leavingDate: employee.leavingDate?.toISOString(),
        leavingReason: employee.leavingReason,
        employmentType: employee.employmentType,
        status: employee.status,
        isClassTeacher: employee.isClassTeacher,
        designation: employee.designation ? { id: employee.designation.id, title: employee.designation.title, slug: employee.designation.slug, hierarchyLevel: employee.designation.hierarchyLevel, isTeaching: employee.designation.isTeaching } : undefined,
        department: employee.department ? { id: employee.department.id, name: employee.department.name } : undefined,
        user: employee.user ? { id: employee.user.id, email: employee.user.email, name: employee.user.name } : undefined,
        documents: employee.documents,
        addresses: employee.addresses,
        emergencyContacts: employee.emergencyContacts,
        createdAt: employee.createdAt.toISOString(),
        updatedAt: employee.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch staff';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<Record<string, string>> }) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.employee.findFirst({
      where: { id, schoolId: session.schoolId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        designationId: body.designationId ?? existing.designationId,
        departmentId: body.departmentId !== undefined ? (body.departmentId || null) : existing.departmentId,
        firstName: body.firstName ?? existing.firstName,
        middleName: body.middleName !== undefined ? (body.middleName || null) : existing.middleName,
        lastName: body.lastName ?? existing.lastName,
        email: body.email !== undefined ? (body.email || null) : existing.email,
        phone: body.phone !== undefined ? (body.phone || null) : existing.phone,
        gender: body.gender !== undefined ? (body.gender || null) : existing.gender,
        dateOfBirth: body.dateOfBirth !== undefined ? (body.dateOfBirth ? new Date(body.dateOfBirth) : null) : existing.dateOfBirth,
        qualification: body.qualification !== undefined ? (body.qualification || null) : existing.qualification,
        experience: body.experience !== undefined ? parseInt(body.experience) : existing.experience,
        joiningDate: body.joiningDate !== undefined ? (body.joiningDate ? new Date(body.joiningDate) : null) : existing.joiningDate,
        employmentType: body.employmentType ?? existing.employmentType,
        status: body.status ?? existing.status,
        updatedBy: session.id,
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
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        designation: employee.designation ? { id: employee.designation.id, title: employee.designation.title } : undefined,
        department: employee.department ? { id: employee.department.id, name: employee.department.name } : undefined,
        employmentType: employee.employmentType,
        status: employee.status,
        updatedAt: employee.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update staff';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<Record<string, string>> }) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.employee.findFirst({
      where: { id, schoolId: session.schoolId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 });
    }

    await prisma.employee.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'resigned',
        updatedBy: session.id,
      },
    });

    return NextResponse.json({ success: true, data: { message: 'Staff deleted successfully' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete staff';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}