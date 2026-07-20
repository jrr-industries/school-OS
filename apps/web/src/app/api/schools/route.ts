import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createSchoolSchema } from '@/lib/validators';

export const GET = createListHandler({
  model: prisma.school,
  modelName: 'School',
  searchFields: ['name', 'code', 'city', 'state'],
});

export const POST = createPostHandler(
  {
    model: prisma.school,
    modelName: 'School',
    searchFields: [],
  },
  createSchoolSchema,
);
