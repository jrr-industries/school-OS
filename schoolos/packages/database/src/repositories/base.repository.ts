import type { PrismaClient } from '@prisma/client';
import { prisma } from '../client';
import type { PrismaTransaction } from '../types';

export interface FindAllParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected abstract modelName: string;

  constructor(protected readonly tx?: PrismaTransaction) {}

  protected get client(): PrismaClient | PrismaTransaction {
    return this.tx ?? prisma;
  }

  protected get model(): any {
    const client = this.client as PrismaClient;
    return (client as any)[this.modelName];
  }

  async findById(id: string, schoolId: string): Promise<T | null> {
    return this.model.findFirst({
      where: { id, schoolId, deletedAt: null },
    }) as Promise<T | null>;
  }

  async findAll(
    schoolId: string,
    params: FindAllParams = {},
  ): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      filters = {},
    } = params;

    const where: Record<string, unknown> = {
      schoolId,
      deletedAt: null,
      ...filters,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as T[],
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

  async create(data: CreateInput & { schoolId: string; createdBy?: string }): Promise<T> {
    return this.model.create({
      data: {
        ...data,
        version: 1,
      },
    }) as Promise<T>;
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateInput & { updatedBy?: string },
  ): Promise<T> {
    return this.model.update({
      where: { id, schoolId },
      data: {
        ...data,
        version: { increment: 1 },
      },
    }) as Promise<T>;
  }

  async softDelete(id: string, schoolId: string, userId?: string): Promise<T> {
    return this.model.update({
      where: { id, schoolId },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
        version: { increment: 1 },
      },
    }) as Promise<T>;
  }

  async hardDelete(id: string, schoolId: string): Promise<T> {
    return this.model.delete({
      where: { id, schoolId },
    }) as Promise<T>;
  }

  async count(schoolId: string, filters: Record<string, unknown> = {}): Promise<number> {
    return this.model.count({
      where: { schoolId, deletedAt: null, ...filters },
    }) as Promise<number>;
  }
}
