import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createClassSchema } from '@/lib/validators';

export const GET = createListHandler({
  model: prisma.class,
  modelName: 'Class',
  searchFields: ['name'],
});

export const POST = createPostHandler(
  {
    model: prisma.class,
    modelName: 'Class',
    searchFields: [],
  },
  createClassSchema,
);
