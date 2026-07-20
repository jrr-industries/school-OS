export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: ApiMeta | null;
}

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string[]> | null;
  stack?: string;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  timestamp: string;
  requestId: string;
}

export type ApiHandler<T = unknown> = (
  request: Request,
  context: RouteContext,
) => Promise<ApiResponse<T>>;

export interface RouteContext {
  params: Record<string, string>;
  schoolId: string | null;
  userId: string | null;
  roleId: string | null;
  permissions: string[];
  isAuthenticated: boolean;
}
