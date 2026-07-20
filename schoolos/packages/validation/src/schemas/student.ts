import { z } from 'zod';

export const createStudentSchema = z.object({
  campusId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  sectionId: z.string().uuid().optional(),
  academicYearId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  houseId: z.string().uuid().optional(),
  admissionSourceId: z.string().uuid().optional(),
  admissionNumber: z.string().min(1).max(50),
  rollNumber: z.string().max(20).optional(),
  emisNumber: z.string().max(50).optional(),
  udiseNumber: z.string().max(50).optional(),
  firstName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['male', 'female', 'other']),
  bloodGroup: z.enum(['a_positive', 'a_negative', 'b_positive', 'b_negative', 'ab_positive', 'ab_negative', 'o_positive', 'o_negative']).optional(),
  religion: z.string().max(50).optional(),
  nationality: z.string().max(50).optional(),
  motherTongue: z.string().max(50).optional(),
  caste: z.string().max(50).optional(),
  community: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
  aadharNumber: z.string().max(20).optional(),
  passportNumber: z.string().max(20).optional(),
  ssnNumber: z.string().max(20).optional(),
  admissionDate: z.string().datetime(),
  isScholarship: z.boolean().optional(),
  scholarshipDetails: z.string().optional(),
  specialNeeds: z.string().optional(),
  medicalNotes: z.string().optional(),
  tags: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

export const studentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  campusId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  sectionId: z.string().uuid().optional(),
  academicYearId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  houseId: z.string().uuid().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  status: z.enum(['active', 'inactive', 'transferred', 'graduated', 'alumni', 'archived', 'suspended', 'expelled', 'withdrawn']).optional(),
  isArchived: z.coerce.boolean().optional(),
});

export const bulkStudentSchema = z.object({
  studentIds: z.array(z.string().uuid()).min(1),
});

export const promoteStudentSchema = z.object({
  studentIds: z.array(z.string().uuid()).min(1),
  fromClassId: z.string().uuid(),
  toClassId: z.string().uuid(),
  fromSectionId: z.string().uuid().optional(),
  toSectionId: z.string().uuid().optional(),
  academicYearId: z.string().uuid(),
  status: z.enum(['promoted', 'demoted', 'repeated', 'skipped']).default('promoted'),
  remarks: z.string().optional(),
});

export const transferStudentSchema = z.object({
  studentId: z.string().uuid(),
  toSchoolName: z.string().min(1).max(200),
  toSchoolAddress: z.string().optional(),
  reason: z.string().min(1),
  transferDate: z.string().datetime(),
  remarks: z.string().optional(),
});

export const archiveStudentSchema = z.object({
  studentIds: z.array(z.string().uuid()).min(1),
  reason: z.string().min(1),
});

export const studentDocumentSchema = z.object({
  category: z.enum(['birth_certificate', 'transfer_certificate', 'community_certificate', 'income_certificate', 'medical_certificate', 'passport', 'aadhar', 'mark_sheet', 'photo', 'signature', 'other']),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  fileUrl: z.string().url().optional(),
  mimeType: z.string().max(100).optional(),
  fileSize: z.number().int().optional(),
});

export const studentMedicalSchema = z.object({
  bloodGroup: z.enum(['a_positive', 'a_negative', 'b_positive', 'b_negative', 'ab_positive', 'ab_negative', 'o_positive', 'o_negative']).optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  disabilities: z.string().optional(),
  specialNeeds: z.string().optional(),
  emergencyNotes: z.string().optional(),
  doctorName: z.string().max(100).optional(),
  doctorPhone: z.string().max(20).optional(),
  insuranceProvider: z.string().max(100).optional(),
  insuranceNumber: z.string().max(50).optional(),
});

export const studentAddressSchema = z.object({
  type: z.enum(['permanent', 'communication', 'current']),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  district: z.string().max(100).optional(),
  country: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  landmark: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const studentGuardianSchema = z.object({
  parentId: z.string().uuid().optional(),
  relationship: z.enum(['father', 'mother', 'guardian', 'grandfather', 'grandmother', 'uncle', 'aunt', 'sibling', 'other']),
  isEmergency: z.boolean().default(false),
  isPrimary: z.boolean().default(false),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(1).max(20),
  alternatePhone: z.string().max(20).optional(),
  occupation: z.string().max(100).optional(),
  education: z.string().max(100).optional(),
  income: z.number().positive().optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
});

export const createParentSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(1).max(20),
  alternatePhone: z.string().max(20).optional(),
  occupation: z.string().max(100).optional(),
  education: z.string().max(100).optional(),
  income: z.number().positive().optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
});

export const academicYearSchema = z.object({
  name: z.string().min(1).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isCurrent: z.boolean().default(false),
});

export const academicTermSchema = z.object({
  academicYearId: z.string().uuid(),
  name: z.string().min(1).max(100),
  type: z.enum(['semester', 'trimester', 'quarter', 'term']).default('term'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isCurrent: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const campusSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().max(20).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  isMain: z.boolean().default(false),
});

export const classSchema = z.object({
  academicYearId: z.string().uuid(),
  campusId: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  code: z.string().max(20).optional(),
  description: z.string().optional(),
  maxCapacity: z.number().int().positive().default(40),
  sortOrder: z.number().int().default(0),
});

export const sectionSchema = z.object({
  classId: z.string().uuid(),
  name: z.string().min(1).max(100),
  code: z.string().max(20).optional(),
  maxCapacity: z.number().int().positive().default(40),
  roomId: z.string().uuid().optional(),
  classTeacherId: z.string().uuid().optional(),
  sortOrder: z.number().int().default(0),
});

export const subjectSchema = z.object({
  departmentId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  code: z.string().min(1).max(20),
  type: z.enum(['theory', 'practical', 'language', 'elective', 'optional', 'compulsory']).default('compulsory'),
  creditHours: z.number().int().default(0),
  maxMarks: z.number().int().default(100),
  passMarks: z.number().int().default(35),
  isLanguage: z.boolean().default(false),
  isOptional: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(1).max(200),
  relationship: z.string().min(1).max(50),
  phone: z.string().min(1).max(20),
  alternatePhone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  priority: z.number().int().min(1).default(1),
});

export const previousSchoolSchema = z.object({
  previousSchool: z.string().min(1).max(200),
  previousClass: z.string().max(100).optional(),
  previousBoard: z.string().max(100).optional(),
  passedOutYear: z.number().int().optional(),
  percentage: z.number().min(0).max(100).optional(),
  reasonForLeaving: z.string().optional(),
  transferCertificate: z.string().optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type StudentQueryInput = z.infer<typeof studentQuerySchema>;
export type PromoteStudentInput = z.infer<typeof promoteStudentSchema>;
export type TransferStudentInput = z.infer<typeof transferStudentSchema>;
export type ArchiveStudentInput = z.infer<typeof archiveStudentSchema>;
export type StudentDocumentInput = z.infer<typeof studentDocumentSchema>;
export type StudentMedicalInput = z.infer<typeof studentMedicalSchema>;
export type StudentAddressInput = z.infer<typeof studentAddressSchema>;
export type StudentGuardianInput = z.infer<typeof studentGuardianSchema>;
export type CreateParentInput = z.infer<typeof createParentSchema>;
export type AcademicYearInput = z.infer<typeof academicYearSchema>;
export type AcademicTermInput = z.infer<typeof academicTermSchema>;
export type CampusInput = z.infer<typeof campusSchema>;
export type ClassInput = z.infer<typeof classSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type SubjectInput = z.infer<typeof subjectSchema>;
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
export type PreviousSchoolInput = z.infer<typeof previousSchoolSchema>;
