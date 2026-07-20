import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createCalendarEventSchema } from '@/lib/validators';
import { parseSearchParams } from '@/lib/api-utils';

const baseHandler = createListHandler({
  model: prisma.calendarEvent,
  modelName: 'CalendarEvent',
  searchFields: ['title', 'description'],
});

/** Extended GET with eventType filter */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = parseSearchParams(url.searchParams);

  // Add eventType and date range filters
  const where: Record<string, unknown> = { deletedAt: null };
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' as const } },
      { description: { contains: params.search, mode: 'insensitive' as const } },
    ];
  }
  if (params.status) where.eventType = params.status; // reuse status param for eventType
  if (params.schoolId) where.schoolId = params.schoolId;
  if (params.branchId) where.branchId = params.branchId;

  // Date range filter
  const fromDate = url.searchParams.get('fromDate');
  const toDate = url.searchParams.get('toDate');
  if (fromDate || toDate) {
    where.eventDate = {};
    if (fromDate) (where.eventDate as Record<string, unknown>).gte = new Date(fromDate);
    if (toDate) (where.eventDate as Record<string, unknown>).lte = new Date(toDate);
  }

  try {
    const { prisma } = await import('@/lib/prisma/client');
    const { successResponse, errorResponse } = await import('@/lib/api-utils');

    const [total, items] = await Promise.all([
      prisma.calendarEvent.count({ where }),
      prisma.calendarEvent.findMany({
        where,
        skip: params.skip,
        take: params.pageSize,
        orderBy: { [params.sortBy]: params.sortOrder },
      }),
    ]);

    return successResponse(items, {
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    });
  } catch (error) {
    console.error('Error listing CalendarEvents:', error);
    const { errorResponse } = await import('@/lib/api-utils');
    return errorResponse('Failed to fetch calendar events', 500);
  }
}

export const POST = createPostHandler(
  {
    model: prisma.calendarEvent,
    modelName: 'CalendarEvent',
    searchFields: [],
  },
  createCalendarEventSchema,
);
