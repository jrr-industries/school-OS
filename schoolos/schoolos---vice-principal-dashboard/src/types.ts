export type Severity = 'high' | 'medium' | 'low';
export type UrgentCategory = 'absence' | 'discipline' | 'transport' | 'attendance' | 'complaint' | 'facility';

export interface UrgentActionItem {
  id: string;
  title: string;
  category: UrgentCategory;
  severity: Severity;
  description: string;
  location?: string;
  timeReported: string;
  actionText: string;
  status: 'pending' | 'in_progress' | 'resolved';
  assignee?: string;
  relatedTeacherId?: string;
  relatedStudentId?: string;
  busNumber?: string;
}

export interface TeacherRecord {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  currentClass: string;
  room: string;
  status: 'Present' | 'On Leave' | 'Substitute Assigned' | 'Late' | 'In Observation';
  substituteName?: string;
  workloadPeriods: number;
  phone: string;
  email: string;
}

export interface StudentAlertItem {
  id: string;
  studentName: string;
  gradeClass: string;
  type: 'Late Arrival' | 'Discipline' | 'Medical' | 'Counseling' | 'Parent Meeting';
  details: string;
  timestamp: string;
  severity: Severity;
  status: 'Open' | 'Addressed' | 'Escalated';
  actionNeeded: string;
}

export interface CampusFacility {
  id: string;
  name: string;
  category: 'weather' | 'security' | 'cctv' | 'visitors' | 'gates' | 'utility' | 'transport' | 'kitchen';
  statusText: string;
  isOperational: boolean;
  metric?: string;
  details: string;
  iconName: string;
  lastChecked: string;
}

export interface TimelineActivity {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'attendance' | 'leave' | 'parent' | 'inspection' | 'transport' | 'counseling' | 'discipline' | 'general';
  actor: string;
  statusTag?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  targetAudience: 'All Staff' | 'Teachers' | 'Parents' | 'Students' | 'Emergency';
  author: string;
  isUrgent?: boolean;
}

export interface SyllabusItem {
  grade: string;
  subject: string;
  completionPercentage: number;
  status: 'On Track' | 'Slightly Behind' | 'Ahead';
}

export interface ExamOperationData {
  upcomingExamsCount: number;
  nextExamName: string;
  nextExamDate: string;
  invigilatorsAssigned: string; // e.g. "28 / 28"
  examRoomsReady: string; // e.g. "14 / 14"
  pendingSeatingPlans: number;
  malpracticeReportsToday: number;
  questionPaperStatus: 'Locked & Verified' | 'Pending Audit' | 'In Distribution';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'urgent' | 'info' | 'warning' | 'success';
}

export interface QuickStats {
  classesRunning: number;
  totalClasses: number;
  teachersPresent: number;
  totalTeachers: number;
  studentsPresent: number;
  totalStudents: number;
  lateStudents: number;
  teacherLeaves: number;
  substituteTeachers: number;
  attendanceSubmittedCount: number;
  totalAttendanceClasses: number;
}
