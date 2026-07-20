import type { Prisma } from '@prisma/client';
import { prisma } from '../client';
import { BaseRepository } from './base.repository';

type Permission = Prisma.PermissionGetPayload<{}>;
type CreatePermissionInput = Prisma.PermissionCreateInput;
type UpdatePermissionInput = Prisma.PermissionUpdateInput;

export class PermissionRepository extends BaseRepository<Permission, CreatePermissionInput, UpdatePermissionInput> {
  protected modelName = 'permission';

  async findBySlug(slug: string): Promise<Permission | null> {
    return prisma.permission.findUnique({
      where: { slug },
    });
  }

  async findByGroup(group: string): Promise<Permission[]> {
    return prisma.permission.findMany({
      where: { group, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findByRoleId(roleId: string): Promise<Permission[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
    return rolePermissions.map((rp) => rp.permission);
  }
}
