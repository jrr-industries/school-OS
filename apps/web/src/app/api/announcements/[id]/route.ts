import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateAnnouncementSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.announcement,
  modelName: 'Announcement',
  searchFields: [],
});

export const PUT = createPutHandler(
  { model: prisma.announcement, modelName: 'Announcement', searchFields: [] },
  updateAnnouncementSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.announcement,
  modelName: 'Announcement',
  searchFields: [],
});
