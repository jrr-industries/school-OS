'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, GraduationCap, HeartHandshake, Briefcase,
  ClipboardCheck, CalendarClock, IndianRupee, PartyPopper,
  Megaphone, Calendar, Package, Library, Bus,
  Bell, ArrowUpRight, ArrowDownRight, ChevronRight,
  Plus, FileText, UserPlus, Settings, BarChart3, MessageSquare
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn } from '@schoolos/ui';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; positive: boolean };
  href?: string;
  color?: string;
}

function StatCard({ title, value, icon: Icon, trend, href, color }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.positive ? 'text-emerald-600' : 'text-red-600'
              )}>
                {trend.positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                <span>{trend.value}% from last month</span>
              </div>
            )}
          </div>
          <div className={cn(
            'rounded-lg p-3',
            color || 'bg-primary/10 text-primary'
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {href && (
          <Link
            href={href}
            className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

interface WidgetCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

function WidgetCard({ title, icon: Icon, children, className }: WidgetCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

const recentActivities: Activity[] = [
  { id: '1', user: 'John Doe', action: 'created a new', target: 'student admission', time: '2 min ago' },
  { id: '2', user: 'Jane Smith', action: 'updated', target: 'fee structure', time: '15 min ago' },
  { id: '3', user: 'Admin', action: 'approved', target: 'leave request for Sarah', time: '1 hour ago' },
  { id: '4', user: 'HR Team', action: 'added', target: 'new teacher profile', time: '2 hours ago' },
  { id: '5', user: 'John Doe', action: 'marked', target: 'attendance for Class 10A', time: '3 hours ago' },
  { id: '6', user: 'Accountant', action: 'generated', target: 'monthly fee report', time: '5 hours ago' },
];

export default function SchoolAdminDashboard() {
  const [activities] = useState<Activity[]>(recentActivities);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening at your school today.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Link
            href="/school-admin/staff/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Staff
          </Link>
          <Link
            href="/school-admin/settings"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value="1,250"
          icon={GraduationCap}
          trend={{ value: 8, positive: true }}
          href="/school-admin/students"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title="Total Teachers"
          value="85"
          icon={Briefcase}
          trend={{ value: 5, positive: true }}
          href="/school-admin/teachers"
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatCard
          title="Total Parents"
          value="980"
          icon={HeartHandshake}
          href="/school-admin/parents"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
        <StatCard
          title="Total Staff"
          value="45"
          icon={Users}
          trend={{ value: 2, positive: true }}
          href="/school-admin/staff"
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance Today"
          value="94%"
          icon={ClipboardCheck}
          trend={{ value: 2, positive: true }}
          color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
        />
        <StatCard
          title="Today's Classes"
          value="42"
          icon={CalendarClock}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <StatCard
          title="Pending Admissions"
          value="18"
          icon={ClipboardCheck}
          trend={{ value: 12, positive: false }}
          color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
        />
        <StatCard
          title="Pending Leave"
          value="7"
          icon={FileText}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Fee Collection"
          value="₹8,45,000"
          icon={IndianRupee}
          trend={{ value: 15, positive: true }}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="Pending Fees"
          value="₹1,20,000"
          icon={IndianRupee}
          trend={{ value: 5, positive: false }}
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        />
        <StatCard
          title="Birthdays Today"
          value="3"
          icon={PartyPopper}
          color="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
        />
        <StatCard
          title="Inventory Alerts"
          value="5"
          icon={Package}
          href="/school-admin/inventory"
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <WidgetCard title="Announcements" icon={Megaphone}>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={i === 1 ? 'default' : 'secondary'} className="mb-1">
                        {i === 1 ? 'Urgent' : i === 2 ? 'General' : 'Update'}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{i * 2}h ago</span>
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {i === 1 ? 'Parent-Teacher Meeting on Saturday' :
                       i === 2 ? 'Annual Sports Day Registrations Open' :
                       'Holiday Notice: School Closed on Monday'}
                    </p>
                  </div>
                ))}
                <Link href="/school-admin/communication/announcements" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View all announcements <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </WidgetCard>

            <WidgetCard title="Upcoming Events" icon={Calendar}>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                      <span className="text-xs font-bold">{15 + i}</span>
                      <span className="text-[8px] uppercase">Jul</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {i === 1 ? 'Science Exhibition' :
                         i === 2 ? 'Staff Meeting' :
                         'Cultural Fest'}
                      </p>
                      <p className="text-xs text-muted-foreground">10:00 AM - Auditorium</p>
                    </div>
                  </div>
                ))}
                <Link href="/school-admin/calendar" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View full calendar <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </WidgetCard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Library Books</p>
                  <p className="text-2xl font-bold">3,250</p>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" /> 120 new this month
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Transport Routes</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">8 buses active</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Hostel Capacity</p>
                  <p className="text-2xl font-bold">180/250</p>
                  <p className="text-xs text-muted-foreground">72% occupancy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <WidgetCard title="Quick Actions" icon={Plus}>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/school-admin/staff/create" className="flex flex-col items-center gap-1 rounded-lg border p-3 text-xs hover:bg-muted transition-colors">
                <UserPlus className="h-5 w-5 text-primary" />
                Add Staff
              </Link>
              <Link href="/school-admin/students/new" className="flex flex-col items-center gap-1 rounded-lg border p-3 text-xs hover:bg-muted transition-colors">
                <GraduationCap className="h-5 w-5 text-primary" />
                Add Student
              </Link>
              <Link href="/school-admin/attendance" className="flex flex-col items-center gap-1 rounded-lg border p-3 text-xs hover:bg-muted transition-colors">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Mark Attendance
              </Link>
              <Link href="/school-admin/communication" className="flex flex-col items-center gap-1 rounded-lg border p-3 text-xs hover:bg-muted transition-colors">
                <MessageSquare className="h-5 w-5 text-primary" />
                Send Notice
              </Link>
            </div>
          </WidgetCard>

          <WidgetCard title="Recent Activities" icon={Bell}>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 text-sm">
                  <div className="h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard title="Library Status" icon={Library}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Books Issued</span>
                <span className="font-medium">145</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overdue</span>
                <span className="font-medium text-red-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium">3,105</span>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Transport Status" icon={Bus}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Buses Active</span>
                <span className="font-medium text-emerald-600">8/8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">On Route</span>
                <span className="font-medium">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Students Transported</span>
                <span className="font-medium">320</span>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
