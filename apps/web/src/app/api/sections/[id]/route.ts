import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateSectionSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.section,
  modelName: 'Section',
  searchFields: [],
  include: { class: { include: { school: true } } },
});

export const PUT = createPutHandler(
  { model: prisma.section, modelName: 'Section', searchFields: [] },
  updateSectionSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.section,
  modelName: 'Section',
  searchFields: [],
});
