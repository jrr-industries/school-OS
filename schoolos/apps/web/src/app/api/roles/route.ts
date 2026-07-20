import { NextRequest } from 'next/server';
import { apiHandler } from '@schoolos/api';
import { ApiResponse } from '@schoolos/api';
import { RoleRepository } from '@schoolos/database';

export const GET = apiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const schoolId = url.searchParams.get('schoolId');

  if (!schoolId) {
    return ApiResponse.badRequest('School ID is required');
  }

  const roleRepository = new RoleRepository();
  const roles = await roleRepository.findAllWithPermissions(schoolId);

  return ApiResponse.success(roles);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();

  const roleRepository = new RoleRepository();
  const role = await roleRepository.create(body);

  return ApiResponse.created(role);
});
