import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateBranchSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.branch,
  modelName: 'Branch',
  searchFields: [],
  include: { school: true },
});

export const PUT = createPutHandler(
  { model: prisma.branch, modelName: 'Branch', searchFields: [] },
  updateBranchSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.branch,
  modelName: 'Branch',
  searchFields: [],
});
