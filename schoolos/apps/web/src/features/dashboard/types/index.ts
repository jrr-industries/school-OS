export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalStaff: number;
  admissionsToday: number;
  attendanceRate: number;
  feeCollected: number;
  pendingFees: number;
  upcomingExams: number;
  homeworkPending: number;
  assignmentsPending: number;
  birthdaysToday: number;
  busesActive: number;
  libraryCheckouts: number;
  pendingApprovals: number;
  leaveRequests: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  serverStatus: 'online' | 'offline' | 'maintenance';
  subscriptionStatus: 'active' | 'expired' | 'suspended';
  storageUsed: number;
  storageTotal: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface StudentGrowthData extends ChartDataPoint {
  students: number;
}

export interface AdmissionTrendData extends ChartDataPoint {
  admissions: number;
}

export interface AttendanceTrendData extends ChartDataPoint {
  present: number;
  absent: number;
  late: number;
}

export interface FeeCollectionData extends ChartDataPoint {
  collected: number;
  pending: number;
}

export interface RevenueData extends ChartDataPoint {
  revenue: number;
}

export interface GenderDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface ClassStrengthData extends ChartDataPoint {
  strength: number;
  capacity: number;
}

export interface TransportUsageData extends ChartDataPoint {
  students: number;
}

export interface LibraryUsageData extends ChartDataPoint {
  checkouts: number;
  returns: number;
}

export interface HomeworkCompletionData extends ChartDataPoint {
  completed: number;
  pending: number;
}

export interface ExamPerformanceData extends ChartDataPoint {
  average: number;
  passRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'admission' | 'attendance' | 'fee' | 'homework' | 'assignment' | 'transport' | 'communication' | 'audit';
  title: string;
  description: string;
  user: { name: string; avatar?: string };
  timestamp: string;
  status?: 'completed' | 'pending' | 'cancelled';
}

export interface Notification {
  id: string;
  type: 'mention' | 'announcement' | 'emergency' | 'push' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'class' | 'meeting' | 'exam' | 'event' | 'holiday' | 'birthday';
  description?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  permission?: string;
  shortcut?: string;
}

export interface TaskCenterItem {
  id: string;
  type: 'approval' | 'leave' | 'admission' | 'fee' | 'transport' | 'library';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  user: { name: string; avatar?: string };
  timestamp: string;
}

export interface SearchResult {
  id: string;
  type: 'student' | 'teacher' | 'parent' | 'class' | 'fee' | 'report' | 'announcement';
  title: string;
  description: string;
  url: string;
  metadata?: Record<string, string>;
}

export interface NavigationItem {
  name: string;
  href?: string;
  icon: string;
  permission?: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface WidgetConfig {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<any>;
  defaultVisible: boolean;
  defaultOrder: number;
  minWidth?: 'full' | 'half' | 'third' | 'quarter';
  permission?: string;
  layout?: 'wide' | 'tall' | 'default';
}

export interface DashboardConfig {
  widgets: WidgetConfig[];
  layout: 'grid' | 'masonry';
  columns: number;
}
