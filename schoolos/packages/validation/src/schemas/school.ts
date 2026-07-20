import { z } from 'zod';

export const createSchoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters').max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  domain: z.string().optional(),
  type: z.enum([
    'primary',
    'secondary',
    'higher_secondary',
    'k12',
    'preschool',
    'vocational',
    'special_education',
  ]),
  curriculum: z
    .enum(['cbse', 'icse', 'state_board', 'ib', 'cambridge', 'montessori', 'waldorf'])
    .optional(),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  phone: z.string().regex(/^\+?[\d\s-()]{7,20}$/, 'Invalid phone number'),
  email: z.string().email(),
  website: z.string().url().optional(),
  establishedYear: z.coerce.number().int().min(1800).max(2100).optional(),
});

export const updateSchoolSchema = createSchoolSchema.partial();

export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;
