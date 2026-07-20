import { z } from 'zod';

// ── Pagination & Query ─────────────────────────────────────
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional().default(''),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.string().optional().default(''),
  schoolId: z.string().optional().default(''),
  branchId: z.string().optional().default(''),
});

// ── School ──────────────────────────────────────────────────
export const createSchoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters').max(200),
  code: z.string().min(2, 'School code must be at least 2 characters').max(20)
    .regex(/^[A-Z0-9-]+$/, 'School code must contain only uppercase letters, numbers, and hyphens'),
  logo: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  website: z.string().url().optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  country: z.string().max(100).optional().default('India'),
  state: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional().default('ACTIVE'),
  subscriptionPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM', 'TRIAL']).optional().default('TRIAL'),
  subscriptionExpiry: z.string().datetime().optional().nullable(),
  timeZone: z.string().max(50).optional().default('Asia/Kolkata'),
  language: z.string().max(10).optional().default('en'),
});

export const updateSchoolSchema = createSchoolSchema.partial();

// ── Branch ──────────────────────────────────────────────────
export const createBranchSchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  name: z.string().min(2, 'Branch name must be at least 2 characters').max(200),
  code: z.string().min(2, 'Branch code must be at least 2 characters').max(20)
    .regex(/^[A-Z0-9-]+$/, 'Branch code must contain only uppercase letters, numbers, and hyphens'),
  address: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable(),
  principal: z.string().max(200).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export const updateBranchSchema = createBranchSchema.partial();

// ── Academic Year ───────────────────────────────────────────
export const createAcademicYearSchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  branchId: z.string().optional().nullable(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  isCurrent: z.boolean().optional().default(false),
  status: z.enum(['ACTIVE', 'INACTIVE', 'COMPLETED']).optional().default('ACTIVE'),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: 'End date must be after start date', path: ['endDate'] },
);

export const updateAcademicYearSchema = createAcademicYearSchema.partial();

// ── Class ───────────────────────────────────────────────────
export const createClassSchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  branchId: z.string().optional().nullable(),
  academicYearId: z.string().optional().nullable(),
  name: z.string().min(1, 'Class name is required').max(50),
  displayOrder: z.number().int().optional().default(0),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export const updateClassSchema = createClassSchema.partial();

// ── Section ─────────────────────────────────────────────────
export const createSectionSchema = z.object({
  classId: z.string().min(1, 'Class ID is required'),
  name: z.string().min(1, 'Section name is required').max(10),
  capacity: z.number().int().min(1).max(200).optional().default(40),
  roomNumber: z.string().max(20).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export const updateSectionSchema = createSectionSchema.partial();

// ── Subject ─────────────────────────────────────────────────
export const createSubjectSchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  branchId: z.string().optional().nullable(),
  code: z.string().min(1, 'Subject code is required').max(20),
  name: z.string().min(1, 'Subject name is required').max(200),
  shortName: z.string().max(20).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export const updateSubjectSchema = createSubjectSchema.partial();

// ── Calendar Event ──────────────────────────────────────────
export const createCalendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional().nullable(),
  eventType: z.enum(['HOLIDAY', 'EXAM', 'MEETING', 'EVENT', 'SPORTS', 'CULTURAL', 'OTHER']).optional().default('EVENT'),
  eventDate: z.string().datetime('Invalid event date'),
  startTime: z.string().max(10).optional().nullable(),
  endTime: z.string().max(10).optional().nullable(),
  branchId: z.string().optional().nullable(),
  audience: z.enum(['ALL', 'STUDENTS', 'TEACHERS', 'PARENTS', 'ADMIN']).optional().default('ALL'),
  color: z.string().max(10).optional().default('#2563EB'),
  schoolId: z.string().min(1, 'School ID is required'),
});

export const updateCalendarEventSchema = createCalendarEventSchema.partial();

// ── Announcement ────────────────────────────────────────────
export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional().nullable(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional().default('NORMAL'),
  publishDate: z.string().datetime().optional().default(() => new Date().toISOString()),
  expiryDate: z.string().datetime().optional().nullable(),
  audience: z.enum(['ALL', 'STUDENTS', 'TEACHERS', 'PARENTS', 'ADMIN']).optional().default('ALL'),
  attachments: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
  schoolId: z.string().min(1, 'School ID is required'),
  branchId: z.string().optional().nullable(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

// ── Task ────────────────────────────────────────────────────
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  assignedTo: z.string().max(200).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional().default('PENDING'),
  completionPercentage: z.number().int().min(0).max(100).optional().default(0),
  schoolId: z.string().min(1, 'School ID is required'),
  branchId: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();
