import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createAnnouncementSchema } from '@/lib/validators';

const baseHandler = createListHandler({
  model: prisma.announcement,
  modelName: 'Announcement',
  searchFields: ['title', 'description'],
});

/** Extended GET with priority filter */
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

  // Audience filter
  const audience = url.searchParams.get('audience');
  if (audience) where.audience = audience;

  try {
    const [total, items] = await Promise.all([
      prisma.announcement.count({ where }),
      prisma.announcement.findMany({
        where,
        skip: params.skip,
        take: params.pageSize,
        orderBy: { publishDate: 'desc' as const },
      }),
    ]);

    return successResponse(items, {
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    });
  } catch (error) {
    console.error('Error listing Announcements:', error);
    return errorResponse('Failed to fetch announcements', 500);
  }
}

export const POST = createPostHandler(
  {
    model: prisma.announcement,
    modelName: 'Announcement',
    searchFields: [],
  },
  createAnnouncementSchema,
);
