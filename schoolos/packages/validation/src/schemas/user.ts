import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(200),
  roleId: z.string().uuid(),
  phone: z.string().regex(/^\+?[\d\s-()]{7,20}$/, 'Invalid phone number').optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'invited', 'disabled']).default('active'),
});

export const updateUserSchema = createUserSchema.partial().omit({ email: true });

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  timezone: z.string().optional(),
  locale: z.string().length(2).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
