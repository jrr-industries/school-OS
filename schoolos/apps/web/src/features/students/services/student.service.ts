import { prisma, StudentRepository, ParentRepository, AcademicYearRepository } from '@schoolos/database';
import { Logger, IdUtils } from '@schoolos/utils';
import type { CreateStudentInput, UpdateStudentInput, PromoteStudentInput, TransferStudentInput, ArchiveStudentInput } from '@schoolos/validation';
import { ApiError } from '@schoolos/api';

export class StudentService {
  private readonly studentRepo: StudentRepository;
  private readonly parentRepo: ParentRepository;

  constructor() {
    this.studentRepo = new StudentRepository();
    this.parentRepo = new ParentRepository();
  }

  async create(data: CreateStudentInput, schoolId: string, userId: string) {
    const existing = await this.studentRepo.findByAdmissionNumber(data.admissionNumber, schoolId);
    if (existing) {
      throw ApiError.conflict(`Admission number ${data.admissionNumber} already exists`);
    }

    const student = await prisma.student.create({
      data: {
        ...data,
        schoolId,
        createdBy: userId,
        dateOfBirth: new Date(data.dateOfBirth),
        admissionDate: new Date(data.admissionDate),
      },
    });

    Logger.info('StudentService', `Student ${student.admissionNumber} created`, { schoolId });

    return student;
  }

  async update(id: string, data: UpdateStudentInput, schoolId: string, userId: string) {
    const student = await this.studentRepo.findById(id, schoolId);
    if (!student) throw ApiError.notFound('Student not found');

    const updateData: Record<string, unknown> = { ...data, updatedBy: userId };
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.admissionDate) updateData.admissionDate = new Date(data.admissionDate);

    return prisma.student.update({
      where: { id },
      data: updateData,
    });
  }

  async findById(id: string, schoolId: string) {
    const student = await this.studentRepo.findByIdWithDetails(id, schoolId);
    if (!student) throw ApiError.notFound('Student not found');
    return student;
  }

  async findAll(schoolId: string, params: Record<string, unknown>) {
    return this.studentRepo.findAll(schoolId, params);
  }

  async promote(data: PromoteStudentInput, schoolId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      for (const studentId of data.studentIds) {
        await tx.student.update({
          where: { id: studentId, schoolId },
          data: {
            classId: data.toClassId,
            sectionId: data.toSectionId,
            updatedBy: userId,
            version: { increment: 1 },
          },
        });

        await tx.studentPromotion.create({
          data: {
            studentId,
            schoolId,
            fromClassId: data.fromClassId,
            toClassId: data.toClassId,
            fromSectionId: data.fromSectionId,
            toSectionId: data.toSectionId,
            academicYearId: data.academicYearId,
            status: data.status,
            remarks: data.remarks,
            createdBy: userId,
          },
        });
      }

      return { promoted: data.studentIds.length };
    });
  }

  async transfer(data: TransferStudentInput, schoolId: string, userId: string) {
    const student = await this.studentRepo.findById(data.studentId, schoolId);
    if (!student) throw ApiError.notFound('Student not found');

    return prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: { id: data.studentId },
        data: {
          status: 'transferred',
          leavingDate: new Date(data.transferDate),
          leavingReason: data.reason,
          updatedBy: userId,
          version: { increment: 1 },
        },
      });

      const transfer = await tx.studentTransfer.create({
        data: {
          studentId: data.studentId,
          schoolId,
          fromSchoolId: schoolId,
          toSchoolName: data.toSchoolName,
          toSchoolAddress: data.toSchoolAddress,
          reason: data.reason,
          transferDate: new Date(data.transferDate),
          remarks: data.remarks,
          createdBy: userId,
        },
      });

      return transfer;
    });
  }

  async archive(data: ArchiveStudentInput, schoolId: string, userId: string) {
    await this.studentRepo.bulkArchive(data.studentIds, schoolId, data.reason, userId);
    return { archived: data.studentIds.length };
  }

  async restore(studentIds: string[], schoolId: string, userId: string) {
    await this.studentRepo.bulkRestore(studentIds, schoolId, userId);
    return { restored: studentIds.length };
  }

  async softDelete(id: string, schoolId: string, userId: string) {
    return this.studentRepo.softDelete(id, schoolId, userId);
  }

  async getStats(schoolId: string) {
    return this.studentRepo.getStudentStats(schoolId);
  }

  async promoteWithAcademicYear(schoolId: string, userId: string) {
    const currentYear = await new AcademicYearRepository().findCurrent(schoolId);
    if (!currentYear) throw ApiError.notFound('No current academic year found');

    const nextYear = await prisma.academicYear.findFirst({
      where: { schoolId, startDate: { gt: currentYear.startDate }, deletedAt: null },
      orderBy: { startDate: 'asc' },
    });
    if (!nextYear) throw ApiError.notFound('No next academic year found');

    const students = await prisma.student.findMany({
      where: { schoolId, academicYearId: currentYear.id, deletedAt: null, status: 'active' },
      include: { class: true },
    });

    for (const student of students) {
      const nextClass = await prisma.studentClass.findFirst({
        where: { academicYearId: nextYear.id, schoolId, sortOrder: (student.class?.sortOrder ?? 0) + 1 },
      });
      if (!nextClass) continue;

      await this.promote(
        {
          studentIds: [student.id],
          fromClassId: student.classId!,
          toClassId: nextClass.id,
          fromSectionId: student.sectionId ?? undefined,
          toSectionId: undefined,
          academicYearId: nextYear.id,
          status: 'promoted',
          remarks: 'Auto-promoted to next academic year',
        },
        schoolId,
        userId,
      );
    }

    return { promoted: students.length };
  }
}
