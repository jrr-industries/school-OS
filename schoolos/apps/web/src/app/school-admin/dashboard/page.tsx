'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, GraduationCap, HeartHandshake, Briefcase,
  ClipboardCheck, CalendarClock, IndianRupee,
  Megaphone, Calendar, Bell, ArrowUpRight, ArrowDownRight,
  ChevronRight, UserPlus, Settings, School, CreditCard,
  BarChart3, TrendingUp, UserCheck, Library, Building2,
  Trophy, HeartPulse, Truck, ChefHat, Wallet, PiggyBank,
  Monitor, Shield, BookOpen, Gauge,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn } from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { SupabaseService } from '@/features/supabase/services/supabase.service';
import type { SchoolData, RecentActivity, Notification } from '@/features/school-admin/types';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; positive: boolean };
  href?: string;
  color?: string;
  loading?: boolean;
}

function StatCard({ title, value, icon: Icon, trend, href, color, loading }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            ) : (
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            )}
            {trend && (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.positive ? 'text-emerald-600' : 'text-red-600'
              )}>
                {trend.positive
                  ? <ArrowUpRight className="h-3 w-3" />
                  : <ArrowDownRight className="h-3 w-3" />
                }
                <span>{trend.value}% from last month</span>
              </div>
            )}
          </div>
          <div className={cn('rounded-xl p-3', color || 'bg-primary/10 text-primary')}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {href && (
          <Link
            href={href}
            className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline group"
          >
            View all <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export default function SchoolAdminDashboard() {
  const { user, schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!schoolId) return;

    const unsubSchool = SupabaseService.subscribe<SchoolData>('schools', schoolId, (data) => {
      if (data) setSchoolData(data);
      setLoading(false);
    });

    const unsubNotifs = SupabaseService.subscribeList<Notification>(
      'notifications', schoolId,
      (items) => setNotifications(items.filter((n) => !n.archived).slice(0, 3)),
    );

    const unsubActivity = SupabaseService.subscribeList<RecentActivity>(
      'recentActivity', schoolId,
      (items) => setActivities(items.slice(0, 5)),
    );

    return () => {
      unsubSchool();
      unsubNotifs();
      unsubActivity();
    };
  }, [schoolId]);

  const isLoading = authLoading || loading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Dashboard</h1>
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name || 'Admin'}! Today is {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Link
            href="/school-admin/principals"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Manage Principal
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
          title="School Name"
          value={schoolData?.name || '-'}
          icon={School}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          loading={isLoading}
        />
        <StatCard
          title="School Type"
          value={schoolData?.type || '-'}
          icon={Building2}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          loading={isLoading}
        />
        <StatCard
          title="Academic Year"
          value={schoolData?.academicYear || '-'}
          icon={CalendarClock}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          loading={isLoading}
        />
        <StatCard
          title="Subscription"
          value="Active"
          icon={CreditCard}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={schoolData?.studentCount?.toLocaleString() || '0'}
          icon={GraduationCap}
          trend={{ value: 8, positive: true }}
          href="/school-admin/users"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          loading={isLoading}
        />
        <StatCard
          title="Total Teachers"
          value={schoolData?.teacherCount?.toLocaleString() || '0'}
          icon={Briefcase}
          trend={{ value: 5, positive: true }}
          href="/school-admin/users"
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          loading={isLoading}
        />
        <StatCard
          title="Total Parents"
          value={schoolData?.parentCount?.toLocaleString() || '0'}
          icon={HeartHandshake}
          href="/school-admin/users"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          loading={isLoading}
        />
        <StatCard
          title="Total Staff"
          value={schoolData?.staffCount?.toLocaleString() || '0'}
          icon={Users}
          href="/school-admin/users"
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance Today"
          value={schoolData ? '94%' : '-'}
          icon={ClipboardCheck}
          trend={{ value: 2, positive: true }}
          color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
          loading={isLoading}
        />
        <StatCard
          title="Fee Collection"
          value={schoolData ? '₹8,45,000' : '-'}
          icon={IndianRupee}
          trend={{ value: 15, positive: true }}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          loading={isLoading}
        />
        <StatCard
          title="Storage Used"
          value="2.4 GB / 10 GB"
          icon={BarChart3}
          color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          loading={isLoading}
        />
        <StatCard
          title="Last Login"
          value={user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}
          icon={UserCheck}
          color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          loading={isLoading}
        />
      </div>

      {/* School Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
                  <Gauge className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">School Health Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">92</span>
                    <span className="text-lg text-muted-foreground">/ 100</span>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 ml-2">Excellent</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on academic performance, attendance, sports, fee collection &amp; infrastructure</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-500">94%</div>
                  <div className="text-[10px] text-muted-foreground">Attendance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">85%</div>
                  <div className="text-[10px] text-muted-foreground">Academics</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">78%</div>
                  <div className="text-[10px] text-muted-foreground">Sports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">92%</div>
                  <div className="text-[10px] text-muted-foreground">Fee Collection</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links - Executive Dashboard Sections */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Executive Dashboard Sections
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[
            { href: '/school-admin/academic-performance', label: 'Academic Performance', icon: Trophy, desc: 'Pass %, grades, subject analysis', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
            { href: '/school-admin/sports', label: 'Sports', icon: HeartPulse, desc: 'Medals, coaches, competitions', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
            { href: '/school-admin/bus-management', label: 'School Bus', icon: Truck, desc: 'Routes, GPS, fuel, maintenance', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
            { href: '/school-admin/lunch-management', label: 'Lunch Management', icon: ChefHat, desc: 'Menu, nutrition, food waste', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
            { href: '/school-admin/fee-dashboard', label: 'Fee Dashboard', icon: Wallet, desc: 'Collection, pending, scholarships', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
            { href: '/school-admin/salary', label: 'Salary/Payroll', icon: PiggyBank, desc: 'Teacher/staff salaries, PF, ESI', color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400' },
            { href: '/school-admin/finance', label: 'Finance', icon: BarChart3, desc: 'Income, expenses, P&L', color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400' },
            { href: '/school-admin/library-dashboard', label: 'Library', icon: BookOpen, desc: 'Books, issued, overdue, fines', color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400' },
            { href: '/school-admin/facilities', label: 'Facilities', icon: Monitor, desc: 'Labs, CCTV, internet, maintenance', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
            { href: '/school-admin/hr-dashboard', label: 'HR', icon: Users, desc: 'Recruitment, leaves, performance', color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
            { href: '/school-admin/security-dashboard', label: 'Security', icon: Shield, desc: 'Visitors, gate passes, incidents', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
            { href: '/school-admin/calendar', label: 'Calendar', icon: Calendar, desc: 'Events, exams, holidays, birthdays', color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400' },
          ].map((section) => (
            <Link key={section.href} href={section.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 hover:border-primary/30 cursor-pointer"
              >
                <div className={cn('rounded-lg p-2.5 shrink-0', section.color)}>
                  <section.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{section.label}</p>
                  <p className="text-xs text-muted-foreground">{section.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 ml-auto" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <Badge variant={n.priority === 'urgent' ? 'destructive' : n.priority === 'high' ? 'default' : 'secondary'} className="mb-1">
                            {n.priority.charAt(0).toUpperCase() + n.priority.slice(1)}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                      </div>
                    ))}
                    <Link href="/school-admin/notifications" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      View all notifications <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Megaphone className="h-8 w-8 mb-2" />
                    <p className="text-sm">No announcements</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { day: 15, month: 'Jul', title: 'Parent-Teacher Meeting', detail: '10:00 AM - Auditorium' },
                    { day: 18, month: 'Jul', title: 'Science Exhibition', detail: '9:00 AM - Science Block' },
                    { day: 22, month: 'Jul', title: 'Staff Meeting', detail: '2:00 PM - Conference Room' },
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                        <span className="text-xs font-bold">{event.day}</span>
                        <span className="text-[8px] uppercase">{event.month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                School Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schoolData ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1 rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Board</p>
                    <p className="text-sm font-semibold">{schoolData.board || '-'}</p>
                  </div>
                  <div className="space-y-1 rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Principal</p>
                    <p className="text-sm font-semibold">{schoolData.principalName || '-'}</p>
                  </div>
                  <div className="space-y-1 rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-semibold">{schoolData.phone || '-'}</p>
                  </div>
                  <div className="space-y-1 rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-semibold truncate">{schoolData.email || '-'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-2 text-sm group">
                      <div className={cn(
                        'h-2 w-2 mt-1.5 rounded-full shrink-0',
                        activity.type === 'create' ? 'bg-emerald-500' :
                        activity.type === 'update' ? 'bg-blue-500' :
                        activity.type === 'delete' ? 'bg-red-500' :
                        activity.type === 'login' ? 'bg-purple-500' :
                        'bg-slate-400'
                      )} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Library className="h-4 w-4 text-muted-foreground" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-muted-foreground">Students per Teacher</span>
                  <span className="font-medium">{schoolData?.teacherCount ? Math.round(schoolData.studentCount / schoolData.teacherCount) : '-'}:1</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-muted-foreground">School Code</span>
                  <span className="font-medium">{schoolData?.code || '-'}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
                    {schoolData?.status || 'Active'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
