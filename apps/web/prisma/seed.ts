/**
 * SchoolOS — Database Seed Script
 *
 * Populates development data for all Phase 1 models.
 * Run with: pnpm --filter @schoolos/web db:seed
 *
 * Uses the Prisma client generated at src/generated/prisma.
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SchoolOS database...\n');

  // ── Clean existing data ──────────────────────────────────
  console.log('Cleaning existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.section.deleteMany();
  await prisma.class.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✓ Existing data cleaned\n');

  // ── Create Super Admin User ──────────────────────────────
  console.log('Creating users...');
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@schoolos.io',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@demo.school',
      name: 'School Admin',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('  ✓ Super Admin & Admin created\n');

  // ── Schools ──────────────────────────────────────────────
  console.log('Creating schools...');
  const school1 = await prisma.school.create({
    data: {
      name: 'International School of Excellence',
      code: 'ISE-MUM',
      email: 'admin@ise.edu',
      phone: '+91-22-23456789',
      address: '123, Marine Drive, South Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      status: 'ACTIVE',
      subscriptionPlan: 'PREMIUM',
      timeZone: 'Asia/Kolkata',
      language: 'en',
      createdBy: superAdmin.id,
    },
  });

  const school2 = await prisma.school.create({
    data: {
      name: 'Delhi Public School',
      code: 'DPS-DEL',
      email: 'admin@dps.edu',
      phone: '+91-11-23456789',
      address: '456, Lodhi Road, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110003',
      status: 'ACTIVE',
      subscriptionPlan: 'STANDARD',
      timeZone: 'Asia/Kolkata',
      language: 'en',
      createdBy: superAdmin.id,
    },
  });

  const school3 = await prisma.school.create({
    data: {
      name: 'St. Mary\'s Convent School',
      code: 'SMC-BLR',
      email: 'admin@stmarys.edu',
      phone: '+91-80-23456789',
      address: '789, Church Street, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560001',
      status: 'ACTIVE',
      subscriptionPlan: 'BASIC',
      timeZone: 'Asia/Kolkata',
      language: 'en',
      createdBy: superAdmin.id,
    },
  });

  const school4 = await prisma.school.create({
    data: {
      name: 'Global Indian International School',
      code: 'GIIS-PUN',
      email: 'admin@giis.edu',
      phone: '+91-20-23456789',
      address: '321, Koregaon Park, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '411001',
      status: 'INACTIVE',
      subscriptionPlan: 'TRIAL',
      timeZone: 'Asia/Kolkata',
      language: 'en',
      createdBy: superAdmin.id,
    },
  });
  console.log('  ✓ 4 schools created\n');

  // ── Branches ─────────────────────────────────────────────
  console.log('Creating branches...');
  const branch1 = await prisma.branch.create({
    data: {
      schoolId: school1.id,
      name: 'Main Campus - Andheri',
      code: 'ISE-AND',
      address: 'Andheri West, Mumbai',
      phone: '+91-22-21234567',
      email: 'andheri@ise.edu',
      principal: 'Dr. Rajesh Kumar',
      status: 'ACTIVE',
      createdBy: superAdmin.id,
    },
  });

  const branch2 = await prisma.branch.create({
    data: {
      schoolId: school1.id,
      name: 'Powai Campus',
      code: 'ISE-POW',
      address: 'Powai, Mumbai',
      phone: '+91-22-21234568',
      email: 'powai@ise.edu',
      principal: 'Mrs. Anita Sharma',
      status: 'ACTIVE',
      createdBy: superAdmin.id,
    },
  });

  const branch3 = await prisma.branch.create({
    data: {
      schoolId: school2.id,
      name: 'Main Branch',
      code: 'DPS-MAIN',
      address: 'Lodhi Road, New Delhi',
      phone: '+91-11-21234567',
      email: 'main@dps.edu',
      principal: 'Mr. Vikram Singh',
      status: 'ACTIVE',
      createdBy: superAdmin.id,
    },
  });

  const branch4 = await prisma.branch.create({
    data: {
      schoolId: school3.id,
      name: 'Main Campus',
      code: 'SMC-MAIN',
      address: 'Church Street, Bangalore',
      phone: '+91-80-21234567',
      email: 'main@stmarys.edu',
      principal: 'Sr. Margaret Joseph',
      status: 'ACTIVE',
      createdBy: superAdmin.id,
    },
  });
  console.log('  ✓ 4 branches created\n');

  // ── Academic Years ───────────────────────────────────────
  console.log('Creating academic years...');
  const currentYear = new Date().getFullYear();
  const academicYear1 = await prisma.academicYear.create({
    data: {
      schoolId: school1.id,
      branchId: branch1.id,
      name: `AY ${currentYear}-${currentYear + 1}`,
      startDate: new Date(currentYear, 3, 1),  // April 1
      endDate: new Date(currentYear + 1, 2, 31), // March 31
      isCurrent: true,
      status: 'ACTIVE',
      createdBy: superAdmin.id,
    },
  });

  const academicYear2 = await prisma.academicYear.create({
    data: {
      schoolId: school1.id,
      branchId: branch2.id,
      name: `AY ${currentYear}-${currentYear + 1}`,
      startDate: new Date(currentYear, 3, 1),
      endDate: new Date(currentYear + 1, 2, 31),
      isCurrent: true,
      status: 'ACTIVE',
      createdBy: superAdmin.id,
    },
  });

  const academicYear3 = await prisma.academicYear.create({
    data: {
      schoolId: school2.id,
      name: `AY ${currentYear}-${currentYear + 1}`,
      startDate: new Date(currentYear, 3, 1),
      endDate: new Date(currentYear + 1, 2, 31),
      isCurrent: true,
      status: 'ACTIVE',
      createdBy: superAdmin.id,
    },
  });

  const academicYear4 = await prisma.academicYear.create({
    data: {
      schoolId: school2.id,
      name: `AY ${currentYear - 1}-${currentYear}`,
      startDate: new Date(currentYear - 1, 3, 1),
      endDate: new Date(currentYear, 2, 31),
      isCurrent: false,
      status: 'COMPLETED',
      createdBy: superAdmin.id,
    },
  });
  console.log('  ✓ 4 academic years created\n');

  // ── Classes ──────────────────────────────────────────────
  console.log('Creating classes...');
  const classNames = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3',
    'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 Science', 'Class 11 Commerce', 'Class 12 Science', 'Class 12 Commerce'];

  const createdClasses = [];
  for (let i = 0; i < classNames.length; i++) {
    const cls = await prisma.class.create({
      data: {
        schoolId: school1.id,
        branchId: branch1.id,
        academicYearId: academicYear1.id,
        name: classNames[i],
        displayOrder: i + 1,
        status: 'ACTIVE',
        createdBy: superAdmin.id,
      },
    });
    createdClasses.push(cls);
  }

  // Some classes for school2
  for (let i = 0; i < 10; i++) {
    await prisma.class.create({
      data: {
        schoolId: school2.id,
        branchId: branch3.id,
        academicYearId: academicYear3.id,
        name: `Class ${i + 1}`,
        displayOrder: i + 1,
        status: 'ACTIVE',
        createdBy: superAdmin.id,
      },
    });
  }
  console.log(`  ✓ ${classNames.length + 10} classes created\n`);

  // ── Sections ─────────────────────────────────────────────
  console.log('Creating sections...');
  const sectionNames = ['A', 'B', 'C'];
  for (const cls of createdClasses) {
    for (const secName of sectionNames) {
      await prisma.section.create({
        data: {
          classId: cls.id,
          name: secName,
          capacity: 40,
          roomNumber: `${cls.displayOrder}0${sectionNames.indexOf(secName) + 1}`,
          status: 'ACTIVE',
          createdBy: superAdmin.id,
        },
      });
    }
  }
  console.log(`  ✓ ${createdClasses.length * 3} sections created\n`);

  // ── Subjects ─────────────────────────────────────────────
  console.log('Creating subjects...');
  const subjects = [
    { code: 'ENG', name: 'English', shortName: 'Eng' },
    { code: 'HIN', name: 'Hindi', shortName: 'Hin' },
    { code: 'MAT', name: 'Mathematics', shortName: 'Maths' },
    { code: 'SCI', name: 'Science', shortName: 'Sci' },
    { code: 'SOC', name: 'Social Studies', shortName: 'SST' },
    { code: 'PHY', name: 'Physics', shortName: 'Phy' },
    { code: 'CHE', name: 'Chemistry', shortName: 'Chem' },
    { code: 'BIO', name: 'Biology', shortName: 'Bio' },
    { code: 'COM', name: 'Computer Science', shortName: 'CS' },
    { code: 'ART', name: 'Arts & Craft', shortName: 'Art' },
    { code: 'MUS', name: 'Music', shortName: 'Mus' },
    { code: 'PE', name: 'Physical Education', shortName: 'PE' },
    { code: 'ACC', name: 'Accountancy', shortName: 'Accts' },
    { code: 'ECO', name: 'Economics', shortName: 'Eco' },
    { code: 'BUS', name: 'Business Studies', shortName: 'BS' },
  ];

  for (const sub of subjects) {
    await prisma.subject.create({
      data: {
        schoolId: school1.id,
        code: sub.code,
        name: sub.name,
        shortName: sub.shortName,
        description: `${sub.name} subject for grades K-12`,
        status: 'ACTIVE',
        createdBy: superAdmin.id,
      },
    });
  }
  console.log(`  ✓ ${subjects.length} subjects created\n`);

  // ── Calendar Events ──────────────────────────────────────
  console.log('Creating calendar events...');
  const events = [
    { title: 'Independence Day Celebration', eventType: 'EVENT' as const, dateOffset: 30 },
    { title: 'First Term Exams Begin', eventType: 'EXAM' as const, dateOffset: 45 },
    { title: 'PTA Meeting', eventType: 'MEETING' as const, dateOffset: 10 },
    { title: 'Annual Sports Day', eventType: 'SPORTS' as const, dateOffset: 60 },
    { title: 'Diwali Break', eventType: 'HOLIDAY' as const, dateOffset: 20 },
    { title: 'Science Fair', eventType: 'CULTURAL' as const, dateOffset: 35 },
    { title: 'Parent-Teacher Conference', eventType: 'MEETING' as const, dateOffset: 15 },
    { title: 'Winter Break', eventType: 'HOLIDAY' as const, dateOffset: 90 },
    { title: 'Staff Meeting - Monthly Review', eventType: 'MEETING' as const, dateOffset: 5 },
    { title: 'Annual Day Celebration', eventType: 'EVENT' as const, dateOffset: 120 },
  ];

  const eventColors = ['#2563EB', '#DC2626', '#16A34A', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + ev.dateOffset);

    await prisma.calendarEvent.create({
      data: {
        schoolId: school1.id,
        branchId: branch1.id,
        title: ev.title,
        eventType: ev.eventType,
        eventDate,
        startTime: '09:00 AM',
        endTime: ev.eventType === 'HOLIDAY' ? undefined : '04:00 PM',
        audience: 'ALL',
        color: eventColors[i],
        createdBy: superAdmin.id,
      },
    });
  }

  // Some past events
  const pastEvents = [
    { title: 'Summer Break Ended', eventType: 'HOLIDAY' as const, dateOffset: -10 },
    { title: 'Admission Drive', eventType: 'EVENT' as const, dateOffset: -30 },
    { title: 'Staff Orientation', eventType: 'MEETING' as const, dateOffset: -20 },
  ];

  for (const ev of pastEvents) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + ev.dateOffset);
    await prisma.calendarEvent.create({
      data: {
        schoolId: school1.id,
        title: ev.title,
        eventType: ev.eventType,
        eventDate,
        audience: 'ALL',
        color: '#6B7280',
        createdBy: superAdmin.id,
      },
    });
  }
  console.log(`  ✓ ${events.length + pastEvents.length} calendar events created\n`);

  // ── Announcements ────────────────────────────────────────
  console.log('Creating announcements...');
  const announcements = [
    { title: 'Welcome to the New Academic Year', priority: 'HIGH' as const, status: 'PUBLISHED' as const },
    { title: 'Exam Schedule for First Term', priority: 'URGENT' as const, status: 'PUBLISHED' as const },
    { title: 'School Holiday on Diwali', priority: 'NORMAL' as const, status: 'PUBLISHED' as const },
    { title: 'PTA Meeting on Saturday', priority: 'HIGH' as const, status: 'PUBLISHED' as const },
    { title: 'New Sports Facilities Available', priority: 'LOW' as const, status: 'PUBLISHED' as const },
    { title: 'Uniform Update for Winter Season', priority: 'NORMAL' as const, status: 'DRAFT' as const },
    { title: 'Transport Route Changes', priority: 'HIGH' as const, status: 'PUBLISHED' as const },
    { title: 'Staff Meeting Rescheduled', priority: 'NORMAL' as const, status: 'ARCHIVED' as const },
    { title: 'Annual Day Performance Registration', priority: 'NORMAL' as const, status: 'PUBLISHED' as const },
    { title: 'Canteen Menu Update', priority: 'LOW' as const, status: 'PUBLISHED' as const },
  ];

  const announcementAudiences = ['ALL', 'STUDENTS', 'TEACHERS', 'PARENTS', 'ADMIN'] as const;

  for (let i = 0; i < announcements.length; i++) {
    const ann = announcements[i];
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() - (announcements.length - i) * 3);

    await prisma.announcement.create({
      data: {
        schoolId: school1.id,
        title: ann.title,
        description: `This is an announcement regarding "${ann.title}". Please read and acknowledge.`,
        priority: ann.priority,
        status: ann.status,
        audience: announcementAudiences[i % announcementAudiences.length],
        publishDate,
        expiryDate: ann.status === 'PUBLISHED' ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null,
        createdBy: superAdmin.id,
      },
    });
  }
  console.log(`  ✓ ${announcements.length} announcements created\n`);

  // ── Tasks ────────────────────────────────────────────────
  console.log('Creating tasks...');
  const tasks = [
    { title: 'Complete student admission data entry', priority: 'HIGH' as const, status: 'IN_PROGRESS' as const, assignedTo: 'Admission Office', percentage: 65 },
    { title: 'Prepare quarterly progress reports', priority: 'URGENT' as const, status: 'IN_PROGRESS' as const, assignedTo: 'Academic Department', percentage: 40 },
    { title: 'Update school website with new events', priority: 'MEDIUM' as const, status: 'PENDING' as const, assignedTo: 'IT Department', percentage: 0 },
    { title: 'Conduct teacher training workshop', priority: 'HIGH' as const, status: 'COMPLETED' as const, assignedTo: 'HR Department', percentage: 100 },
    { title: 'Submit annual budget proposal', priority: 'HIGH' as const, status: 'PENDING' as const, assignedTo: 'Finance Department', percentage: 0 },
    { title: 'Organize science exhibition', priority: 'MEDIUM' as const, status: 'IN_PROGRESS' as const, assignedTo: 'Science Department', percentage: 30 },
    { title: 'Renew library subscription', priority: 'LOW' as const, status: 'COMPLETED' as const, assignedTo: 'Librarian', percentage: 100 },
    { title: 'Audit school inventory', priority: 'MEDIUM' as const, status: 'PENDING' as const, assignedTo: 'Administration', percentage: 0 },
    { title: 'Plan annual sports day', priority: 'HIGH' as const, status: 'IN_PROGRESS' as const, assignedTo: 'Sports Department', percentage: 50 },
    { title: 'Update parent contact details', priority: 'LOW' as const, status: 'CANCELLED' as const, assignedTo: 'Admin Office', percentage: 0 },
    { title: 'Implement new grading system', priority: 'HIGH' as const, status: 'PENDING' as const, assignedTo: 'Academic Department', percentage: 0 },
    { title: 'Schedule parent-teacher meetings', priority: 'MEDIUM' as const, status: 'IN_PROGRESS' as const, assignedTo: 'Class Teachers', percentage: 75 },
  ];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (i + 1) * 7);

    await prisma.task.create({
      data: {
        schoolId: school1.id,
        title: task.title,
        description: `Task: ${task.title}. Assigned to ${task.assignedTo}.`,
        assignedTo: task.assignedTo,
        dueDate,
        priority: task.priority,
        status: task.status,
        completionPercentage: task.percentage,
        createdBy: superAdmin.id,
      },
    });
  }
  console.log(`  ✓ ${tasks.length} tasks created\n`);

  // ── Summary ──────────────────────────────────────────────
  const counts = {
    users: await prisma.user.count(),
    schools: await prisma.school.count(),
    branches: await prisma.branch.count(),
    academicYears: await prisma.academicYear.count(),
    classes: await prisma.class.count(),
    sections: await prisma.section.count(),
    subjects: await prisma.subject.count(),
    calendarEvents: await prisma.calendarEvent.count(),
    announcements: await prisma.announcement.count(),
    tasks: await prisma.task.count(),
  };

  console.log('═══════════════════════════════════════');
  console.log('  📊 Seed Summary');
  console.log('═══════════════════════════════════════');
  for (const [key, value] of Object.entries(counts)) {
    console.log(`  ${key.padEnd(18)} ${String(value).padStart(4)}`);
  }
  console.log('═══════════════════════════════════════\n');
  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
