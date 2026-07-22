export type NavSection =
  | "dashboard"
  | "timetable"
  | "classes"
  | "attendance"
  | "assignments"
  | "lessons"
  | "students"
  | "exams"
  | "grading"
  | "communication"
  | "classroom"
  | "resources"
  | "calendar"
  | "reports"
  | "profile"
  | "settings";

export interface TeacherProfile {
  name: string;
  title: string;
  classTeacherOf: string;
  academicYear: string;
  avatarUrl?: string;
  department: string;
  schoolName: string;
}

export interface TimetablePeriod {
  id: string;
  period: number;
  subject: string;
  className: string;
  room: string;
  time: string;
  status: "completed" | "active" | "upcoming" | "break";
  topic: string;
  totalStudents: number;
  presentCount?: number;
}

export interface ClassAttendanceSummary {
  className: string;
  subject: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  status: "completed" | "pending";
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  className: string;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  level: 0 | 1 | 2 | 3 | 4; // 0: <80%, 1: 80-89%, 2: 90-94%, 3: 95-99%, 4: 100%
}

export interface StudentAtRisk {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  attendancePct: number;
  daysAbsent: number;
  lastPresent: string;
  riskReason: string;
  parentContact: string;
  status: "Critical" | "Warning" | "Improving";
}

export interface Assignment {
  id: string;
  title: string;
  className: string;
  subject: string;
  dueDate: string;
  assignedDate: string;
  submittedCount: number;
  totalStudents: number;
  reviewedCount: number;
  avgScore: number;
  status: "Active" | "Pending Review" | "Graded";
}

export interface LessonPlan {
  id: string;
  title: string;
  className: string;
  subject: string;
  date: string;
  status: "Today" | "Upcoming" | "Completed" | "Pending Review";
  objectives: string[];
  duration: string;
  hasResources: boolean;
}

export interface ExamDuty {
  id: string;
  title: string;
  subject: string;
  className: string;
  date: string;
  time: string;
  room: string;
  role: "Invigilator" | "Chief Examiner" | "Paper Evaluator";
  marksStatus: "Pending" | "In Progress" | "Submitted";
  questionPaperStatus: "Ready" | "Draft" | "Pending Approval";
}

export interface StudentInsight {
  id: string;
  name: string;
  className: string;
  type: "Top Performer" | "Needs Improvement" | "Frequent Absentee" | "Discipline Alert" | "Special Needs";
  note: string;
  gpa: number;
  attendancePct: number;
  avatar: string;
}

export interface CommunicationMessage {
  id: string;
  senderName: string;
  senderRole: "Parent" | "Student" | "Teacher" | "Principal";
  avatar: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  category: "Teacher Messages" | "Parent Messages" | "Principal Notices" | "Student Queries";
}

export interface RecentActivityItem {
  id: string;
  type: "attendance" | "assignment" | "homework" | "marks" | "message";
  title: string;
  description: string;
  timeAgo: string;
  iconBg: string;
}
