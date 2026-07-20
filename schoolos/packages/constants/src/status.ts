export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  INVITED: 'invited',
  DISABLED: 'disabled',
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const AUDIT_ACTION = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGOUT: 'logout',
  EXPORT: 'export',
  IMPORT: 'import',
  APPROVE: 'approve',
  REJECT: 'reject',
  VIEW: 'view',
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

export const AUDIT_ENTITY = {
  USER: 'user',
  SCHOOL: 'school',
  ROLE: 'role',
  PERMISSION: 'permission',
  SUBSCRIPTION: 'subscription',
  ATTENDANCE: 'attendance',
  FEE: 'fee',
  GRADE: 'grade',
  SCHEDULE: 'schedule',
  SETTING: 'setting',
  API_KEY: 'api_key',
  FILE: 'file',
} as const;

export type AuditEntity = (typeof AUDIT_ENTITY)[keyof typeof AUDIT_ENTITY];

export const NOTIFICATION_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  ALERT: 'alert',
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export const NOTIFICATION_CATEGORY = {
  SYSTEM: 'system',
  ATTENDANCE: 'attendance',
  GRADE: 'grade',
  FEE: 'fee',
  COMMUNICATION: 'communication',
  SCHEDULE: 'schedule',
  SECURITY: 'security',
} as const;

export type NotificationCategory =
  (typeof NOTIFICATION_CATEGORY)[keyof typeof NOTIFICATION_CATEGORY];

export const FILE_CATEGORY = {
  STUDENT_PROFILE: 'student-profile',
  TEACHER_PROFILE: 'teacher-profile',
  DOCUMENTS: 'documents',
  SCHOOL_LOGO: 'school-logo',
  CERTIFICATES: 'certificates',
  ASSIGNMENTS: 'assignments',
  HOMEWORK: 'homework',
  GALLERY: 'gallery',
} as const;

export type FileCategory = (typeof FILE_CATEGORY)[keyof typeof FILE_CATEGORY];
