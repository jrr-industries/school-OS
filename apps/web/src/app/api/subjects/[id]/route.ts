import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateSubjectSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.subject,
  modelName: 'Subject',
  searchFields: [],
});

export const PUT = createPutHandler(
  { model: prisma.subject, modelName: 'Subject', searchFields: [] },
  updateSubjectSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.subject,
  modelName: 'Subject',
  searchFields: [],
});
