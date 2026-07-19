'use client';

import { useState } from 'react';
import {
  Building2,
  Users,
  Presentation,
  UserCheck,
  IndianRupee,
  Clock,
  HardDrive,
  HeartPulse,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { PageContainer, PageHeader, StatCard } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartCard, AreaChart, BarChart } from '@/components/charts';
import {
  dashboardStats,
  schoolGrowthData,
  revenueData,
  studentGrowthData,
  attendanceRateData,
  subscriptionOverview,
  recentPayments,
  notifications,
} from '@/mock-data';

function formatCompact(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

function formatCompactNumber(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

function formatPercent(value: number): string {
  return `${value}%`;
}

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here is what is happening across your schools today."
      >
        <Button size="sm" className="h-9 gap-1.5">
          <Clock className="size-3.5" />
          Quick Report
        </Button>
      </PageHeader>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Schools"
          value={dashboardStats.totalSchools}
          icon={Building2}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Total Students"
          value={formatNumber(dashboardStats.totalStudents)}
          icon={Users}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Teachers"
          value={dashboardStats.totalTeachers}
          icon={Presentation}
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="Parents"
          value={formatNumber(dashboardStats.totalParents)}
          icon={UserCheck}
          trend={{ value: 11, positive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${formatNumber(dashboardStats.monthlyRevenue)}`}
          icon={IndianRupee}
          trend={{ value: 14, positive: true }}
        />
        <StatCard
          title="Renewals Due"
          value={dashboardStats.renewalsDue}
          icon={Clock}
          trend={{ value: 8, positive: false }}
        />
        <StatCard
          title="Storage Usage"
          value={`${dashboardStats.storageUsage}%`}
          icon={HardDrive}
          trend={{ value: 3, positive: false }}
        />
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-success/10">
              <HeartPulse className="size-6 text-success" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm text-muted-foreground">Server Status</p>
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {dashboardStats.serverStatus}
                </span>
              </div>
              <p className="text-xs text-muted-foreground/70">All systems operational</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="School Growth" description="Monthly growth across all schools">
          <AreaChart
            data={schoolGrowthData}
            color="#2563EB"
            height={280}
          />
        </ChartCard>
        <ChartCard title="Monthly Revenue" description="Revenue trend (₹)">
          <AreaChart
            data={revenueData}
            color="#06B6D4"
            gradientId="colorRevenue"
            height={280}
            formatValue={(v) => formatCompact(v)}
          />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ChartCard title="Student Growth" description="Enrollment trend this year">
            <BarChart
              data={studentGrowthData}
              color="#8B5CF6"
              height={280}
              formatValue={(v) => formatCompactNumber(v)}
            />
          </ChartCard>
        </div>
        <div className="lg:col-span-3">
          <ChartCard title="Attendance Rate" description="Average daily attendance %">
            <AreaChart
              data={attendanceRateData}
              color="#10B981"
              gradientId="colorAttendance"
              height={280}
              formatValue={(v) => formatPercent(v)}
            />
          </ChartCard>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Subscription Overview" description="Current plan distribution">
          <div className="flex flex-col gap-3 pt-2">
            {subscriptionOverview.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium text-foreground">{item.name}</span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.value / subscriptionOverview.reduce((a, b) => a + b.value, 0)) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-sm font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Recent Payments" description="Latest school subscription payments">
          <div className="divide-y divide-border/40">
            {recentPayments.slice(0, 6).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{payment.school}</span>
                  <span className="text-xs text-muted-foreground/70">{payment.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    ₹{formatNumber(payment.amount)}
                  </span>
                  <Badge
                    variant={
                      payment.status === 'paid'
                        ? 'success'
                        : payment.status === 'pending'
                          ? 'warning'
                          : 'destructive'
                    }
                    className="h-6 gap-1 px-2 text-[10px]"
                  >
                    {payment.status === 'paid' && <CheckCircle2 className="size-2.5" />}
                    {payment.status === 'pending' && <Clock className="size-2.5" />}
                    {payment.status === 'overdue' && <AlertCircle className="size-2.5" />}
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full text-xs text-muted-foreground">
            View all payments
          </Button>
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard title="Recent Notifications" description="Latest system updates">
          <div className="divide-y divide-border/40">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div
                  className={cn(
                    'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg',
                    n.type === 'info' && 'bg-primary/10 text-primary',
                    n.type === 'warning' && 'bg-warning/10 text-warning',
                    n.type === 'error' && 'bg-destructive/10 text-destructive',
                    n.type === 'success' && 'bg-success/10 text-success',
                  )}
                >
                  <Bell className="size-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground/70">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </PageContainer>
  );
}
