import type { ApiResponse, PaginatedResult } from '@schoolos/types';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
};

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { method = 'GET', body, headers = {}, params } = options;

    let url = `${API_BASE}/api/${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = (await response.json()) as ApiResponse<T>;

    if (!data.success || data.error) {
      throw new ApiError(response.status, data.error?.code ?? 'UNKNOWN', data.error?.message ?? 'An error occurred', data.error?.details ?? null);
    }

    return data.data as T;
  }

  static async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    return ApiService.request<T>(endpoint, { params });
  }

  static async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return ApiService.request<T>(endpoint, { method: 'POST', body });
  }

  static async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return ApiService.request<T>(endpoint, { method: 'PUT', body });
  }

  static async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return ApiService.request<T>(endpoint, { method: 'PATCH', body });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return ApiService.request<T>(endpoint, { method: 'DELETE' });
  }

  static async getPaginated<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined>,
  ): Promise<PaginatedResult<T>> {
    const response = await fetch(`${API_BASE}/api/${endpoint}?${new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    )}`);

    const data = (await response.json()) as ApiResponse<T[]>;

    if (!data.success || data.error) {
      throw new ApiError(response.status, data.error?.code ?? 'UNKNOWN', data.error?.message ?? 'An error occurred');
    }

    return {
      data: data.data as T[],
      meta: {
        page: data.meta?.page ?? 1,
        limit: data.meta?.limit ?? 10,
        total: data.meta?.total ?? 0,
        totalPages: data.meta?.totalPages ?? 0,
        hasNextPage: data.meta?.hasNextPage ?? false,
        hasPreviousPage: data.meta?.hasPreviousPage ?? false,
      },
    };
  }
}

class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: Record<string, string[]> | null;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details: Record<string, string[]> | null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export { ApiError };
