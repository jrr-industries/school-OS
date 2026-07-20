import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createSectionSchema } from '@/lib/validators';

export const GET = createListHandler({
  model: prisma.section,
  modelName: 'Section',
  searchFields: ['name'],
  filters: {},
});

export const POST = createPostHandler(
  {
    model: prisma.section,
    modelName: 'Section',
    searchFields: [],
  },
  createSectionSchema,
);
