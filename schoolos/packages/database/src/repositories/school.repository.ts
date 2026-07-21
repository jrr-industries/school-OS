import type { Prisma } from '@prisma/client';
import { prisma } from '../client';
import { BaseRepository } from './base.repository';

type School = Prisma.SchoolGetPayload<{}>;
type CreateSchoolInput = Prisma.SchoolUncheckedCreateInput;
type UpdateSchoolInput = Prisma.SchoolUncheckedUpdateInput;

export class SchoolRepository extends BaseRepository<School, CreateSchoolInput, UpdateSchoolInput> {
  protected modelName = 'school';

  async findBySlug(slug: string): Promise<School | null> {
    return prisma.school.findUnique({
      where: { slug, deletedAt: null },
    });
  }

  async findByDomain(domain: string): Promise<School | null> {
    return prisma.school.findUnique({
      where: { domain, deletedAt: null },
    });
  }

  async updateStatus(id: string, status: School['status']): Promise<School> {
    return prisma.school.update({
      where: { id },
      data: { status, version: { increment: 1 } },
    });
  }
}
