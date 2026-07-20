export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_OWNER: 'school_owner',
  PRINCIPAL: 'principal',
  VICE_PRINCIPAL: 'vice_principal',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  PARENT: 'parent',
  STUDENT: 'student',
  HR: 'hr',
  RECEPTIONIST: 'receptionist',
  ACCOUNTANT: 'accountant',
  DRIVER: 'driver',
  LIBRARIAN: 'librarian',
  TRANSPORT_MANAGER: 'transport_manager',
  SUPPORT: 'support',
} as const;

export type RoleSlug = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<RoleSlug, number> = {
  super_admin: 100,
  school_owner: 90,
  principal: 80,
  vice_principal: 75,
  admin: 70,
  hr: 60,
  accountant: 60,
  teacher: 50,
  transport_manager: 45,
  librarian: 40,
  receptionist: 35,
  support: 30,
  parent: 20,
  student: 10,
} as const;

export const ROLE_LABELS: Record<RoleSlug, string> = {
  super_admin: 'Super Admin',
  school_owner: 'School Owner',
  principal: 'Principal',
  vice_principal: 'Vice Principal',
  admin: 'Admin',
  teacher: 'Teacher',
  parent: 'Parent',
  student: 'Student',
  hr: 'HR',
  receptionist: 'Receptionist',
  accountant: 'Accountant',
  driver: 'Driver',
  librarian: 'Librarian',
  transport_manager: 'Transport Manager',
  support: 'Support',
} as const;
