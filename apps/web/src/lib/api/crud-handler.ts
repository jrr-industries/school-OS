/**
 * CRUD Route Handler Factory
 *
 * Generates standard CRUD route handlers for Next.js App Router.
 * Each module exports GET (list), POST (create), PUT (update), DELETE (soft delete).
 */
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma/client';
import { Prisma } from '@/generated/prisma';
import { successResponse, errorResponse, parseSearchParams } from '@/lib/api-utils';
import { withAudit } from '@/lib/audit/audit-service';

type PrismaModel = {
  count: (args: unknown) => Promise<number>;
  findMany: (args: unknown) => Promise<unknown[]>;
  findUnique: (args: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
};

type CrudConfig = {
  model: PrismaModel;
  modelName: string;
  searchFields: string[];
  filters?: Record<string, string>;
  include?: Record<string, unknown>;
};

/** Build WHERE clause for search + filters */
function buildWhere(
  params: ReturnType<typeof parseSearchParams>,
  config: CrudConfig,
): Record<string, unknown> {
  const where: Record<string, unknown> = { deletedAt: null };

  // Search across specified fields
  if (params.search) {
    const search = params.search;
    where.OR = config.searchFields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' as const },
    }));
  }

  // Status filter
  if (params.status) {
    where.status = params.status;
  }

  // Foreign key filters
  if (params.schoolId) where.schoolId = params.schoolId;
  if (params.branchId) where.branchId = params.branchId;

  // Additional custom filters
  if (config.filters) {
    for (const [key, value] of Object.entries(config.filters)) {
      if (value) where[key] = value;
    }
  }

  return where;
}

/** GET — List with search, filter, sort, pagination */
export function createListHandler(config: CrudConfig) {
  return async function GET(request: NextRequest) {
    try {
      const params = parseSearchParams(request.nextUrl.searchParams);
      const where = buildWhere(params, config);

      const [total, items] = await Promise.all([
        (config.model.count as (args: { where: Record<string, unknown> }) => Promise<number>)({ where }),
        (config.model.findMany as (args: {
          where: Record<string, unknown>;
          skip: number;
          take: number;
          orderBy: Record<string, string>;
          include?: Record<string, unknown>;
        }) => Promise<unknown[]>)({
          where,
          skip: params.skip,
          take: params.pageSize,
          orderBy: { [params.sortBy]: params.sortOrder },
          ...(config.include ? { include: config.include } : {}),
        }),
      ]);

      return successResponse(items, {
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
      });
    } catch (error) {
      console.error(`Error listing ${config.modelName}s:`, error);
      return errorResponse(`Failed to fetch ${config.modelName}s`, 500);
    }
  };
}

/** POST — Create */
export function createPostHandler(config: CrudConfig, schema: z.ZodObject<any>) {
  return async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const validated = schema.parse(body);

      const item = await withAudit('CREATE', config.modelName, async () => {
        const created = await (config.model.create as (args: { data: unknown }) => Promise<{ id: string }>)({
          data: validated,
        });
        return { id: created.id, data: created };
      });

      return successResponse(item, undefined);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return errorResponse('Validation failed', 400, error.errors);
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return errorResponse('A record with this information already exists', 409);
        }
      }
      console.error(`Error creating ${config.modelName}:`, error);
      return errorResponse(`Failed to create ${config.modelName}`, 500);
    }
  };
}

/** GET — Single item by ID */
export function createGetByIdHandler(config: CrudConfig) {
  return async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const { id } = await params;
      const item = await (config.model.findUnique as (args: { where: { id: string }; include?: Record<string, unknown> }) => Promise<unknown>)({
        where: { id },
        ...(config.include ? { include: config.include } : {}),
      });
      if (!item || (item as Record<string, unknown>).deletedAt) {
        return errorResponse('Not found', 404);
      }
      return successResponse(item);
    } catch (error) {
      console.error(`Error fetching ${config.modelName}:`, error);
      return errorResponse(`Failed to fetch ${config.modelName}`, 500);
    }
  };
}

/** PUT — Update by ID */
export function createPutHandler(config: CrudConfig, schema: z.ZodObject<any>) {
  return async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const { id } = await params;
      const body = await request.json();
      const validated = schema.parse(body);

      const existing = await (config.model.findUnique as (args: { where: { id: string } }) => Promise<Record<string, unknown> | null>)({ where: { id } });
      if (!existing || existing.deletedAt) {
        return errorResponse('Not found', 404);
      }

      const item = await withAudit('UPDATE', config.modelName, async () => {
        const updated = await (config.model.update as (args: { where: { id: string }; data: unknown }) => Promise<{ id: string }>)({
          where: { id },
          data: validated,
        });
        return { id: updated.id, data: updated };
      });

      return successResponse(item);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return errorResponse('Validation failed', 400, error.errors);
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return errorResponse('A record with this information already exists', 409);
        }
      }
      console.error(`Error updating ${config.modelName}:`, error);
      return errorResponse(`Failed to update ${config.modelName}`, 500);
    }
  };
}

/** DELETE — Soft delete by ID */
export function createDeleteHandler(config: CrudConfig) {
  return async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    try {
      const { id } = await params;
      const existing = await (config.model.findUnique as (args: { where: { id: string } }) => Promise<Record<string, unknown> | null>)({ where: { id } });
      if (!existing || existing.deletedAt) {
        return errorResponse('Not found', 404);
      }

      await withAudit('DELETE', config.modelName, async () => {
        await (config.model.update as (args: { where: { id: string }; data: { deletedAt: Date } }) => Promise<unknown>)({
          where: { id },
          data: { deletedAt: new Date() },
        });
        return { id };
      });

      return successResponse({ id, deleted: true });
    } catch (error) {
      console.error(`Error deleting ${config.modelName}:`, error);
      return errorResponse(`Failed to delete ${config.modelName}`, 500);
    }
  };
}
