import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateTaskSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.task,
  modelName: 'Task',
  searchFields: [],
});

export const PUT = createPutHandler(
  { model: prisma.task, modelName: 'Task', searchFields: [] },
  updateTaskSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.task,
  modelName: 'Task',
  searchFields: [],
});
