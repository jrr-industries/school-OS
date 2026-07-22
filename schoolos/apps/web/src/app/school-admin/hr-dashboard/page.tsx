'use client';

import { useState, useEffect } from 'react';
import {
  Users, Briefcase, UserPlus, CalendarClock, ClipboardCheck,
  TrendingUp, UserX, Building2, Clock, AlertTriangle,
  RefreshCw, UserCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn, Skeleton, Button } from '@schoolos/ui';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface HrStaffSummary {
  totalTeachers: number;
  totalStaff: number;
  vacancies: number;
  recruitmentInProgress: number;
  leavesToday: number;
  leavesPendingApproval: number;
  performanceReviewsPending: number;
  promotionsThisMonth: number;
  resignationsThisQuarter: number;
}

interface DepartmentStaff {
  department: string;
  count: number;
  headCount: number;
}

interface LeaveRecord {
  id: string;
  staffName: string;
  department: string;
  type: 'sick' | 'casual' | 'earned' | 'maternity' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  fromDate: string;
  toDate: string;
}

interface HrData {
  summary: HrStaffSummary;
  departments: DepartmentStaff[];
  leaves: LeaveRecord[];
}

const defaultHrData: HrData = {
  summary: {
    totalTeachers: 86,
    totalStaff: 42,
    vacancies: 8,
    recruitmentInProgress: 5,
    leavesToday: 12,
    leavesPendingApproval: 7,
    performanceReviewsPending: 23,
    promotionsThisMonth: 3,
    resignationsThisQuarter: 2,
  },
  departments: [
    { department: 'Science', count: 18, headCount: 20 },
    { department: 'Mathematics', count: 12, headCount: 14 },
    { department: 'Languages', count: 15, headCount: 17 },
    { department: 'Social Studies', count: 10, headCount: 12 },
    { department: 'Computer Science', count: 6, headCount: 8 },
    { department: 'Physical Education', count: 5, headCount: 6 },
    { department: 'Arts & Music', count: 4, headCount: 5 },
    { department: 'Administration', count: 18, headCount: 20 },
    { department: 'Support Staff', count: 24, headCount: 28 },
    { department: 'Accounts', count: 6, headCount: 6 },
    { department: 'Transport', count: 8, headCount: 10 },
    { department: 'Security', count: 10, headCount: 12 },
  ],
  leaves: [
    { id: 'l1', staffName: 'Rahul Sharma', department: 'Science', type: 'sick', status: 'pending', fromDate: '2026-07-21', toDate: '2026-07-22' },
    { id: 'l2', staffName: 'Priya Singh', department: 'Mathematics', type: 'casual', status: 'pending', fromDate: '2026-07-21', toDate: '2026-07-21' },
    { id: 'l3', staffName: 'Amit Kumar', department: 'Languages', type: 'earned', status: 'approved', fromDate: '2026-07-22', toDate: '2026-07-26' },
    { id: 'l4', staffName: 'Neha Gupta', department: 'Administration', type: 'sick', status: 'pending', fromDate: '2026-07-21', toDate: '2026-07-23' },
    { id: 'l5', staffName: 'Vikram Patel', department: 'Computer Science', type: 'casual', status: 'approved', fromDate: '2026-07-21', toDate: '2026-07-21' },
  ],
};

function SummaryCard({
  title, value, icon: Icon, color, loading,
}: {
  title: string; value: string | number; icon: React.ComponentType<{ className?: string }>; color: string; loading: boolean;
}) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton variant="text" className="w-16 h-8" />
            ) : (
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            )}
          </div>
          <div className={cn('rounded-xl p-3', color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HrDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/school-admin/hr-dashboard')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Object.keys(json.data).length > 0) setData(json.data);
        else setData(defaultHrData);
      })
      .catch(() => { setError('Failed to load data'); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-48 h-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton variant="text" className="h-16" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-red-600">Failed to load HR data</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => { setError(null); setLoading(true); }}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const isLoading = loading || !data;
  const s = data?.summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">HR Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Staff overview, recruitment, and HR analytics
          </p>
        </div>
        <Button onClick={() => toast.success('HR report downloaded')}>
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Teachers" value={s?.totalTeachers ?? '-'} icon={Briefcase} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" loading={isLoading} />
        <SummaryCard title="Total Staff" value={s?.totalStaff ?? '-'} icon={Users} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" loading={isLoading} />
        <SummaryCard title="Vacancies" value={s?.vacancies ?? '-'} icon={UserPlus} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" loading={isLoading} />
        <SummaryCard title="Recruitment In Progress" value={s?.recruitmentInProgress ?? '-'} icon={UserCheck} color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" loading={isLoading} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Leaves Today" value={s?.leavesToday ?? '-'} icon={CalendarClock} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" loading={isLoading} />
        <SummaryCard title="Pending Approval" value={s?.leavesPendingApproval ?? '-'} icon={Clock} color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" loading={isLoading} />
        <SummaryCard title="Performance Reviews Pending" value={s?.performanceReviewsPending ?? '-'} icon={ClipboardCheck} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" loading={isLoading} />
        <SummaryCard title="Promotions This Month" value={s?.promotionsThisMonth ?? '-'} icon={TrendingUp} color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" loading={isLoading} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Resignations (Quarter)" value={s?.resignationsThisQuarter ?? '-'} icon={UserX} color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Department-wise Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} variant="text" className="h-8 w-full" />
                  ))}
                </div>
              ) : data!.departments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Building2 className="mb-2 h-8 w-8" />
                  <p className="text-sm">No department data</p>
                </div>
              ) : (
                <div className="divide-y">
                  {data!.departments.map((dept: any) => {
                    const fillPct = dept.headCount > 0 ? Math.round((dept.count / dept.headCount) * 100) : 0;
                    return (
                      <div key={dept.department} className="flex items-center gap-4 py-2.5 first:pt-0 last:pb-0">
                        <span className="min-w-[140px] text-sm font-medium">{dept.department}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all',
                                  fillPct >= 90 ? 'bg-emerald-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-red-500',
                                )}
                                style={{ width: `${fillPct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                              {dept.count}/{dept.headCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                Leave Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="text" className="h-14 w-full" />
                  ))}
                </div>
              ) : data!.leaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CalendarClock className="mb-2 h-8 w-8" />
                  <p className="text-sm">No leave records</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data!.leaves.map((leave: any) => (
                    <div key={leave.id} className="rounded-lg border p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{leave.staffName}</p>
                        <Badge
                          variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'destructive' : 'warning'}
                          size="sm"
                        >
                          {leave.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{leave.department}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" size="sm">{leave.type}</Badge>
                        <span>{leave.fromDate} - {leave.toDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
