import type { Prisma } from '@prisma/client';
import { prisma } from '../client';
import { BaseRepository } from './base.repository';

type Role = Prisma.RoleGetPayload<{ include: { permissions: { include: { permission: true } } } }>;
type CreateRoleInput = Prisma.RoleCreateInput;
type UpdateRoleInput = Prisma.RoleUpdateInput;

export class RoleRepository extends BaseRepository<Role, CreateRoleInput, UpdateRoleInput> {
  protected modelName = 'role';

  async findBySlug(slug: string, schoolId: string): Promise<Role | null> {
    return prisma.role.findUnique({
      where: { schoolId_slug: { schoolId, slug } },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async findAllWithPermissions(schoolId: string): Promise<Role[]> {
    return prisma.role.findMany({
      where: { schoolId, deletedAt: null },
      include: { permissions: { include: { permission: true } } },
      orderBy: { sortOrder: 'asc' },
    }) as Promise<Role[]>;
  }
}
