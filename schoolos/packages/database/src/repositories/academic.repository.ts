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

export class AcademicYearRepository extends BaseRepository<AcademicYear, Prisma.AcademicYearCreateInput, Prisma.AcademicYearUpdateInput> {
  protected modelName = 'academicYear';

  async findCurrent(schoolId: string) {
    return prisma.academicYear.findFirst({
      where: { schoolId, isCurrent: true, deletedAt: null },
      include: { terms: true },
    });
  }

  async setCurrent(id: string, schoolId: string) {
    return prisma.$transaction(async (tx) => {
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

export class AcademicTermRepository extends BaseRepository<AcademicTerm, Prisma.AcademicTermCreateInput, Prisma.AcademicTermUpdateInput> {
  protected modelName = 'academicTerm';

  async findByAcademicYear(academicYearId: string) {
    return prisma.academicTerm.findMany({
      where: { academicYearId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }
}

export class CampusRepository extends BaseRepository<Campus, Prisma.CampusCreateInput, Prisma.CampusUpdateInput> {
  protected modelName = 'campus';

  async findMain(schoolId: string) {
    return prisma.campus.findFirst({
      where: { schoolId, isMain: true, deletedAt: null },
    });
  }
}

export class BuildingRepository extends BaseRepository<Building, Prisma.BuildingCreateInput, Prisma.BuildingUpdateInput> {
  protected modelName = 'building';
}

export class RoomRepository extends BaseRepository<Room, Prisma.RoomCreateInput, Prisma.RoomUpdateInput> {
  protected modelName = 'room';
}

export class DepartmentRepository extends BaseRepository<Department, Prisma.DepartmentCreateInput, Prisma.DepartmentUpdateInput> {
  protected modelName = 'department';
}

export class SubjectGroupRepository extends BaseRepository<SubjectGroup, Prisma.SubjectGroupCreateInput, Prisma.SubjectGroupUpdateInput> {
  protected modelName = 'subjectGroup';
}

export class SubjectRepository extends BaseRepository<Subject, Prisma.SubjectCreateInput, Prisma.SubjectUpdateInput> {
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

export class StudentClassRepository extends BaseRepository<StudentClass, Prisma.StudentClassCreateInput, Prisma.StudentClassUpdateInput> {
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

export class SectionRepository extends BaseRepository<Section, Prisma.SectionCreateInput, Prisma.SectionUpdateInput> {
  protected modelName = 'section';

  async findByClass(classId: string) {
    return prisma.section.findMany({
      where: { classId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }
}

export class StudentCategoryRepository extends BaseRepository<StudentCategory, Prisma.StudentCategoryCreateInput, Prisma.StudentCategoryUpdateInput> {
  protected modelName = 'studentCategory';
}

export class StudentHouseRepository extends BaseRepository<StudentHouse, Prisma.StudentHouseCreateInput, Prisma.StudentHouseUpdateInput> {
  protected modelName = 'studentHouse';
}

export class AdmissionSourceRepository extends BaseRepository<AdmissionSource, Prisma.AdmissionSourceCreateInput, Prisma.AdmissionSourceUpdateInput> {
  protected modelName = 'admissionSource';
}
