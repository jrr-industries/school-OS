import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_PERMISSIONS = [
  { name: 'Create School', slug: 'school:create', group: 'school', isSystem: true },
  { name: 'Read School', slug: 'school:read', group: 'school', isSystem: true },
  { name: 'Update School', slug: 'school:update', group: 'school', isSystem: true },
  { name: 'Delete School', slug: 'school:delete', group: 'school', isSystem: true },
  { name: 'Manage School', slug: 'school:manage', group: 'school', isSystem: true },
  { name: 'Create User', slug: 'users:create', group: 'users', isSystem: true },
  { name: 'Read User', slug: 'users:read', group: 'users', isSystem: true },
  { name: 'Update User', slug: 'users:update', group: 'users', isSystem: true },
  { name: 'Delete User', slug: 'users:delete', group: 'users', isSystem: true },
  { name: 'Manage User', slug: 'users:manage', group: 'users', isSystem: true },
  { name: 'Create Role', slug: 'roles:create', group: 'roles', isSystem: true },
  { name: 'Read Role', slug: 'roles:read', group: 'roles', isSystem: true },
  { name: 'Update Role', slug: 'roles:update', group: 'roles', isSystem: true },
  { name: 'Delete Role', slug: 'roles:delete', group: 'roles', isSystem: true },
  { name: 'Manage Role', slug: 'roles:manage', group: 'roles', isSystem: true },
  { name: 'Create Attendance', slug: 'attendance:create', group: 'attendance', isSystem: true },
  { name: 'Read Attendance', slug: 'attendance:read', group: 'attendance', isSystem: true },
  { name: 'Update Attendance', slug: 'attendance:update', group: 'attendance', isSystem: true },
  { name: 'Delete Attendance', slug: 'attendance:delete', group: 'attendance', isSystem: true },
  { name: 'Manage Attendance', slug: 'attendance:manage', group: 'attendance', isSystem: true },
  { name: 'Create Fee', slug: 'fees:create', group: 'fees', isSystem: true },
  { name: 'Read Fee', slug: 'fees:read', group: 'fees', isSystem: true },
  { name: 'Update Fee', slug: 'fees:update', group: 'fees', isSystem: true },
  { name: 'Delete Fee', slug: 'fees:delete', group: 'fees', isSystem: true },
  { name: 'Manage Fee', slug: 'fees:manage', group: 'fees', isSystem: true },
  { name: 'Approve Fee', slug: 'fees:approve', group: 'fees', isSystem: true },
  { name: 'Create Grade', slug: 'grades:create', group: 'grades', isSystem: true },
  { name: 'Read Grade', slug: 'grades:read', group: 'grades', isSystem: true },
  { name: 'Update Grade', slug: 'grades:update', group: 'grades', isSystem: true },
  { name: 'Delete Grade', slug: 'grades:delete', group: 'grades', isSystem: true },
  { name: 'Manage Grade', slug: 'grades:manage', group: 'grades', isSystem: true },
  { name: 'Create Schedule', slug: 'schedule:create', group: 'schedule', isSystem: true },
  { name: 'Read Schedule', slug: 'schedule:read', group: 'schedule', isSystem: true },
  { name: 'Update Schedule', slug: 'schedule:update', group: 'schedule', isSystem: true },
  { name: 'Delete Schedule', slug: 'schedule:delete', group: 'schedule', isSystem: true },
  { name: 'Manage Schedule', slug: 'schedule:manage', group: 'schedule', isSystem: true },
  { name: 'Send Communication', slug: 'communication:send', group: 'communication', isSystem: true },
  { name: 'Read Communication', slug: 'communication:read', group: 'communication', isSystem: true },
  { name: 'Manage Communication', slug: 'communication:manage', group: 'communication', isSystem: true },
  { name: 'Create Report', slug: 'reports:create', group: 'reports', isSystem: true },
  { name: 'Read Report', slug: 'reports:read', group: 'reports', isSystem: true },
  { name: 'Export Report', slug: 'reports:export', group: 'reports', isSystem: true },
  { name: 'Read Settings', slug: 'settings:read', group: 'settings', isSystem: true },
  { name: 'Update Settings', slug: 'settings:update', group: 'settings', isSystem: true },
  { name: 'Manage Settings', slug: 'settings:manage', group: 'settings', isSystem: true },
  { name: 'Manage System', slug: 'system:manage', group: 'system', isSystem: true },
  { name: 'View System Logs', slug: 'system:logs', group: 'system', isSystem: true },
  { name: 'System Backup', slug: 'system:backup', group: 'system', isSystem: true },
  // Student permissions
  { name: 'Create Student', slug: 'students:create', group: 'students', isSystem: true },
  { name: 'Read Student', slug: 'students:read', group: 'students', isSystem: true },
  { name: 'Update Student', slug: 'students:update', group: 'students', isSystem: true },
  { name: 'Delete Student', slug: 'students:delete', group: 'students', isSystem: true },
  { name: 'Manage Student', slug: 'students:manage', group: 'students', isSystem: true },
  { name: 'Archive Student', slug: 'students:archive', group: 'students', isSystem: true },
  { name: 'Restore Student', slug: 'students:restore', group: 'students', isSystem: true },
  { name: 'Promote Student', slug: 'students:promote', group: 'students', isSystem: true },
  { name: 'Transfer Student', slug: 'students:transfer', group: 'students', isSystem: true },
  { name: 'Export Student', slug: 'students:export', group: 'students', isSystem: true },
  { name: 'Import Student', slug: 'students:import', group: 'students', isSystem: true },
  { name: 'Approve Student', slug: 'students:approve', group: 'students', isSystem: true },
  // Parent permissions
  { name: 'Create Parent', slug: 'parents:create', group: 'parents', isSystem: true },
  { name: 'Read Parent', slug: 'parents:read', group: 'parents', isSystem: true },
  { name: 'Update Parent', slug: 'parents:update', group: 'parents', isSystem: true },
  { name: 'Delete Parent', slug: 'parents:delete', group: 'parents', isSystem: true },
  { name: 'Manage Parent', slug: 'parents:manage', group: 'parents', isSystem: true },
  // Academic year permissions
  { name: 'Create Academic Year', slug: 'academic_years:create', group: 'academic_years', isSystem: true },
  { name: 'Read Academic Year', slug: 'academic_years:read', group: 'academic_years', isSystem: true },
  { name: 'Update Academic Year', slug: 'academic_years:update', group: 'academic_years', isSystem: true },
  { name: 'Delete Academic Year', slug: 'academic_years:delete', group: 'academic_years', isSystem: true },
  { name: 'Manage Academic Year', slug: 'academic_years:manage', group: 'academic_years', isSystem: true },
  // Class permissions
  { name: 'Create Class', slug: 'classes:create', group: 'classes', isSystem: true },
  { name: 'Read Class', slug: 'classes:read', group: 'classes', isSystem: true },
  { name: 'Update Class', slug: 'classes:update', group: 'classes', isSystem: true },
  { name: 'Delete Class', slug: 'classes:delete', group: 'classes', isSystem: true },
  { name: 'Manage Class', slug: 'classes:manage', group: 'classes', isSystem: true },
  // Section permissions
  { name: 'Create Section', slug: 'sections:create', group: 'sections', isSystem: true },
  { name: 'Read Section', slug: 'sections:read', group: 'sections', isSystem: true },
  { name: 'Update Section', slug: 'sections:update', group: 'sections', isSystem: true },
  { name: 'Delete Section', slug: 'sections:delete', group: 'sections', isSystem: true },
  { name: 'Manage Section', slug: 'sections:manage', group: 'sections', isSystem: true },
  // Subject permissions
  { name: 'Create Subject', slug: 'subjects:create', group: 'subjects', isSystem: true },
  { name: 'Read Subject', slug: 'subjects:read', group: 'subjects', isSystem: true },
  { name: 'Update Subject', slug: 'subjects:update', group: 'subjects', isSystem: true },
  { name: 'Delete Subject', slug: 'subjects:delete', group: 'subjects', isSystem: true },
  { name: 'Manage Subject', slug: 'subjects:manage', group: 'subjects', isSystem: true },
  // Campus permissions
  { name: 'Create Campus', slug: 'campuses:create', group: 'campuses', isSystem: true },
  { name: 'Read Campus', slug: 'campuses:read', group: 'campuses', isSystem: true },
  { name: 'Update Campus', slug: 'campuses:update', group: 'campuses', isSystem: true },
  { name: 'Delete Campus', slug: 'campuses:delete', group: 'campuses', isSystem: true },
  { name: 'Manage Campus', slug: 'campuses:manage', group: 'campuses', isSystem: true },
  // Document permissions
  { name: 'Create Document', slug: 'documents:create', group: 'documents', isSystem: true },
  { name: 'Read Document', slug: 'documents:read', group: 'documents', isSystem: true },
  { name: 'Update Document', slug: 'documents:update', group: 'documents', isSystem: true },
  { name: 'Delete Document', slug: 'documents:delete', group: 'documents', isSystem: true },
  { name: 'Verify Document', slug: 'documents:verify', group: 'documents', isSystem: true },
];

async function main(): Promise<void> {
  console.log('Seeding SchoolOS database...');

  for (const permission of SYSTEM_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: { name: permission.name, group: permission.group },
      create: permission,
    });
  }

  console.log('System permissions seeded successfully.');
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
