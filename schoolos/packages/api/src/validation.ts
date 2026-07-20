import { z } from 'zod';
import type { ZodSchema } from '@schoolos/validation';
import type { NextRequest } from 'next/server';
import { ApiResponse } from './response';
import { ApiError } from './error';

type ValidationTarget = 'body' | 'query' | 'params';

function createValidationError(
  zodError: z.ZodError,
  target: ValidationTarget,
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of zodError.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path]!.push(issue.message);
  }

  return errors;
}

export function validateBody<T>(
  schema: ZodSchema<T>,
  data: unknown,
): T | Response {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = createValidationError(result.error, 'body');
    return ApiResponse.badRequest('Validation failed', errors);
  }

  return result.data;
}

export function validateQuery<T>(
  schema: ZodSchema<T>,
  data: Record<string, string>,
): T | Response {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = createValidationError(result.error, 'query');
    return ApiResponse.badRequest('Invalid query parameters', errors);
  }

  return result.data;
}

export function validateParams<T>(
  schema: ZodSchema<T>,
  data: Record<string, string>,
): T | Response {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = createValidationError(result.error, 'params');
    return ApiResponse.badRequest('Invalid path parameters', errors);
  }

  return result.data;
}

export function validateOrThrow<T>(
  schema: ZodSchema<T>,
  data: unknown,
  target: ValidationTarget = 'body',
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = createValidationError(result.error, target);
    throw ApiError.validation(errors);
  }

  return result.data;
}

export async function parseBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<T> {
  const body = await request.json().catch(() => ({}));
  return validateOrThrow(schema, body, 'body');
}

export async function parseSearchParams<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<T> {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  return validateOrThrow(schema, params, 'query');
}
