export interface SchoolInfo {
  name: string;
  code: string;
  principal: {
    name: string;
    title: string;
    avatar: string;
    email: string;
  };
  academicYear: string;
  term: string;
  dateString: string;
  status: 'Open' | 'Closed' | 'Delayed' | 'Emergency';
  totalStudents: number;
  presentStudents: number;
  totalTeachers: number;
  presentTeachers: number;
}

export type ApprovalCategory = 'Leave' | 'Budget' | 'Event' | 'Discipline' | 'Hiring';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'InfoRequested';

export interface PendingApproval {
  id: string;
  title: string;
  category: ApprovalCategory;
  requestedBy: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Urgent';
  amount?: number;
  description: string;
  status: ApprovalStatus;
  department?: string;
}

export interface SchoolKPI {
  id: string;
  label: string;
  value: string | number;
  target?: string | number;
  unit?: string;
  change: string;
  isPositive: boolean;
  trend: number[];
  category: 'Attendance' | 'Staff' | 'Finance' | 'Academic' | 'Transport';
  icon: string;
}

export interface AttendanceRecord {
  day: string;
  grade6: number;
  grade7: number;
  grade8: number;
  grade9: number;
  grade10: number;
  grade11: number;
  grade12: number;
  overall: number;
}

export interface GradeDistribution {
  subject: string;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  gradeF: number;
  avgGPA: number;
}

export interface StudentPerformance {
  id: string;
  name: string;
  grade: string;
  gpa: number;
  attendancePct: number;
  avatar: string;
  achievements: string[];
  status: 'Honor Roll' | 'Regular' | 'At-Risk';
  riskReason?: string;
  parentContact: string;
}

export interface TeacherPerformance {
  id: string;
  name: string;
  department: string;
  classesTaught: string[];
  studentRating: number;
  attendancePct: number;
  avatar: string;
  status: 'Active' | 'On Leave' | 'Substitute Assigned';
}

export interface BusRoute {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  status: 'On-Time' | 'Delayed' | 'Completed' | 'Maintenance';
  studentsCount: number;
  capacity: number;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  eta: string;
  stops: { name: string; time: string; passed: boolean }[];
}

export interface LunchItem {
  id: string;
  category: 'Main' | 'Vegetarian' | 'Soup/Salad' | 'Dessert' | 'Beverage';
  name: string;
  calories: number;
  allergens: string[];
  servedCount: number;
}

export type TimeRange = 'Today' | 'This Week' | 'This Month' | 'Current Term' | 'Academic Year';

export interface ActionCenterItem {
  id: string;
  severity: 'red' | 'orange' | 'yellow' | 'green';
  title: string;
  category: string;
  time: string;
  actionRequired?: string;
}

export interface PrincipalCalendarEvent {
  id: string;
  time: string;
  title: string;
  location?: string;
  day: 'Today' | 'Tomorrow';
  type: 'Meeting' | 'Observation' | 'Review' | 'Inspection' | 'Event';
}

export interface SchoolAlertItem {
  id: string;
  severity: 'red' | 'orange' | 'yellow' | 'green';
  title: string;
  detail: string;
  category: 'Attendance' | 'Transport' | 'Inventory' | 'Facility' | 'Network';
}

export interface ActivityLogItem {
  id: string;
  time: string;
  title: string;
  actor: string;
  type: 'Approval' | 'Admission' | 'Leave' | 'Finance' | 'Attendance' | 'System';
}

export interface AcademicHealth {
  avgGPA: number;
  assignmentsSubmittedPct: number;
  syllabusCompletionPct: number;
  weakSubjects: string[];
}

export interface DepartmentPerf {
  department: string;
  performancePct: number;
  headName: string;
  teachersCount: number;
}

export interface ClassroomStatus {
  total: number;
  active: number;
  maintenance: number;
  closed: number;
  smartBoardsOffline: number;
}

export interface InfrastructureMetric {
  name: string;
  status: 'Normal' | 'Online' | '100%' | 'Ready' | '80%' | 'Warning';
  badgeColor: 'emerald' | 'amber' | 'rose' | 'indigo';
  detail: string;
  icon: string;
}

export interface AdmissionSummary {
  pending: number;
  approved: number;
  rejected: number;
  waitingList: number;
}

export interface InventorySummary {
  labEquipment: string;
  libraryBooks: string;
  sportsEquipment: string;
  itAssets: string;
}

export interface StaffSummary {
  teachers: number;
  adminStaff: number;
  supportStaff: number;
  tempStaff: number;
}

export interface ParentEngagement {
  appActivePct: number;
  unreadNotices: number;
  meetingsScheduled: number;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Administrative';
  organizer: string;
  attendeesCount: number;
}


export interface NoticeItem {
  id: string;
  title: string;
  author: string;
  date: string;
  category: 'Urgent' | 'General' | 'Academic' | 'Transport';
  content: string;
  pinned: boolean;
}
