export const dashboardStats = {
  totalSchools: 128,
  totalStudents: 24586,
  totalTeachers: 1248,
  totalParents: 21400,
  monthlyRevenue: 1248000,
  renewalsDue: 18,
  storageUsage: 78,
  serverStatus: 'Healthy' as const,
};

export interface MonthlyDataPoint {
  month: string;
  value: number;
}

export const schoolGrowthData: MonthlyDataPoint[] = [
  { month: 'Jan', value: 98 },
  { month: 'Feb', value: 102 },
  { month: 'Mar', value: 105 },
  { month: 'Apr', value: 108 },
  { month: 'May', value: 110 },
  { month: 'Jun', value: 112 },
  { month: 'Jul', value: 115 },
  { month: 'Aug', value: 118 },
  { month: 'Sep', value: 120 },
  { month: 'Oct', value: 122 },
  { month: 'Nov', value: 125 },
  { month: 'Dec', value: 128 },
];

export const revenueData: MonthlyDataPoint[] = [
  { month: 'Jan', value: 820000 },
  { month: 'Feb', value: 910000 },
  { month: 'Mar', value: 1050000 },
  { month: 'Apr', value: 980000 },
  { month: 'May', value: 1120000 },
  { month: 'Jun', value: 1080000 },
  { month: 'Jul', value: 1150000 },
  { month: 'Aug', value: 1200000 },
  { month: 'Sep', value: 1180000 },
  { month: 'Oct', value: 1220000 },
  { month: 'Nov', value: 1248000 },
  { month: 'Dec', value: 1248000 },
];

export const studentGrowthData: MonthlyDataPoint[] = [
  { month: 'Jan', value: 18200 },
  { month: 'Feb', value: 18900 },
  { month: 'Mar', value: 19500 },
  { month: 'Apr', value: 20100 },
  { month: 'May', value: 20800 },
  { month: 'Jun', value: 21500 },
  { month: 'Jul', value: 22100 },
  { month: 'Aug', value: 22800 },
  { month: 'Sep', value: 23400 },
  { month: 'Oct', value: 23900 },
  { month: 'Nov', value: 24300 },
  { month: 'Dec', value: 24586 },
];

export const attendanceRateData: MonthlyDataPoint[] = [
  { month: 'Jan', value: 94 },
  { month: 'Feb', value: 93 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 92 },
  { month: 'May', value: 91 },
  { month: 'Jun', value: 88 },
  { month: 'Jul', value: 90 },
  { month: 'Aug', value: 93 },
  { month: 'Sep', value: 94 },
  { month: 'Oct', value: 95 },
  { month: 'Nov', value: 96 },
  { month: 'Dec', value: 95 },
];

export interface SubscriptionDataPoint {
  name: string;
  value: number;
  color: string;
}

export const subscriptionOverview: SubscriptionDataPoint[] = [
  { name: 'Premium', value: 52, color: '#2563EB' },
  { name: 'Standard', value: 38, color: '#06B6D4' },
  { name: 'Basic', value: 28, color: '#8B5CF6' },
  { name: 'Trial', value: 10, color: '#F59E0B' },
];

export interface RecentPayment {
  id: number;
  school: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

export const recentPayments: RecentPayment[] = [
  { id: 1, school: 'Green Valley School', amount: 45000, status: 'paid', date: '2026-07-18' },
  { id: 2, school: 'DPS International', amount: 35000, status: 'paid', date: '2026-07-17' },
  { id: 3, school: 'Bright Future Academy', amount: 25000, status: 'pending', date: '2026-07-16' },
  { id: 4, school: 'Sunshine Public School', amount: 45000, status: 'paid', date: '2026-07-15' },
  { id: 5, school: 'Oxford Public School', amount: 30000, status: 'overdue', date: '2026-07-10' },
  { id: 6, school: 'Nalanda International', amount: 40000, status: 'paid', date: '2026-07-14' },
  { id: 7, school: 'St. Marys Academy', amount: 28000, status: 'pending', date: '2026-07-13' },
  { id: 8, school: 'Delhi Public School', amount: 52000, status: 'paid', date: '2026-07-12' },
];

export interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export const notifications: Notification[] = [
  { id: 1, message: 'New school registered: Horizon Academy', time: '2 min ago', type: 'info' },
  { id: 2, message: 'Subscription expires in 5 days: Green Valley School', time: '15 min ago', type: 'warning' },
  { id: 3, message: 'Server maintenance scheduled tomorrow at 2 AM', time: '1 hour ago', type: 'warning' },
  { id: 4, message: '3 support tickets pending resolution', time: '2 hours ago', type: 'error' },
  { id: 5, message: 'Monthly backup completed successfully', time: '4 hours ago', type: 'success' },
  { id: 6, message: 'New teacher registrations: 12 this week', time: '6 hours ago', type: 'info' },
  { id: 7, message: 'Fee collection for July is 78% complete', time: '1 day ago', type: 'info' },
  { id: 8, message: 'System update v3.2.1 ready for deployment', time: '1 day ago', type: 'info' },
];
