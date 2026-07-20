import type { Prisma } from '@prisma/client';
import { prisma } from '../client';
import { BaseRepository } from './base.repository';

type Parent = Prisma.ParentGetPayload<{ include: { children: { include: { student: true } } } }>;
type CreateParentInput = Prisma.ParentCreateInput;
type UpdateParentInput = Prisma.ParentUpdateInput;

export class ParentRepository extends BaseRepository<Parent, CreateParentInput, UpdateParentInput> {
  protected modelName = 'parent';

  async findByEmail(email: string, schoolId: string) {
    return prisma.parent.findFirst({
      where: { email, schoolId, deletedAt: null },
      include: { children: { include: { student: true } } },
    });
  }

  async findByPhone(phone: string, schoolId: string) {
    return prisma.parent.findFirst({
      where: { phone, schoolId, deletedAt: null },
      include: { children: { include: { student: true } } },
    });
  }

  async findByStudent(studentId: string) {
    return prisma.parent.findMany({
      where: {
        children: { some: { studentId } },
        deletedAt: null,
      },
      include: { children: { include: { student: true } } },
    });
  }

  async linkParentToStudent(parentId: string, studentId: string, schoolId: string) {
    return prisma.parentStudent.create({
      data: { parentId, studentId, schoolId },
    });
  }

  async unlinkParentFromStudent(parentId: string, studentId: string) {
    return prisma.parentStudent.deleteMany({
      where: { parentId, studentId },
    });
  }
}
