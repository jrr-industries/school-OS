import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createSubjectSchema } from '@/lib/validators';

export const GET = createListHandler({
  model: prisma.subject,
  modelName: 'Subject',
  searchFields: ['name', 'code', 'shortName'],
});

export const POST = createPostHandler(
  {
    model: prisma.subject,
    modelName: 'Subject',
    searchFields: [],
  },
  createSubjectSchema,
);
