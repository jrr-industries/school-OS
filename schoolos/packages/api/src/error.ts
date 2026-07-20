export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: Record<string, string[]> | null;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, details?: Record<string, string[]>): ApiError {
    return new ApiError(400, 'BAD_REQUEST', message, details ?? null);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message = 'Resource already exists'): ApiError {
    return new ApiError(409, 'CONFLICT', message);
  }

  static validation(errors: Record<string, string[]>): ApiError {
    return new ApiError(422, 'VALIDATION_ERROR', 'Validation failed', errors);
  }

  static tooManyRequests(message = 'Rate limit exceeded'): ApiError {
    return new ApiError(429, 'RATE_LIMIT_EXCEEDED', message);
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}
