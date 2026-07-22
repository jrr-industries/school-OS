'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserCog,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  UserPlus,
  CalendarPlus,
  ClipboardList,
  Bus,
  FileText,
  CheckSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Avatar } from '@schoolos/ui';

const stats = [
  { title: 'Total Students', value: '1,284', icon: Users, trend: '+12%' },
  { title: 'Total Teachers', value: '86', icon: UserCog, trend: '+4%' },
  { title: "Today's Attendance", value: '94%', icon: Calendar, trend: '+2%' },
  { title: 'Classes Today', value: '48', icon: Clock, trend: '0%' },
];

const quickActions = [
  { name: 'Add Student', icon: UserPlus, color: 'bg-blue-500' },
  { name: 'Add Teacher', icon: UserCog, color: 'bg-green-500' },
  { name: 'Create Timetable', icon: CalendarPlus, color: 'bg-purple-500' },
  { name: 'Schedule Exam', icon: ClipboardList, color: 'bg-orange-500' },
  { name: 'Bus Tracking', icon: Bus, color: 'bg-teal-500' },
  { name: 'Announcement', icon: Bell, color: 'bg-red-500' },
  { name: 'Generate Report', icon: FileText, color: 'bg-indigo-500' },
  { name: 'Approvals', icon: CheckSquare, color: 'bg-pink-500' },
];

const schedule = [
  { time: '08:00 - 08:45', subject: 'Mathematics', class: '10-A', teacher: 'Mr. Sharma' },
  { time: '08:45 - 09:30', subject: 'Physics', class: '10-B', teacher: 'Ms. Patel' },
  { time: '09:30 - 10:15', subject: 'Chemistry', class: '10-A', teacher: 'Dr. Rao' },
  { time: '10:15 - 10:30', subject: 'Break', class: 'All', teacher: '-' },
  { time: '10:30 - 11:15', subject: 'English', class: '10-B', teacher: 'Ms. Singh' },
  { time: '11:15 - 12:00', subject: 'History', class: '10-A', teacher: 'Mr. Kumar' },
];

const notifications = [
  { type: 'alert', message: 'Teacher leave request pending approval', time: '5 min ago', icon: AlertCircle, color: 'text-destructive' },
  { type: 'success', message: 'Timetable published for next week', time: '15 min ago', icon: CheckCircle, color: 'text-emerald-500' },
  { type: 'info', message: 'Exam schedule updated for grade 10', time: '1 hour ago', icon: Info, color: 'text-blue-500' },
  { type: 'alert', message: 'Bus #3 delayed by 10 minutes', time: '2 hours ago', icon: AlertCircle, color: 'text-amber-500' },
];

const activities = [
  { user: 'Mr. Sharma', action: 'marked attendance for 10-A', time: '08:15 AM' },
  { user: 'Ms. Patel', action: 'submitted lesson plan', time: '09:30 AM' },
  { user: 'Dr. Rao', action: 'scheduled parent meeting', time: '10:45 AM' },
  { user: 'Mr. Kumar', action: 'reported discipline issue', time: '11:20 AM' },
  { user: 'Ms. Singh', action: 'updated exam marks', time: '12:10 PM' },
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function VicePrincipalDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCalDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCalDate(new Date(year, month + 1, 1));
  const monthName = calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  {stat.trend} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live School Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Attendance</span>
                <Badge variant="secondary">94%</Badge>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: '94%' }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                {[
                  { label: 'Present', value: '1,207' },
                  { label: 'Absent', value: '77' },
                  { label: 'Late', value: '23' },
                  { label: 'Early Leave', value: '12' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={action.name}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors h-auto"
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${action.color} text-white shrink-0`}>
                        <ActionIcon size={14} />
                      </div>
                      <span>{action.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {schedule.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-24 shrink-0">{item.time}</span>
                      <span className="text-sm">{item.subject}</span>
                      {item.class !== 'All' ? (
                        <Badge variant="outline" className="text-xs">{item.class}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">All</span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0 ml-2">{item.teacher}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell size={18} />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notif, index) => {
                  const NotifIcon = notif.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <NotifIcon className={`h-4 w-4 mt-0.5 shrink-0 ${notif.color}`} />
                      <div className="min-w-0">
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <button onClick={prevMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium">{monthName}</span>
                  <button onClick={nextMonth} className="p-1 rounded-md hover:bg-accent transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-0 text-center">
                  {weekDays.map((day) => (
                    <div key={day} className="text-[11px] font-medium text-muted-foreground py-1">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === selectedDay;
                    const isToday = day === new Date().getDate() &&
                      month === new Date().getMonth() &&
                      year === new Date().getFullYear();
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`text-sm py-1 rounded-md transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : isToday
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">School Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 border-b border-border pb-3 last:border-0">
                <Avatar size="sm" fallback={activity.user.split(' ').map(n => n[0]).join('')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
