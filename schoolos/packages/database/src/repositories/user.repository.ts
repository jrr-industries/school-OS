import type { Prisma } from '@prisma/client';
import { prisma } from '../client';
import { BaseRepository } from './base.repository';

type User = Prisma.UserGetPayload<{ include: { profile: true; userRoles: { include: { role: true } } } }>;
type CreateUserInput = Prisma.UserUncheckedCreateInput;
type UpdateUserInput = Prisma.UserUncheckedUpdateInput;

export class UserRepository extends BaseRepository<User, CreateUserInput, UpdateUserInput> {
  protected modelName = 'user';

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        userRoles: { include: { role: true } },
      },
    });
  }

  async findByIdWithRelations(id: string, schoolId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        profile: true,
        userRoles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    }) as unknown as Promise<User>;
  }
}
