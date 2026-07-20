import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createTaskSchema } from '@/lib/validators';

const baseHandler = createListHandler({
  model: prisma.task,
  modelName: 'Task',
  searchFields: ['title', 'description'],
});

/** Extended GET with priority and assignedTo filters */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const { parseSearchParams, successResponse, errorResponse } = await import('@/lib/api-utils');
  const params = parseSearchParams(url.searchParams);

  const where: Record<string, unknown> = { deletedAt: null };
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' as const } },
      { description: { contains: params.search, mode: 'insensitive' as const } },
    ];
  }
  if (params.status) where.status = params.status;
  if (params.schoolId) where.schoolId = params.schoolId;
  if (params.branchId) where.branchId = params.branchId;

  // Priority filter
  const priority = url.searchParams.get('priority');
  if (priority) where.priority = priority;

  // AssignedTo filter
  const assignedTo = url.searchParams.get('assignedTo');
  if (assignedTo) where.assignedTo = { contains: assignedTo, mode: 'insensitive' as const };

  try {
    const [total, items] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip: params.skip,
        take: params.pageSize,
        orderBy: [
          { priority: 'desc' as const },
          { dueDate: 'asc' as const },
        ],
      }),
    ]);

    return successResponse(items, {
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    });
  } catch (error) {
    console.error('Error listing Tasks:', error);
    return errorResponse('Failed to fetch tasks', 500);
  }
}

export const POST = createPostHandler(
  {
    model: prisma.task,
    modelName: 'Task',
    searchFields: [],
  },
  createTaskSchema,
);
