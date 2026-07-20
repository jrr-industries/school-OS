import { UserRole } from '@/generated/prisma';

export type Permission =
  | 'school:create'
  | 'school:read'
  | 'school:update'
  | 'school:delete'
  | 'branch:create'
  | 'branch:read'
  | 'branch:update'
  | 'branch:delete'
  | 'academic-year:create'
  | 'academic-year:read'
  | 'academic-year:update'
  | 'academic-year:delete'
  | 'class:create'
  | 'class:read'
  | 'class:update'
  | 'class:delete'
  | 'section:create'
  | 'section:read'
  | 'section:update'
  | 'section:delete'
  | 'subject:create'
  | 'subject:read'
  | 'subject:update'
  | 'subject:delete'
  | 'calendar:create'
  | 'calendar:read'
  | 'calendar:update'
  | 'calendar:delete'
  | 'announcement:create'
  | 'announcement:read'
  | 'announcement:update'
  | 'announcement:delete'
  | 'task:create'
  | 'task:read'
  | 'task:update'
  | 'task:delete';

const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'school:create', 'school:read', 'school:update', 'school:delete',
    'branch:create', 'branch:read', 'branch:update', 'branch:delete',
    'academic-year:create', 'academic-year:read', 'academic-year:update', 'academic-year:delete',
    'class:create', 'class:read', 'class:update', 'class:delete',
    'section:create', 'section:read', 'section:update', 'section:delete',
    'subject:create', 'subject:read', 'subject:update', 'subject:delete',
    'calendar:create', 'calendar:read', 'calendar:update', 'calendar:delete',
    'announcement:create', 'announcement:read', 'announcement:update', 'announcement:delete',
    'task:create', 'task:read', 'task:update', 'task:delete',
  ],
  ADMIN: [
    'school:read', 'school:update',
    'branch:read', 'branch:update',
    'academic-year:read', 'academic-year:update',
    'class:create', 'class:read', 'class:update',
    'section:create', 'section:read', 'section:update',
    'subject:create', 'subject:read', 'subject:update',
    'calendar:create', 'calendar:read', 'calendar:update',
    'announcement:create', 'announcement:read', 'announcement:update',
    'task:create', 'task:read', 'task:update',
  ],
  TEACHER: [
    'school:read',
    'branch:read',
    'class:read',
    'section:read',
    'subject:read',
    'calendar:read',
    'announcement:read',
    'task:read', 'task:update',
  ],
  PARENT: [
    'school:read',
    'class:read',
    'section:read',
    'calendar:read',
    'announcement:read',
  ],
  STUDENT: [
    'school:read',
    'class:read',
    'section:read',
    'calendar:read',
    'announcement:read',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}
