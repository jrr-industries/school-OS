import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateClassSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.class,
  modelName: 'Class',
  searchFields: [],
  include: { sections: { where: { deletedAt: null }, orderBy: { name: 'asc' as const } } },
});

export const PUT = createPutHandler(
  { model: prisma.class, modelName: 'Class', searchFields: [] },
  updateClassSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.class,
  modelName: 'Class',
  searchFields: [],
});
