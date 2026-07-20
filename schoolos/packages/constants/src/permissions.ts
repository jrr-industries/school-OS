export const PERMISSION_GROUPS = {
  SCHOOL: 'school',
  USERS: 'users',
  ROLES: 'roles',
  ATTENDANCE: 'attendance',
  FEES: 'fees',
  GRADES: 'grades',
  SCHEDULE: 'schedule',
  COMMUNICATION: 'communication',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  SYSTEM: 'system',
} as const;

export type PermissionGroup = (typeof PERMISSION_GROUPS)[keyof typeof PERMISSION_GROUPS];

export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  APPROVE: 'approve',
  EXPORT: 'export',
  IMPORT: 'import',
} as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];

export const PERMISSIONS = {
  // School permissions
  SCHOOL_CREATE: 'school:create',
  SCHOOL_READ: 'school:read',
  SCHOOL_UPDATE: 'school:update',
  SCHOOL_DELETE: 'school:delete',
  SCHOOL_MANAGE: 'school:manage',

  // User permissions
  USER_CREATE: 'users:create',
  USER_READ: 'users:read',
  USER_UPDATE: 'users:update',
  USER_DELETE: 'users:delete',
  USER_MANAGE: 'users:manage',

  // Role permissions
  ROLE_CREATE: 'roles:create',
  ROLE_READ: 'roles:read',
  ROLE_UPDATE: 'roles:update',
  ROLE_DELETE: 'roles:delete',
  ROLE_MANAGE: 'roles:manage',

  // Attendance permissions
  ATTENDANCE_CREATE: 'attendance:create',
  ATTENDANCE_READ: 'attendance:read',
  ATTENDANCE_UPDATE: 'attendance:update',
  ATTENDANCE_DELETE: 'attendance:delete',
  ATTENDANCE_MANAGE: 'attendance:manage',

  // Fee permissions
  FEE_CREATE: 'fees:create',
  FEE_READ: 'fees:read',
  FEE_UPDATE: 'fees:update',
  FEE_DELETE: 'fees:delete',
  FEE_MANAGE: 'fees:manage',
  FEE_APPROVE: 'fees:approve',

  // Grades permissions
  GRADE_CREATE: 'grades:create',
  GRADE_READ: 'grades:read',
  GRADE_UPDATE: 'grades:update',
  GRADE_DELETE: 'grades:delete',
  GRADE_MANAGE: 'grades:manage',

  // Schedule permissions
  SCHEDULE_CREATE: 'schedule:create',
  SCHEDULE_READ: 'schedule:read',
  SCHEDULE_UPDATE: 'schedule:update',
  SCHEDULE_DELETE: 'schedule:delete',

  // Communication permissions
  COMMUNICATION_SEND: 'communication:send',
  COMMUNICATION_READ: 'communication:read',
  COMMUNICATION_MANAGE: 'communication:manage',

  // Report permissions
  REPORT_CREATE: 'reports:create',
  REPORT_READ: 'reports:read',
  REPORT_EXPORT: 'reports:export',

  // Settings permissions
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_MANAGE: 'settings:manage',

  // System permissions
  SYSTEM_MANAGE: 'system:manage',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_BACKUP: 'system:backup',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: Object.values(PERMISSIONS),
  school_owner: [
    PERMISSIONS.SCHOOL_READ,
    PERMISSIONS.SCHOOL_UPDATE,
    PERMISSIONS.SCHOOL_MANAGE,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_READ,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.ROLE_MANAGE,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_MANAGE,
    PERMISSIONS.FEE_READ,
    PERMISSIONS.FEE_MANAGE,
    PERMISSIONS.FEE_APPROVE,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.SYSTEM_LOGS,
  ],
  principal: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_MANAGE,
    PERMISSIONS.FEE_READ,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.GRADE_MANAGE,
    PERMISSIONS.SCHEDULE_READ,
    PERMISSIONS.SCHEDULE_MANAGE,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.COMMUNICATION_READ,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.SETTINGS_READ,
  ],
  teacher: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.ATTENDANCE_CREATE,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_UPDATE,
    PERMISSIONS.GRADE_CREATE,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.GRADE_UPDATE,
    PERMISSIONS.SCHEDULE_READ,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.COMMUNICATION_READ,
    PERMISSIONS.REPORT_READ,
  ],
  parent: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.SCHEDULE_READ,
    PERMISSIONS.COMMUNICATION_READ,
    PERMISSIONS.FEE_READ,
  ],
  student: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.SCHEDULE_READ,
  ],
};
