import { prisma } from '@/lib/prisma/client';
import { createGetByIdHandler, createPutHandler, createDeleteHandler } from '@/lib/api/crud-handler';
import { updateCalendarEventSchema } from '@/lib/validators';

export const GET = createGetByIdHandler({
  model: prisma.calendarEvent,
  modelName: 'CalendarEvent',
  searchFields: [],
});

export const PUT = createPutHandler(
  { model: prisma.calendarEvent, modelName: 'CalendarEvent', searchFields: [] },
  updateCalendarEventSchema,
);

export const DELETE = createDeleteHandler({
  model: prisma.calendarEvent,
  modelName: 'CalendarEvent',
  searchFields: [],
});
