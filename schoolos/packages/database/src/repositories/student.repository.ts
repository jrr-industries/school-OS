import type { Prisma } from '@prisma/client';
import { prisma } from '../client';
import { BaseRepository, type FindAllParams } from './base.repository';

type Student = Prisma.StudentGetPayload<{
  include: {
    class: true;
    section: true;
    campus: true;
    academicYear: true;
    category: true;
    house: true;
    guardians: { include: { parent: true } };
    addresses: true;
    medical: true;
    documents: true;
  };
}>;

type CreateStudentInput = Prisma.StudentUncheckedCreateInput;
type UpdateStudentInput = Prisma.StudentUncheckedUpdateInput;

interface StudentFindAllParams extends FindAllParams {
  campusId?: string;
  classId?: string;
  sectionId?: string;
  academicYearId?: string;
  categoryId?: string;
  houseId?: string;
  gender?: string;
  status?: string;
  isArchived?: boolean;
}

export class StudentRepository extends BaseRepository<Student, CreateStudentInput, UpdateStudentInput> {
  protected modelName = 'student';

  async findAll(
    schoolId: string,
    params: StudentFindAllParams = {},
  ) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      filters = {},
      campusId,
      classId,
      sectionId,
      academicYearId,
      categoryId,
      houseId,
      gender,
      status,
      isArchived,
    } = params;

    const where: Record<string, unknown> = {
      schoolId,
      deletedAt: null,
      ...filters,
    };

    if (campusId) where.campusId = campusId;
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (academicYearId) where.academicYearId = academicYearId;
    if (categoryId) where.categoryId = categoryId;
    if (houseId) where.houseId = houseId;
    if (gender) where.gender = gender;
    if (status) where.status = status;
    if (isArchived !== undefined) where.isArchived = isArchived;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { admissionNumber: { contains: search, mode: 'insensitive' } },
        { rollNumber: { contains: search, mode: 'insensitive' } },
        { emisNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.student.count({ where: where as Prisma.StudentWhereInput }),
      prisma.student.findMany({
        where: where as Prisma.StudentWhereInput,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          class: true,
          section: true,
          campus: true,
          academicYear: true,
          category: true,
          house: true,
          guardians: { include: { parent: true } },
          addresses: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as unknown as Student[],
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findByIdWithDetails(id: string, schoolId: string) {
    return prisma.student.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        class: true,
        section: true,
        campus: true,
        academicYear: true,
        category: true,
        house: true,
        admissionSource: true,
        guardians: { include: { parent: true } },
        addresses: true,
        medical: true,
        documents: true,
        emergencyContacts: true,
        previousSchools: true,
        promotions: {
          include: { fromClass: true, toClass: true },
          orderBy: { createdAt: 'desc' },
        },
        transfers: { orderBy: { transferDate: 'desc' } },
        archives: { orderBy: { archivedAt: 'desc' } },
      },
    });
  }

  async findByAdmissionNumber(admissionNumber: string, schoolId: string) {
    return prisma.student.findFirst({
      where: { admissionNumber, schoolId, deletedAt: null },
    });
  }

  async countByClass(classId: string, schoolId: string) {
    return prisma.student.count({
      where: { classId, schoolId, deletedAt: null, status: 'active' },
    });
  }

  async countBySection(sectionId: string, schoolId: string) {
    return prisma.student.count({
      where: { sectionId, schoolId, deletedAt: null, status: 'active' },
    });
  }

  async getStudentStats(schoolId: string) {
    const [total, active, byGender, byStatus] = await Promise.all([
      prisma.student.count({ where: { schoolId, deletedAt: null } }),
      prisma.student.count({ where: { schoolId, deletedAt: null, status: 'active' } }),
      prisma.student.groupBy({
        by: ['gender'],
        where: { schoolId, deletedAt: null },
        _count: true,
      }),
      prisma.student.groupBy({
        by: ['status'],
        where: { schoolId, deletedAt: null },
        _count: true,
      }),
    ]);

    return { total, active, byGender, byStatus };
  }

  async bulkCreate(students: CreateStudentInput[]) {
    return prisma.student.createMany({ data: students as Prisma.StudentCreateManyInput[] });
  }

  async bulkUpdateStatus(
    ids: string[],
    schoolId: string,
    status: Student['status'],
    userId?: string,
  ) {
    return prisma.student.updateMany({
      where: { id: { in: ids }, schoolId, deletedAt: null },
      data: { status, updatedBy: userId, version: { increment: 1 } },
    });
  }

  async bulkArchive(
    ids: string[],
    schoolId: string,
    reason: string,
    userId: string,
  ) {
    return prisma.$transaction(async (tx: any) => {
      await tx.student.updateMany({
        where: { id: { in: ids }, schoolId, deletedAt: null },
        data: {
          isArchived: true,
          archiveReason: reason,
          archivedAt: new Date(),
          status: 'archived',
          updatedBy: userId,
          version: { increment: 1 },
        },
      });

      const archives = ids.map((studentId) => ({
        studentId,
        schoolId,
        reason,
        archivedBy: userId,
      }));

      await tx.studentArchive.createMany({ data: archives });
    });
  }

  async bulkRestore(ids: string[], schoolId: string, userId: string) {
    return prisma.$transaction(async (tx: any) => {
      await tx.student.updateMany({
        where: { id: { in: ids }, schoolId, deletedAt: null },
        data: {
          isArchived: false,
          archiveReason: null,
          archivedAt: null,
          status: 'active',
          updatedBy: userId,
          version: { increment: 1 },
        },
      });

      await tx.studentArchive.updateMany({
        where: { studentId: { in: ids }, schoolId, restoredAt: null },
        data: { restoredAt: new Date(), restoredBy: userId },
      });
    });
  }

  async softDelete(id: string, schoolId: string, userId?: string) {
    return prisma.student.update({
      where: { id, schoolId },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
        status: 'withdrawn',
        version: { increment: 1 },
      },
      include: {
        class: true,
        section: true,
        campus: true,
        academicYear: true,
        category: true,
        house: true,
        guardians: { include: { parent: true } },
        addresses: true,
        medical: true,
        documents: true,
      },
    }) as any;
  }
}
