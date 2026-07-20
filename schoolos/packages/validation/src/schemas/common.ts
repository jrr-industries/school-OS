import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
});

export const uuidSchema = z.string().uuid('Invalid UUID');

export const idSchema = z.object({
  id: uuidSchema,
});

export const idsSchema = z.object({
  ids: z.array(uuidSchema).min(1, 'At least one ID is required'),
});

export const schoolIdSchema = z.object({
  schoolId: uuidSchema,
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
