'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UsersRound,
  UserCheck,
  Clock,
  Bell,
  Calendar,
  Zap,
  UserPlus,
  CalendarPlus,
  MessageSquare,
  FileCheck,
  ArrowUp,
  AlertCircle,
  Bus,
  ClipboardList,
  Settings,
  Plus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface StatCard {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  sub: { text: string; color: string; icon?: React.ComponentType<{ className?: string }> };
}

const statCards: StatCard[] = [
  {
    key: 'students',
    label: 'Total Students',
    icon: Users,
    value: '1,284',
    sub: { text: '+12 this week', color: 'text-emerald-600', icon: ArrowUp },
  },
  {
    key: 'teachers',
    label: 'Teachers',
    icon: UsersRound,
    value: '68',
    sub: { text: '3 on leave today', color: 'text-slate-400' },
  },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: UserCheck,
    value: '94.2%',
    sub: { text: '8 absent', color: 'text-amber-600', icon: AlertCircle },
  },
  {
    key: 'pending',
    label: 'Pending Approvals',
    icon: Clock,
    value: '14',
    sub: { text: '5 leave, 3 events, 6 others', color: 'text-slate-400' },
  },
];

const notifications = [
  {
    id: '1',
    color: 'bg-red-500',
    title: 'Emergency: Fire drill at 2PM',
    time: 'Today, 11:30 AM',
  },
  {
    id: '2',
    color: 'bg-blue-500',
    title: 'Exam schedule published for Grade 10',
    time: 'Yesterday',
  },
  {
    id: '3',
    color: 'bg-amber-500',
    title: '3 staff leave requests pending',
    time: '2 hours ago',
  },
];

const calendarEvents = [
  { date: '22 Jul', event: 'PTA Meeting', time: '4 PM' },
  { date: '24 Jul', event: 'Science Fair', time: '9 AM' },
  { date: '28 Jul', event: 'Staff Training', time: '2 PM' },
];

const quickActions = [
  { label: 'Add Student', icon: UserPlus, color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' },
  { label: 'Exam', icon: CalendarPlus, color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' },
  { label: 'Announce', icon: MessageSquare, color: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
  { label: 'Approvals', icon: FileCheck, color: 'bg-rose-50 hover:bg-rose-100 text-rose-700' },
];

const attendanceData = [
  { label: '1A', value: 98, color: 'bg-emerald-500/70' },
  { label: '2B', value: 94, color: 'bg-emerald-500/60' },
  { label: '3C', value: 82, color: 'bg-amber-500/60' },
  { label: '4A', value: 97, color: 'bg-emerald-500/70' },
  { label: '5B', value: 71, color: 'bg-rose-500/60' },
  { label: '6A', value: 91, color: 'bg-emerald-500/50' },
];

const busData = [
  { route: 'Bus #1 (East)', status: 'On time', color: 'text-emerald-600' },
  { route: 'Bus #2 (West)', status: '5 min late', color: 'text-amber-600' },
  { route: 'Bus #3 (North)', status: 'On time', color: 'text-emerald-600' },
];

const operationsData = [
  { label: 'Lunch', value: 'Veg Biryani' },
  { label: 'Visitors', value: '4 today' },
  { label: 'Maintenance', value: '2 pending' },
  { label: 'Lost & Found', value: '3 items' },
];

const chartData = [10, 16, 8, 20, 14, 24, 12];

export default function PrincipalDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const SubIcon = card.sub.icon;
          return (
            <Card key={card.key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{card.label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-1 text-2xl font-bold">{card.value}</p>
                <p className={`mt-1 text-xs flex items-center gap-1 ${card.sub.color}`}>
                  {SubIcon && <SubIcon className="h-3 w-3" />}
                  {card.sub.text}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">View all</span>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="flex gap-3 text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.color}`} />
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {calendarEvents.map((ev, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-slate-100 pb-1 last:border-0 last:pb-0 dark:border-slate-800"
                  >
                    <span>{ev.date}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{ev.event}</span>
                    <span className="text-muted-foreground">{ev.time}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline">
                <Plus className="h-3 w-3" />
                Add event
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      className={`text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors ${action.color}`}
                    >
                      <Icon className="h-3 w-3" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">School Analytics</CardTitle>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-1 h-28">
              {chartData.map((h, i) => (
                <div
                  key={i}
                  className="w-full rounded-sm bg-indigo-500/70 transition-all hover:bg-indigo-500/90"
                  style={{ height: `${h * 4}px` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Attendance Heatmap (today)</CardTitle>
            <span className="text-xs text-muted-foreground">by class</span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-1">
              {attendanceData.map((a) => (
                <div
                  key={a.label}
                  className={`h-6 rounded text-[9px] text-white flex items-center justify-center ${a.color}`}
                >
                  {a.value}%
                </div>
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground mt-2 flex gap-3">
              {attendanceData.map((a) => (
                <span key={a.label}>● {a.label}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bus className="h-4 w-4" />
                Bus Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              {busData.map((b) => (
                <div key={b.route} className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{b.route}</span>
                  <span className={b.color}>● {b.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Daily Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                {operationsData.map((op) => (
                  <div key={op.label}>
                    <span className="text-muted-foreground">{op.label}</span>
                    <br />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{op.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between">
        <span>© 2026 Principal Dashboard · all modules ready (Academic, Students, Teachers, Exams, Attendance, Communication, Ops, Activities, Reports, Approvals, Settings)</span>
        <span className="flex items-center gap-3">
          <Settings className="h-3 w-3" />
          v2.0
        </span>
      </div>
    </div>
  );
}
