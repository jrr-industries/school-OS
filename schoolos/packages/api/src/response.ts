import type { ApiError, ApiMeta } from '@schoolos/types';

export class ApiResponse {
  static success<T>(data: T, meta?: Partial<ApiMeta>): Response {
    const response = {
      success: true,
      data,
      error: null,
      meta: meta
        ? {
            page: meta.page ?? 1,
            limit: meta.limit ?? 10,
            total: meta.total ?? 0,
            totalPages: meta.totalPages ?? 0,
            hasNextPage: meta.hasNextPage ?? false,
            hasPreviousPage: meta.hasPreviousPage ?? false,
            timestamp: new Date().toISOString(),
            requestId: meta.requestId ?? '',
          }
        : null,
    };

    return Response.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  static created<T>(data: T): Response {
    const response = {
      success: true,
      data,
      error: null,
      meta: null,
    };

    return Response.json(response, {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static noContent(): Response {
    return new Response(null, { status: 204 });
  }

  static paginated<T>(
    data: T[],
    meta: {
      page: number;
      limit: number;
      total: number;
    },
  ): Response {
    const totalPages = Math.ceil(meta.total / meta.limit);

    return ApiResponse.success(data, {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      totalPages,
      hasNextPage: meta.page < totalPages,
      hasPreviousPage: meta.page > 1,
      requestId: crypto.randomUUID(),
    });
  }

  static error(
    status: number,
    code: string,
    message: string,
    details: Record<string, string[]> | null = null,
  ): Response {
    const error: ApiError = { code, message, details };

    const response = {
      success: false,
      data: null,
      error,
      meta: null,
    };

    return Response.json(response, {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static badRequest(
    message = 'Bad request',
    details: Record<string, string[]> | null = null,
  ): Response {
    return ApiResponse.error(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Unauthorized'): Response {
    return ApiResponse.error(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Forbidden'): Response {
    return ApiResponse.error(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Resource not found'): Response {
    return ApiResponse.error(404, 'NOT_FOUND', message);
  }

  static conflict(message = 'Resource already exists'): Response {
    return ApiResponse.error(409, 'CONFLICT', message);
  }

  static tooManyRequests(message = 'Rate limit exceeded'): Response {
    return ApiResponse.error(429, 'RATE_LIMIT_EXCEEDED', message);
  }

  static internal(message = 'Internal server error'): Response {
    return ApiResponse.error(500, 'INTERNAL_ERROR', message);
  }
}
