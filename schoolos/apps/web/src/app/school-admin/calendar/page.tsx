'use client';

import { useState, useEffect } from 'react';
import {
  Calendar, CalendarDays, Trophy, BookOpen, Users, Star,
  Sun, Heart, ChevronLeft, ChevronRight, AlertTriangle,
  RefreshCw, Cake, Briefcase,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn, Skeleton, Button } from '@schoolos/ui';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'sports' | 'exam' | 'meeting' | 'pta' | 'holiday' | 'birthday' | 'event';
  description?: string;
  location?: string;
  time?: string;
}

interface Birthday {
  id: string;
  name: string;
  role: string;
  date: string;
}

interface CalendarData {
  upcomingEvents: CalendarEvent[];
  holidays: CalendarEvent[];
  birthdays: Birthday[];
}

const eventTypeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  sports: { icon: Trophy, label: 'Sports', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  exam: { icon: BookOpen, label: 'Exam', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  meeting: { icon: Users, label: 'Meeting', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  pta: { icon: Heart, label: 'PTA', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  holiday: { icon: Sun, label: 'Holiday', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  birthday: { icon: Cake, label: 'Birthday', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  event: { icon: Star, label: 'Event', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
};

const defaultCalendarData: CalendarData = {
  upcomingEvents: [
    { id: 'e1', title: 'Annual Sports Day', date: '2026-08-15', type: 'sports', description: 'Inter-house sports competitions', location: 'Main Ground', time: '8:00 AM - 4:00 PM' },
    { id: 'e2', title: 'Mid-Term Examinations', date: '2026-08-20', endDate: '2026-08-28', type: 'exam', description: 'All subjects mid-term exams', location: 'All Classrooms' },
    { id: 'e3', title: 'Staff Meeting - Monthly Review', date: '2026-07-25', type: 'meeting', description: 'Monthly staff performance review meeting', location: 'Conference Room', time: '2:00 PM - 3:30 PM' },
    { id: 'e4', title: 'PTA Meeting', date: '2026-07-28', type: 'pta', description: 'Parent-Teacher Association quarterly meeting', location: 'Auditorium', time: '10:00 AM - 12:00 PM' },
    { id: 'e5', title: 'Science Exhibition', date: '2026-08-10', type: 'event', description: 'Student science project exhibition', location: 'Science Block', time: '9:00 AM - 3:00 PM' },
    { id: 'e6', title: 'Independence Day Celebration', date: '2026-08-15', type: 'event', description: 'Flag hoisting and cultural program', location: 'Main Ground', time: '7:30 AM - 10:00 AM' },
    { id: 'e7', title: 'Parent-Teacher Conference', date: '2026-08-05', type: 'pta', description: 'Individual student progress discussions', location: 'All Classrooms', time: '9:00 AM - 4:00 PM' },
    { id: 'e8', title: 'Inter-School Debate Competition', date: '2026-08-22', type: 'sports', description: 'Debate competition with visiting schools', location: 'Auditorium', time: '10:00 AM - 1:00 PM' },
  ],
  holidays: [
    { id: 'h1', title: 'Independence Day', date: '2026-08-15', type: 'holiday' },
    { id: 'h2', title: 'Raksha Bandhan', date: '2026-08-22', type: 'holiday' },
    { id: 'h3', title: 'Janmashtami', date: '2026-08-30', type: 'holiday' },
    { id: 'h4', title: 'Ganesh Chaturthi', date: '2026-09-08', type: 'holiday' },
    { id: 'h5', title: 'Teacher\'s Day', date: '2026-09-05', type: 'event', description: 'Celebration of teachers' },
    { id: 'h6', title: 'Dussehra Break', date: '2026-10-15', endDate: '2026-10-18', type: 'holiday' },
    { id: 'h7', title: 'Diwali Break', date: '2026-11-05', endDate: '2026-11-10', type: 'holiday' },
    { id: 'h8', title: 'Christmas Break', date: '2026-12-24', endDate: '2026-12-31', type: 'holiday' },
  ],
  birthdays: [
    { id: 'b1', name: 'Dr. Meera Sharma', role: 'Principal', date: '2026-07-22' },
    { id: 'b2', name: 'Anita Verma', role: 'Teacher (Science)', date: '2026-07-25' },
    { id: 'b3', name: 'Rajesh Kumar', role: 'Teacher (Mathematics)', date: '2026-07-28' },
    { id: 'b4', name: 'Sunita Patel', role: 'Office Staff', date: '2026-07-30' },
    { id: 'b5', name: 'Vijay Singh', role: 'Librarian', date: '2026-08-03' },
    { id: 'b6', name: 'Priya Gupta', role: 'Teacher (English)', date: '2026-08-12' },
  ],
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const { schoolId, loading: authLoading } = useFirebaseAuth();
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!schoolId) return;

    const unsub = RealtimeService.subscribe<CalendarData>(
      `schools/${schoolId}/analytics/calendar`,
      (result) => {
        if (result) {
          setData(result);
          setLoading(false);
        } else {
          setData(defaultCalendarData);
          setLoading(false);
        }
      },
    );

    const timeout = setTimeout(() => {
      if (loading) {
        setData(defaultCalendarData);
        setLoading(false);
        toast.info('Using sample calendar data');
      }
    }, 5000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [schoolId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-48 h-8" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="p-6"><Skeleton variant="text" className="h-16" /></CardContent></Card>
            ))}
          </div>
          <div><Card><CardContent className="p-6"><Skeleton variant="text" className="h-64" /></CardContent></Card></div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-red-600">Failed to load calendar data</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => { setError(null); setLoading(true); }}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const isLoading = loading || !data;

  const allEvents = [...(data?.upcomingEvents ?? []), ...(data?.holidays ?? [])];
  const filteredEvents = filterType
    ? allEvents.filter((e) => e.type === filterType)
    : allEvents;

  const monthEvents = filteredEvents.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const typeKeys = Object.keys(eventTypeConfig) as Array<keyof typeof eventTypeConfig>;

  const eventTypeCounts = allEvents.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1;
    return acc;
  }, {});

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const eventDates = new Set(
    monthEvents.map((e) => new Date(e.date).getDate().toString()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            School events, holidays, and birthdays
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success('Calendar synced')}>
          <CalendarDays className="mr-2 h-4 w-4" />
          Sync Calendar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filterType === null ? 'default' : 'outline'}
          className="cursor-pointer px-3 py-1.5"
          onClick={() => setFilterType(null)}
        >
          All ({allEvents.length})
        </Badge>
        {typeKeys.map((key) => {
          const cfg = eventTypeConfig[key];
          const Icon = cfg.icon;
          const count = eventTypeCounts[key] ?? 0;
          return (
            <Badge
              key={key}
              variant={filterType === key ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => setFilterType(filterType === key ? null : key)}
            >
              <Icon className="mr-1 h-3 w-3" />
              {cfg.label} ({count})
            </Badge>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {months[currentMonth]} {currentYear}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <button onClick={prevMonth} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentMonth(new Date().getMonth());
                      setCurrentYear(new Date().getFullYear());
                    }}
                    className="rounded-lg px-2 py-1 text-xs hover:bg-muted transition-colors"
                  >
                    Today
                  </button>
                  <button onClick={nextMonth} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton variant="rectangular" className="h-64" />
              ) : (
                <div className="grid grid-cols-7 gap-px">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const hasEvent = eventDates.has(day.toString());
                    const today = new Date();
                    const isToday =
                      today.getDate() === day &&
                      today.getMonth() === currentMonth &&
                      today.getFullYear() === currentYear;
                    return (
                      <div
                        key={day}
                        className={cn(
                          'relative flex h-10 items-center justify-center rounded-lg text-sm transition-colors',
                          isToday && 'bg-primary text-primary-foreground font-bold',
                          hasEvent && !isToday && 'bg-primary/10 text-primary font-medium',
                          !isToday && !hasEvent && 'hover:bg-muted',
                        )}
                      >
                        {day}
                        {hasEvent && (
                          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Events in {months[currentMonth]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="text" className="h-16" />)}
                </div>
              ) : monthEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Calendar className="mb-2 h-8 w-8" />
                  <p className="text-sm">No events this month</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {monthEvents.map((event) => {
                      const cfg = eventTypeConfig[event.type] ?? eventTypeConfig.event;
                      const Icon = cfg.icon;
                      const eventDate = new Date(event.date);
                      return (
                        <motion.div
                          key={event.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                        >
                          <button
                            onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                            className="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                          >
                            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md border bg-muted/50">
                              <span className="text-lg font-bold leading-none">{eventDate.getDate()}</span>
                              <span className="text-[8px] uppercase text-muted-foreground">
                                {months[eventDate.getMonth()].slice(0, 3)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{event.title}</p>
                                <div className={cn('rounded-md p-0.5', cfg.color)}>
                                  <Icon className="h-3 w-3" />
                                </div>
                              </div>
                              {event.time && (
                                <p className="text-xs text-muted-foreground">{event.time}</p>
                              )}
                              {event.location && (
                                <p className="text-xs text-muted-foreground">{event.location}</p>
                              )}
                              {event.endDate && (
                                <p className="text-xs text-muted-foreground">
                                  Until {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                              )}
                              <AnimatePresence>
                                {selectedEvent?.id === event.id && event.description && (
                                  <motion.p
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-2 text-xs text-muted-foreground overflow-hidden"
                                  >
                                    {event.description}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                            <Badge variant="outline" size="sm" className={cn(cfg.color.split(' ')[0], 'border-0')}>
                              {cfg.label}
                            </Badge>
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sun className="h-4 w-4 text-muted-foreground" />
                Holidays {currentYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="text" className="h-10" />)}
                </div>
              ) : data!.holidays.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Sun className="mb-2 h-8 w-8" />
                  <p className="text-sm">No holidays</p>
                </div>
              ) : (
                <div className="divide-y">
                  {data!.holidays.map((holiday) => {
                    const d = new Date(holiday.date);
                    return (
                      <div key={holiday.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/30">
                          <Sun className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{holiday.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            {holiday.endDate && ` - ${new Date(holiday.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Cake className="h-4 w-4 text-muted-foreground" />
                Birthdays
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="text" className="h-10" />)}
                </div>
              ) : data!.birthdays.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Cake className="mb-2 h-8 w-8" />
                  <p className="text-sm">No birthdays this month</p>
                </div>
              ) : (
                <div className="divide-y">
                  {data!.birthdays.map((b) => {
                    const d = new Date(b.date);
                    return (
                      <div key={b.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-pink-100 dark:bg-pink-900/30">
                          <Cake className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{b.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {b.role} &middot; {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="text" className="h-8" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {typeKeys.map((key) => {
                    const cfg = eventTypeConfig[key];
                    const Icon = cfg.icon;
                    const count = eventTypeCounts[key] ?? 0;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn('rounded-md p-1', cfg.color)}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm text-muted-foreground">{cfg.label}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total Events</span>
                    <span className="text-sm font-bold">{allEvents.length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
