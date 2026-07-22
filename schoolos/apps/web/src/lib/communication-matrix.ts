export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'PRINCIPAL' | 'VICE_PRINCIPAL' | 'TEACHER' | 'CLASS_TEACHER' | 'STUDENT' | 'PARENT' | 'ACCOUNTANT' | 'RECEPTIONIST' | 'DRIVER' | 'KITCHEN';

const roles: UserRole[] = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'RECEPTIONIST', 'DRIVER', 'KITCHEN'];

const matrix: Record<UserRole, Record<UserRole, boolean>> = {
  SUPER_ADMIN:   { SUPER_ADMIN: true, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: true, TEACHER: false, CLASS_TEACHER: false, STUDENT: false, PARENT: false, ACCOUNTANT: false, RECEPTIONIST: false, DRIVER: false, KITCHEN: false },
  SCHOOL_ADMIN:  { SUPER_ADMIN: true, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: true, TEACHER: true, CLASS_TEACHER: true, STUDENT: false, PARENT: false, ACCOUNTANT: true, RECEPTIONIST: true, DRIVER: true, KITCHEN: true },
  PRINCIPAL:     { SUPER_ADMIN: true, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: true, TEACHER: true, CLASS_TEACHER: true, STUDENT: false, PARENT: false, ACCOUNTANT: true, RECEPTIONIST: true, DRIVER: true, KITCHEN: true },
  VICE_PRINCIPAL:{ SUPER_ADMIN: false, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: true, TEACHER: true, CLASS_TEACHER: true, STUDENT: false, PARENT: false, ACCOUNTANT: false, RECEPTIONIST: true, DRIVER: false, KITCHEN: false },
  TEACHER:       { SUPER_ADMIN: false, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: true, TEACHER: true, CLASS_TEACHER: true, STUDENT: true, PARENT: false, ACCOUNTANT: false, RECEPTIONIST: false, DRIVER: false, KITCHEN: false },
  CLASS_TEACHER: { SUPER_ADMIN: false, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: true, TEACHER: true, CLASS_TEACHER: true, STUDENT: true, PARENT: true, ACCOUNTANT: false, RECEPTIONIST: false, DRIVER: false, KITCHEN: false },
  STUDENT:       { SUPER_ADMIN: false, SCHOOL_ADMIN: false, PRINCIPAL: false, VICE_PRINCIPAL: false, TEACHER: true, CLASS_TEACHER: true, STUDENT: true, PARENT: false, ACCOUNTANT: false, RECEPTIONIST: false, DRIVER: false, KITCHEN: false },
  PARENT:        { SUPER_ADMIN: false, SCHOOL_ADMIN: false, PRINCIPAL: false, VICE_PRINCIPAL: false, TEACHER: false, CLASS_TEACHER: true, STUDENT: false, PARENT: false, ACCOUNTANT: true, RECEPTIONIST: true, DRIVER: false, KITCHEN: false },
  ACCOUNTANT:    { SUPER_ADMIN: false, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: false, TEACHER: false, CLASS_TEACHER: false, STUDENT: false, PARENT: true, ACCOUNTANT: true, RECEPTIONIST: false, DRIVER: false, KITCHEN: false },
  RECEPTIONIST:  { SUPER_ADMIN: false, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: true, TEACHER: false, CLASS_TEACHER: false, STUDENT: false, PARENT: true, ACCOUNTANT: false, RECEPTIONIST: true, DRIVER: false, KITCHEN: false },
  DRIVER:        { SUPER_ADMIN: false, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: false, TEACHER: false, CLASS_TEACHER: false, STUDENT: false, PARENT: false, ACCOUNTANT: false, RECEPTIONIST: false, DRIVER: true, KITCHEN: false },
  KITCHEN:       { SUPER_ADMIN: false, SCHOOL_ADMIN: true, PRINCIPAL: true, VICE_PRINCIPAL: false, TEACHER: false, CLASS_TEACHER: false, STUDENT: false, PARENT: false, ACCOUNTANT: false, RECEPTIONIST: false, DRIVER: false, KITCHEN: true },
};

export function canChat(fromRole: UserRole, toRole: UserRole): boolean {
  return matrix[fromRole]?.[toRole] ?? false;
}

export function getAllowedTargets(role: UserRole): UserRole[] {
  return roles.filter((r) => matrix[role]?.[r]);
}

export function isOversightRole(role: UserRole): boolean {
  return role === 'SCHOOL_ADMIN' || role === 'PRINCIPAL' || role === 'VICE_PRINCIPAL';
}
