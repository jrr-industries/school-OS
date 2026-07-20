import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createBranchSchema } from '@/lib/validators';

export const GET = createListHandler({
  model: prisma.branch,
  modelName: 'Branch',
  searchFields: ['name', 'code'],
});

export const POST = createPostHandler(
  {
    model: prisma.branch,
    modelName: 'Branch',
    searchFields: [],
  },
  createBranchSchema,
);
