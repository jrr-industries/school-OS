import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateAcademicYearSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.academicYear,
  modelName: 'AcademicYear',
  searchFields: [],
});

export const PUT = createPutHandler(
  { model: prisma.academicYear, modelName: 'AcademicYear', searchFields: [] },
  updateAcademicYearSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.academicYear,
  modelName: 'AcademicYear',
  searchFields: [],
});
