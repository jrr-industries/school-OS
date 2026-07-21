import type { Prisma } from '@prisma/client';
import { prisma } from '../client';
import { BaseRepository } from './base.repository';

type AcademicYear = Prisma.AcademicYearGetPayload<{ include: { terms: true } }>;
type AcademicTerm = Prisma.AcademicTermGetPayload<{}>;
type Campus = Prisma.CampusGetPayload<{}>;
type Building = Prisma.BuildingGetPayload<{}>;
type Room = Prisma.RoomGetPayload<{}>;
type Department = Prisma.DepartmentGetPayload<{}>;
type SubjectGroup = Prisma.SubjectGroupGetPayload<{}>;
type Subject = Prisma.SubjectGetPayload<{}>;
type StudentClass = Prisma.StudentClassGetPayload<{ include: { sections: true } }>;
type Section = Prisma.SectionGetPayload<{}>;
type StudentCategory = Prisma.StudentCategoryGetPayload<{}>;
type StudentHouse = Prisma.StudentHouseGetPayload<{}>;
type AdmissionSource = Prisma.AdmissionSourceGetPayload<{}>;

export class AcademicYearRepository extends BaseRepository<AcademicYear, Prisma.AcademicYearUncheckedCreateInput, Prisma.AcademicYearUncheckedUpdateInput> {
  protected modelName = 'academicYear';

  async findCurrent(schoolId: string) {
    return prisma.academicYear.findFirst({
      where: { schoolId, isCurrent: true, deletedAt: null },
      include: { terms: true },
    });
  }

  async setCurrent(id: string, schoolId: string) {
    return prisma.$transaction(async (tx: any) => {
      await tx.academicYear.updateMany({
        where: { schoolId, isCurrent: true },
        data: { isCurrent: false },
      });
      return tx.academicYear.update({
        where: { id },
        data: { isCurrent: true },
      });
    });
  }
}

export class AcademicTermRepository extends BaseRepository<AcademicTerm, Prisma.AcademicTermUncheckedCreateInput, Prisma.AcademicTermUncheckedUpdateInput> {
  protected modelName = 'academicTerm';

  async findByAcademicYear(academicYearId: string) {
    return prisma.academicTerm.findMany({
      where: { academicYearId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }
}

export class CampusRepository extends BaseRepository<Campus, Prisma.CampusUncheckedCreateInput, Prisma.CampusUncheckedUpdateInput> {
  protected modelName = 'campus';

  async findMain(schoolId: string) {
    return prisma.campus.findFirst({
      where: { schoolId, isMain: true, deletedAt: null },
    });
  }
}

export class BuildingRepository extends BaseRepository<Building, Prisma.BuildingUncheckedCreateInput, Prisma.BuildingUncheckedUpdateInput> {
  protected modelName = 'building';
}

export class RoomRepository extends BaseRepository<Room, Prisma.RoomUncheckedCreateInput, Prisma.RoomUncheckedUpdateInput> {
  protected modelName = 'room';
}

export class DepartmentRepository extends BaseRepository<Department, Prisma.DepartmentUncheckedCreateInput, Prisma.DepartmentUncheckedUpdateInput> {
  protected modelName = 'department';
}

export class SubjectGroupRepository extends BaseRepository<SubjectGroup, Prisma.SubjectGroupUncheckedCreateInput, Prisma.SubjectGroupUncheckedUpdateInput> {
  protected modelName = 'subjectGroup';
}

export class SubjectRepository extends BaseRepository<Subject, Prisma.SubjectUncheckedCreateInput, Prisma.SubjectUncheckedUpdateInput> {
  protected modelName = 'subject';

  async findByDepartment(departmentId: string) {
    return prisma.subject.findMany({
      where: { departmentId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByGroup(groupId: string) {
    return prisma.subject.findMany({
      where: { groupId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }
}

export class StudentClassRepository extends BaseRepository<StudentClass, Prisma.StudentClassUncheckedCreateInput, Prisma.StudentClassUncheckedUpdateInput> {
  protected modelName = 'studentClass';

  async findByAcademicYear(academicYearId: string) {
    return prisma.studentClass.findMany({
      where: { academicYearId, deletedAt: null },
      include: { sections: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByIdWithSections(id: string) {
    return prisma.studentClass.findUnique({
      where: { id },
      include: { sections: true },
    });
  }
}

export class SectionRepository extends BaseRepository<Section, Prisma.SectionUncheckedCreateInput, Prisma.SectionUncheckedUpdateInput> {
  protected modelName = 'section';

  async findByClass(classId: string) {
    return prisma.section.findMany({
      where: { classId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }
}

export class StudentCategoryRepository extends BaseRepository<StudentCategory, Prisma.StudentCategoryUncheckedCreateInput, Prisma.StudentCategoryUncheckedUpdateInput> {
  protected modelName = 'studentCategory';
}

export class StudentHouseRepository extends BaseRepository<StudentHouse, Prisma.StudentHouseUncheckedCreateInput, Prisma.StudentHouseUncheckedUpdateInput> {
  protected modelName = 'studentHouse';
}

export class AdmissionSourceRepository extends BaseRepository<AdmissionSource, Prisma.AdmissionSourceUncheckedCreateInput, Prisma.AdmissionSourceUncheckedUpdateInput> {
  protected modelName = 'admissionSource';
}
