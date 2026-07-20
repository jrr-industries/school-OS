export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  TRIAL: 'trial',
} as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const;

export type SubscriptionPlanSlug =
  (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS];

export const SUBSCRIPTION_PLAN_LIMITS: Record<SubscriptionPlanSlug, {
  maxStudents: number;
  maxTeachers: number;
  maxStorageGB: number;
  features: string[];
}> = {
  free: {
    maxStudents: 100,
    maxTeachers: 10,
    maxStorageGB: 1,
    features: ['basic_attendance', 'basic_grades'],
  },
  basic: {
    maxStudents: 500,
    maxTeachers: 50,
    maxStorageGB: 10,
    features: ['attendance', 'grades', 'communication', 'basic_reports'],
  },
  professional: {
    maxStudents: 2000,
    maxTeachers: 200,
    maxStorageGB: 50,
    features: [
      'attendance',
      'grades',
      'communication',
      'reports',
      'fees',
      'schedule',
      'api_access',
    ],
  },
  enterprise: {
    maxStudents: 10000,
    maxTeachers: 1000,
    maxStorageGB: 500,
    features: [
      'attendance',
      'grades',
      'communication',
      'advanced_reports',
      'fees',
      'schedule',
      'api_access',
      'custom_roles',
      'audit_logs',
      'priority_support',
      'white_label',
    ],
  },
} as const;

export const SUBSCRIPTION_PLAN_PRICES: Record<SubscriptionPlanSlug, number> = {
  free: 0,
  basic: 29,
  professional: 99,
  enterprise: 299,
} as const;
