import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(data: T, meta?: ApiSuccessResponse<T>['meta']) {
  return NextResponse.json({ success: true, data, meta } as ApiSuccessResponse<T>);
}

export function errorResponse(error: string, status: number = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error, details } as ApiErrorResponse,
    { status },
  );
}

export function parseSearchParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)));
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
  const status = searchParams.get('status') || '';
  const schoolId = searchParams.get('schoolId') || '';
  const branchId = searchParams.get('branchId') || '';

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    search,
    sortBy,
    sortOrder,
    status,
    schoolId,
    branchId,
  };
}
