export interface SchoolAdminUser {
  uid: string;
  email: string;
  name: string;
  photo?: string;
  phone?: string;
  role: 'school_admin' | 'principal' | 'vice_principal' | 'teacher' | 'office_staff' | 'accountant' | 'receptionist' | 'librarian' | 'driver' | 'security' | 'student' | 'parent';
  status: 'active' | 'inactive' | 'suspended';
  schoolId: string;
  createdAt: string;
  lastLogin?: string;
  createdBy?: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export interface SchoolData {
  schoolId: string;
  name: string;
  code: string;
  board: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  principalId?: string;
  academicYear: string;
  timezone: string;
  language: string;
  theme: string;
  status: 'active' | 'inactive' | 'suspended';
  logo?: string;
  banner?: string;
  studentCount: number;
  teacherCount: number;
  parentCount: number;
  staffCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PrincipalData {
  id: string;
  schoolId: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'invited';
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalStaff: number;
  attendanceToday: number;
  feeCollection: number;
  pendingFees: number;
  storageUsed: number;
  lastLogin: string;
}

export interface UserProfile {
  uid: string;
  schoolId: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  employeeId?: string;
  admissionNumber?: string;
  lastLogin?: string;
  createdAt: string;
  createdBy?: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export interface AuditLogEntry {
  id: string;
  schoolId: string;
  action: string;
  performedBy: string;
  performedByUid: string;
  target?: string;
  targetUid?: string;
  details?: string;
  ipAddress?: string;
  device?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  schoolId: string;
  title: string;
  message: string;
  type: 'announcement' | 'emergency' | 'holiday' | 'system';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  targetRole: 'all' | 'teachers' | 'staff' | 'principal';
  createdBy: string;
  createdAt: string;
  read: boolean;
  archived: boolean;
}

export interface SubscriptionData {
  plan: 'free' | 'basic' | 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  startDate: string;
  endDate: string;
  renewDate?: string;
  storageLimit: number;
  storageUsed: number;
  userLimit: number;
  features: string[];
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
}

export interface SchoolSettings {
  schoolId: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  board: string;
  schoolType: string;
  principalName: string;
  academicYear: string;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  logo?: string;
  banner?: string;
  notificationSettings: Record<string, boolean>;
  attendanceSettings: Record<string, unknown>;
  examSettings: Record<string, unknown>;
  feeSettings: Record<string, unknown>;
  transportSettings: Record<string, unknown>;
  librarySettings: Record<string, unknown>;
  updatedAt: string;
  updatedBy: string;
}

export interface AnalyticsData {
  studentGrowth: { month: string; count: number }[];
  teacherGrowth: { month: string; count: number }[];
  attendanceTrend: { date: string; percentage: number }[];
  feeCollection: { month: string; amount: number }[];
  activeUsers: { date: string; count: number }[];
  dailyLogins: { date: string; count: number }[];
  monthlyLogins: { month: string; count: number }[];
  storageUsage: { category: string; size: number }[];
  subscriptionUsage: { feature: string; used: number; limit: number }[];
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'suspend' | 'activate';
}

export type EmployeeStatus = 'active' | 'inactive' | 'suspended' | 'resigned' | 'terminated';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'probation' | 'intern';

export interface Designation {
  id: string;
  title: string;
  slug: string;
  hierarchyLevel: number;
  isTeaching: boolean;
}

export interface Department {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  schoolId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  qualification: string;
  experience: number;
  designationId: string;
  designation: Designation;
  departmentId: string;
  department: Department;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  isClassTeacher: boolean;
  joiningDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId?: string;
  employmentType: EmploymentType;
  designationId: string;
  departmentId: string;
  joiningDate: string;
  status: EmployeeStatus;
  schoolId: string;
  createdBy?: string;
}
