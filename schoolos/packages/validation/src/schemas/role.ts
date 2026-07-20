import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z_]+$/, 'Slug must contain only lowercase letters and underscores'),
  description: z.string().max(500).optional(),
  permissions: z.array(z.string().uuid()).optional(),
  isCustom: z.boolean().default(true),
});

export const updateRoleSchema = createRoleSchema.partial();

export const assignRoleSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
});

export const assignPermissionsSchema = z.object({
  roleId: z.string().uuid(),
  permissionIds: z.array(z.string().uuid()).min(1),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
