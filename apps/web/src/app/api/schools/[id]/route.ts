import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateSchoolSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.school,
  modelName: 'School',
  searchFields: [],
  include: { branches: { where: { deletedAt: null }, take: 50 } },
});

export const PUT = createPutHandler(
  { model: prisma.school, modelName: 'School', searchFields: [] },
  updateSchoolSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.school,
  modelName: 'School',
  searchFields: [],
});
