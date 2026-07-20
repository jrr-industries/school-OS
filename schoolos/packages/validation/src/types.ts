import type { z } from 'zod';

export type ZodSchema<T = unknown> = z.ZodType<T>;
export type ValidationResult<T> = { success: true; data: T } | { success: false; errors: Record<string, string[]> };
