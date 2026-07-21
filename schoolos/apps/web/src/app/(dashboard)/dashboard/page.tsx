'use client';

import { useAuthStore } from '@schoolos/hooks';
import { usePermission } from '@schoolos/hooks';
import { Breadcrumb } from '@/features/dashboard/components/layout/breadcrumb';
import { OverviewStats } from '@/features/dashboard/components/widgets/overview-stats';
import { AttendanceSummary } from '@/features/dashboard/components/widgets/attendance-summary';
import { FeeOverview } from '@/features/dashboard/components/widgets/fee-overview';
import { BirthdayList } from '@/features/dashboard/components/widgets/birthday-list';
import { TaskCenter } from '@/features/dashboard/components/widgets/task-center';
import { SystemHealth } from '@/features/dashboard/components/widgets/system-health';
import { StudentGrowthChart } from '@/features/dashboard/components/charts/student-growth-chart';
import { GenderDistributionChart } from '@/features/dashboard/components/charts/gender-distribution-chart';
import { AttendanceTrendChart } from '@/features/dashboard/components/charts/attendance-trend-chart';
import { FeeCollectionChart } from '@/features/dashboard/components/charts/fee-collection-chart';
import { MonthlyRevenueChart } from '@/features/dashboard/components/charts/monthly-revenue-chart';
import { ClassStrengthChart } from '@/features/dashboard/components/charts/class-strength-chart';
import { ExamPerformanceChart } from '@/features/dashboard/components/charts/exam-performance-chart';
import { HomeworkCompletionChart } from '@/features/dashboard/components/charts/homework-completion-chart';
import { RecentActivityWidget } from '@/features/dashboard/components/activity/recent-activity';
import { DashboardCalendar } from '@/features/dashboard/components/calendar/dashboard-calendar';
import { QuickActions } from '@/features/dashboard/components/quick-actions/quick-actions';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name?.split(' ')[0] ?? 'User'}
          </p>
        </div>
      </div>

      <Breadcrumb />

      <OverviewStats
        totalStudents={1850}
        totalTeachers={85}
        totalParents={1620}
        totalStaff={45}
        admissionsToday={12}
        studentTrend={{ value: 12, positive: true }}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {usePermission('reports:read') && <StudentGrowthChart />}

          <div className="grid gap-4 sm:grid-cols-2">
            {usePermission('attendance:read') && <AttendanceTrendChart />}
            {usePermission('fees:read') && <FeeCollectionChart />}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {usePermission('reports:read') && <MonthlyRevenueChart />}
            {usePermission('grades:read') && <HomeworkCompletionChart />}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {usePermission('reports:read') && <GenderDistributionChart />}
            {usePermission('classes:read') && <ClassStrengthChart />}
          </div>

          {usePermission('grades:read') && <ExamPerformanceChart />}
        </div>

        <div className="space-y-4">
          {usePermission('attendance:read') && <AttendanceSummary />}
          {usePermission('fees:read') && <FeeOverview />}
          <QuickActions />
          <TaskCenter />
          <BirthdayList />
          <DashboardCalendar />
          <RecentActivityWidget />
          {usePermission('system:logs') && <SystemHealth />}
        </div>
      </div>
    </div>
  );
}
