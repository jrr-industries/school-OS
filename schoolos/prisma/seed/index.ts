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
