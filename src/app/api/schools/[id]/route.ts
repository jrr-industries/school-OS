import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { updateSchoolSchema } from '@/lib/validators';
import { withAudit } from '@/lib/audit/audit-service';
import { z } from 'zod';

const modelName = 'School';
const modelKey = 'school';
const prismaModel = prisma.school;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const item = await prismaModel.findUnique({ where: { id } });
    if (!item || item.deletedAt) {
      return errorResponse('Not found', 404);
    }
    return successResponse(item);
  } catch (error) {
    console.error(`Error fetching ${modelKey}:`, error);
    return errorResponse('Failed to fetch item', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateSchoolSchema.parse(body);

    const existing = await prismaModel.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return errorResponse('Not found', 404);
    }

    const item = await withAudit('UPDATE', modelName, async () => {
      const updated = await prismaModel.update({
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
    if ((error as any)?.code === 'P2002') {
      return errorResponse('A record with this information already exists', 409);
    }
    console.error(`Error updating ${modelKey}:`, error);
    return errorResponse('Failed to update item', 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const existing = await prismaModel.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return errorResponse('Not found', 404);
    }

    await withAudit('DELETE', modelName, async () => {
      await prismaModel.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return { id };
    });

    return successResponse({ id, deleted: true });
  } catch (error) {
    console.error(`Error deleting ${modelKey}:`, error);
    return errorResponse('Failed to delete item', 500);
  }
}
