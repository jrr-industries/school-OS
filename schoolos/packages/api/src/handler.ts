import type { NextRequest } from 'next/server';
import { Logger } from '@schoolos/utils/server';
import { ApiResponse } from './response';
import { ApiError } from './error';
import { validateBody, validateQuery, validateParams } from './validation';
import type { ApiHandlerOptions, AuthenticatedRequest } from './types';

export function apiHandler(
  handler: (
    request: AuthenticatedRequest | NextRequest,
    context: { params: Record<string, string> },
  ) => Promise<Response>,
  options: ApiHandlerOptions = {},
) {
  return async (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
  ): Promise<Response> => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      const params = await context.params;

      if (options.validate?.body || options.validate?.query) {
        if (options.validate.body) {
          const body = await request.json().catch(() => ({}));
          const validation = validateBody(options.validate.body, body);
          if (validation instanceof Response) return validation;
        }

        if (options.validate.query) {
          const url = new URL(request.url);
          const query = Object.fromEntries(url.searchParams);
          const validation = validateQuery(options.validate.query, query);
          if (validation instanceof Response) return validation;
        }

        if (options.validate?.params) {
          const validation = validateParams(options.validate.params, params);
          if (validation instanceof Response) return validation;
        }
      }

      const response = await handler(request, { params });

      const duration = Date.now() - startTime;
      Logger.debug('API', `Request ${requestId} completed in ${duration}ms`);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        Logger.warn('API', `Request ${requestId} failed: ${error.message}`);
        return ApiResponse.error(
          error.statusCode,
          error.code,
          error.message,
          error.details,
        );
      }

      if (error instanceof SyntaxError) {
        return ApiResponse.badRequest('Invalid JSON in request body');
      }

      Logger.error('API', `Request ${requestId} failed`, error as Error);

      return ApiResponse.internal(
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : (error as Error).message,
      );
    }
  };
}
