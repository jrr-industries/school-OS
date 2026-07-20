import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { successResponse, errorResponse, parseSearchParams } from '@/lib/api-utils';
import { createAnnouncementSchema } from '@/lib/validators';
import { withAudit } from '@/lib/audit/audit-service';
import { z } from 'zod';

const modelName = 'Announcement';
const modelKey = 'announcement';

export async function GET(request: NextRequest) {
  try {
    const params = parseSearchParams(request.nextUrl.searchParams);
    const where: Record<string, unknown> = { deletedAt: null };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    if (params.schoolId) where.schoolId = params.schoolId;
    if (params.branchId) where.branchId = params.branchId;

    const [total, items] = await Promise.all([
      prisma.announcement.count({ where }),
      prisma.announcement.findMany({
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
    console.error(`Error fetching ${modelKey}s:`, error);
    return errorResponse('Failed to fetch items', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createAnnouncementSchema.parse(body);

    const item = await withAudit('CREATE', modelName, async () => {
      const created = await prisma.announcement.create({ data: validated });
      return { id: created.id, data: created };
    });

    return successResponse(item, undefined);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return errorResponse('Validation failed', 400, error.errors);
    }
    if ((error as any)?.code === 'P2002') {
      return errorResponse('A record with this information already exists', 409);
    }
    console.error(`Error creating ${modelKey}:`, error);
    return errorResponse('Failed to create item', 500);
  }
}
