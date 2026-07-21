'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  Trophy, Users, UserCheck, Calendar, Medal, Award,
  TrendingUp, Dumbbell, Activity, Target, AlertTriangle,
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button, cn,
} from '@schoolos/ui';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import { PageHeader } from '@/features/school-admin/components/page-header';

const PIE_COLORS = ['#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#ef4444', '#f97316'];

const SAMPLE_DATA = {
  totalStudentsParticipating: 486,
  totalStudents: 1240,
  coaches: 12,
  sportsAvailable: [
    { name: 'Cricket', icon: '🏏', students: 85, coach: 'Rajesh Kumar' },
    { name: 'Football', icon: '⚽', students: 120, coach: 'Suresh Singh' },
    { name: 'Basketball', icon: '🏀', students: 65, coach: 'Amit Sharma' },
    { name: 'Volleyball', icon: '🏐', students: 55, coach: 'Priya Reddy' },
    { name: 'Badminton', icon: '🏸', students: 45, coach: 'Neha Gupta' },
    { name: 'Athletics', icon: '🏃', students: 70, coach: 'Vikram Joshi' },
    { name: 'Swimming', icon: '🏊', students: 30, coach: 'Anil Verma' },
    { name: 'Chess', icon: '♟️', students: 16, coach: 'Meera Iyer' },
  ],
  upcomingCompetitions: [
    { name: 'District Cricket Tournament', date: '2026-08-15', venue: 'City Sports Complex', participants: 11 },
    { name: 'State Level Football Championship', date: '2026-09-05', venue: 'Football Stadium', participants: 16 },
    { name: 'Inter-School Basketball League', date: '2026-09-20', venue: 'School Gymnasium', participants: 10 },
    { name: 'National Badminton Trials', date: '2026-10-01', venue: 'Sports Authority', participants: 4 },
  ],
  medalsWon: [
    { event: 'Cricket', gold: 2, silver: 1, bronze: 3 },
    { event: 'Athletics', gold: 5, silver: 3, bronze: 2 },
    { event: 'Badminton', gold: 1, silver: 2, bronze: 1 },
    { event: 'Swimming', gold: 3, silver: 1, bronze: 0 },
    { event: 'Chess', gold: 0, silver: 2, bronze: 1 },
  ],
  awards: { district: 8, state: 5, national: 2 },
  sportsAttendance: { average: 87, totalSessions: 48, thisMonth: 92 },
  medalDistribution: [
    { name: 'Gold', value: 11, color: '#f59e0b' },
    { name: 'Silver', value: 9, color: '#94a3b8' },
    { name: 'Bronze', value: 7, color: '#d97706' },
  ],
  lastUpdated: new Date().toISOString(),
};

function StatCard({ title, value, icon: Icon, color, loading }: {
  title: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string; loading?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn('rounded-lg p-2.5', color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">{title}</p>
              {loading ? (
                <div className="mt-1 h-6 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                <p className="text-lg font-bold">{value}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-xs">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}: <span className="font-medium text-foreground">{entry.value}</span></span>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[280px] animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

export default function SportsPage() {
  const { schoolId, loading: authLoading } = useFirebaseAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    const unsub = RealtimeService.subscribe<any>(`schools/${schoolId}/analytics/sports`, (fbData) => {
      if (fbData) {
        setData(fbData);
      } else {
        setData(SAMPLE_DATA);
        toast.info('Using sample sports data. Connect Firebase for live data.');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [schoolId]);

  useEffect(() => {
    if (!schoolId) return;
    const timeout = setTimeout(() => {
      if (loading) {
        setData(SAMPLE_DATA);
        setLoading(false);
        toast.info('Using sample sports data. Connect Firebase for live data.');
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [schoolId, loading]);

  if (authLoading || loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sports" description="School sports and athletics management" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Error loading data</h3>
            <p className="text-sm">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => { setData(SAMPLE_DATA); setError(null); toast.info('Using sample data'); }}>
              Use Sample Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data || SAMPLE_DATA;
  const sports = stats.sportsAvailable || SAMPLE_DATA.sportsAvailable;
  const competitions = stats.upcomingCompetitions || SAMPLE_DATA.upcomingCompetitions;
  const medals = stats.medalsWon || SAMPLE_DATA.medalsWon;
  const awards = stats.awards || SAMPLE_DATA.awards;
  const attendance = stats.sportsAttendance || SAMPLE_DATA.sportsAttendance;

  const totalMedals = medals.reduce((s: number, m: any) => s + m.gold + m.silver + m.bronze, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sports"
        description="School sports and athletics management"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Students Participating" value={`${stats.totalStudentsParticipating} / ${stats.totalStudents}`} icon={Users} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard title="Coaches" value={String(stats.coaches)} icon={UserCheck} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <StatCard title="Total Medals Won" value={String(totalMedals)} icon={Trophy} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
        <StatCard title="Sports Attendance" value={`${attendance.average}%`} icon={TrendingUp} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Sports Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sports.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {sports.map((sport: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <span className="text-2xl">{sport.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{sport.name}</p>
                      <p className="text-xs text-muted-foreground">{sport.students} students</p>
                      <p className="text-[10px] text-muted-foreground">Coach: {sport.coach}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Dumbbell className="h-8 w-8 mb-2" />
                <p className="text-sm">No sports configured</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                Awards Won
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg border p-3 text-center">
                  <Medal className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                  <p className="text-xs text-muted-foreground">District</p>
                  <p className="text-xl font-bold">{awards.district}</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <Medal className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                  <p className="text-xs text-muted-foreground">State</p>
                  <p className="text-xl font-bold">{awards.state}</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <Medal className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                  <p className="text-xs text-muted-foreground">National</p>
                  <p className="text-xl font-bold">{awards.national}</p>
                </div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { level: 'District', count: awards.district },
                    { level: 'State', count: awards.state },
                    { level: 'National', count: awards.national },
                  ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="level" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Awards" radius={[4, 4, 0, 0]}>
                      {[
                        { fill: '#f59e0b' }, { fill: '#8b5cf6' }, { fill: '#d97706' },
                      ].map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                Medal Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.medalDistribution || SAMPLE_DATA.medalDistribution} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value" nameKey="name">
                        {(stats.medalDistribution || SAMPLE_DATA.medalDistribution).map((_: any, i: number) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                  {(stats.medalDistribution || SAMPLE_DATA.medalDistribution).map((m: any, i: number) => (
                    <div key={m.name} className="flex items-center gap-1.5 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground">{m.name}</span>
                      <span className="font-medium">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Upcoming Competitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {competitions.length > 0 ? (
                <div className="space-y-3">
                  {competitions.map((comp: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                        <span className="text-xs font-bold">{new Date(comp.date).getDate()}</span>
                        <span className="text-[8px] uppercase">{new Date(comp.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{comp.name}</p>
                        <p className="text-xs text-muted-foreground">{comp.venue}</p>
                        <p className="text-xs text-muted-foreground">{comp.participants} participants</p>
                      </div>
                      <Badge variant="outline" size="sm">{new Date(comp.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mb-2" />
                  <p className="text-sm">No upcoming competitions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Sports Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={medals} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%" layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                    <YAxis type="category" dataKey="event" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="gold" name="Gold" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="silver" name="Silver" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="bronze" name="Bronze" stackId="a" fill="#d97706" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">Avg Attendance</p>
                  <p className="text-lg font-bold">{attendance.average}%</p>
                </div>
                <div className="rounded-lg border p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-lg font-bold text-emerald-600">{attendance.thisMonth}%</p>
                </div>
                <div className="rounded-lg border p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">Sessions</p>
                  <p className="text-lg font-bold">{attendance.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
