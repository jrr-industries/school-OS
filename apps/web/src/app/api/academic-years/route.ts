import { prisma } from '@/lib/prisma/client';
import { createListHandler, createPostHandler } from '@/lib/api/crud-handler';
import { createAcademicYearSchema } from '@/lib/validators';

export const GET = createListHandler({
  model: prisma.academicYear,
  modelName: 'AcademicYear',
  searchFields: ['name'],
  filters: {},
});

export const POST = createPostHandler(
  {
    model: prisma.academicYear,
    modelName: 'AcademicYear',
    searchFields: [],
  },
  createAcademicYearSchema,
);
