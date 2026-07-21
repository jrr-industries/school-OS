'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Award, Users, BookOpen, AlertTriangle,
  BarChart3, PieChart as PieChartIcon, School, GraduationCap,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button, cn,
} from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { SupabaseService } from '@/features/supabase/services/supabase.service';
import { PageHeader } from '@/features/school-admin/components/page-header';


const PIE_COLORS = ['hsl(var(--primary))', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const SAMPLE_DATA = {
  overallAverage: 78.4,
  passPercentage: 86.2,
  totalStudents: 1240,
  topClass: { name: 'X-A', average: 92.1, students: 38 },
  topStudents: [
    { name: 'Ananya Sharma', class: 'X-A', percentage: 98.5 },
    { name: 'Rohan Mehta', class: 'X-B', percentage: 97.2 },
    { name: 'Priya Singh', class: 'X-A', percentage: 96.8 },
    { name: 'Arjun Patel', class: 'X-C', percentage: 95.9 },
    { name: 'Isha Verma', class: 'IX-A', percentage: 95.1 },
  ],
  subjectPerformance: [
    { name: 'Mathematics', score: 82, total: 100, students: 1240 },
    { name: 'Science', score: 79, total: 100, students: 1240 },
    { name: 'English', score: 88, total: 100, students: 1240 },
    { name: 'Social Studies', score: 76, total: 100, students: 1240 },
    { name: 'Hindi', score: 85, total: 100, students: 1240 },
    { name: 'Computer Science', score: 91, total: 100, students: 680 },
  ],
  weakSubjects: [
    { name: 'Social Studies', score: 62, improvement: 'Needs focus on History & Geography' },
    { name: 'Mathematics', score: 68, improvement: 'Algebra & Geometry need attention' },
  ],
  performanceTrend: [
    { month: 'Jan', average: 74, passRate: 82 },
    { month: 'Feb', average: 75, passRate: 83 },
    { month: 'Mar', average: 73, passRate: 81 },
    { month: 'Apr', average: 76, passRate: 84 },
    { month: 'May', average: 78, passRate: 85 },
    { month: 'Jun', average: 80, passRate: 87 },
    { month: 'Jul', average: 79, passRate: 86 },
    { month: 'Aug', average: 81, passRate: 88 },
    { month: 'Sep', average: 78, passRate: 86 },
    { month: 'Oct', average: 80, passRate: 87 },
    { month: 'Nov', average: 82, passRate: 89 },
    { month: 'Dec', average: 84, passRate: 91 },
  ],
  gradeDistribution: [
    { grade: 'A+ (≥90)', count: 186 },
    { grade: 'A (75-89)', count: 445 },
    { grade: 'B (60-74)', count: 372 },
    { grade: 'C (45-59)', count: 161 },
    { grade: 'D (33-44)', count: 62 },
    { grade: 'F (<33)', count: 14 },
  ],
  monthlyComparison: [
    { month: 'Jul', thisYear: 79, lastYear: 74 },
    { month: 'Aug', thisYear: 81, lastYear: 75 },
    { month: 'Sep', thisYear: 78, lastYear: 76 },
    { month: 'Oct', thisYear: 80, lastYear: 73 },
    { month: 'Nov', thisYear: 82, lastYear: 77 },
    { month: 'Dec', thisYear: 84, lastYear: 78 },
  ],
  boardExamResults: {
    appeared: 210,
    passed: 198,
    passPercentage: 94.3,
    distinction: 85,
    firstClass: 72,
  },
  lastUpdated: new Date().toISOString(),
};

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

function StatCard({ title, value, icon: Icon, trend, color, loading }: {
  title: string; value: string; icon: React.ComponentType<{ className?: string }>; trend?: { value: number; positive: boolean }; color: string; loading?: boolean;
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
                <div className="mt-1 h-6 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                <p className="text-lg font-bold">{value}</p>
              )}
              {trend && (
                <div className={cn('flex items-center gap-0.5 text-xs font-medium', trend.positive ? 'text-emerald-600' : 'text-red-600')}>
                  {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {trend.value}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[300px] animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

export default function AcademicPerformancePage() {
  const { schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    const unsub = SupabaseService.subscribeByField<any>('academic', schoolId, 'school_id', schoolId, (fbData) => {
      if (fbData) {
        setData(fbData);
      } else {
        setData(SAMPLE_DATA);
        toast.info('Using sample academic data. Connect Firebase for live data.');
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
        setError(null);
        toast.info('Using sample academic data. Connect Firebase for live data.');
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [schoolId, loading]);

  if (authLoading || loading) return <LoadingSkeleton />;
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Academic Performance" description="Student academic performance analytics" />
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
  const weak = stats.weakSubjects || SAMPLE_DATA.weakSubjects;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Performance"
        description="Student academic performance analytics and insights"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Overall Average" value={`${stats.overallAverage}%`} icon={TrendingUp} trend={{ value: 3.2, positive: true }} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard title="Pass Percentage" value={`${stats.passPercentage}%`} icon={Award} trend={{ value: 2.1, positive: true }} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <StatCard title="Total Students" value={stats.totalStudents?.toLocaleString() || '0'} icon={Users} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
        <StatCard title="Top Class" value={`${stats.topClass?.name || 'X-A'} (${stats.topClass?.average || 92}%)`} icon={GraduationCap} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Performance Trend
              </CardTitle>
              <p className="text-xs text-muted-foreground">Monthly average scores & pass rate</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.performanceTrend || SAMPLE_DATA.performanceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="passGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="average" name="Avg Score" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#avgGradient)" />
                  <Area type="monotone" dataKey="passRate" name="Pass Rate" stroke="#10b981" strokeWidth={2} fill="url(#passGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                Grade Distribution
              </CardTitle>
              <p className="text-xs text-muted-foreground">Student grades breakdown</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.gradeDistribution || SAMPLE_DATA.gradeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="count" nameKey="grade">
                    {(stats.gradeDistribution || SAMPLE_DATA.gradeDistribution).map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {(stats.gradeDistribution || SAMPLE_DATA.gradeDistribution).map((entry: any, i: number) => (
                <div key={entry.grade} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-muted-foreground">{entry.grade}</span>
                  <span className="font-medium">{entry.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Subject Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.subjectPerformance || SAMPLE_DATA.subjectPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} formatter={(value: any) => [`${value}%`, 'Score']} />
                  <Bar dataKey="score" name="Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Weak Subjects Identified
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weak.length > 0 ? (
                <div className="space-y-3">
                  {weak.map((subj: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <TrendingDown className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{subj.name}</p>
                          <Badge variant="destructive" size="sm">{subj.score}%</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{subj.improvement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Award className="h-8 w-8 mb-2" />
                  <p className="text-sm">No weak subjects identified</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                Top Performing Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(stats.topStudents || SAMPLE_DATA.topStudents).length > 0 ? (
                <div className="space-y-2">
                  {(stats.topStudents || SAMPLE_DATA.topStudents).map((student: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-2.5">
                      <div className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                        i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-muted-foreground/30',
                      )}>
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Class {student.class}</p>
                      </div>
                      <Badge variant={i < 3 ? 'default' : 'secondary'}>{student.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mb-2" />
                  <p className="text-sm">No student data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Monthly Comparison (This Year vs Last Year)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyComparison || SAMPLE_DATA.monthlyComparison} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" domain={[60, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="thisYear" name="This Year" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="lastYear" name="Last Year" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <School className="h-4 w-4 text-muted-foreground" />
              Board Exam Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(stats.boardExamResults || SAMPLE_DATA.boardExamResults) ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Appeared</p>
                    <p className="text-xl font-bold">{(stats.boardExamResults || SAMPLE_DATA.boardExamResults).appeared}</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Passed</p>
                    <p className="text-xl font-bold text-emerald-600">{(stats.boardExamResults || SAMPLE_DATA.boardExamResults).passed}</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Pass %</p>
                    <p className="text-xl font-bold">{(stats.boardExamResults || SAMPLE_DATA.boardExamResults).passPercentage}%</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Distinction</p>
                    <p className="text-lg font-bold text-amber-600">{(stats.boardExamResults || SAMPLE_DATA.boardExamResults).distinction}</p>
                  </div>
                  <div className="flex-1 rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">First Class</p>
                    <p className="text-lg font-bold text-blue-600">{(stats.boardExamResults || SAMPLE_DATA.boardExamResults).firstClass}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <School className="h-10 w-10 mb-3" />
                <p className="text-sm font-medium">No Board Exam Data</p>
                <p className="text-xs">Board exam results will appear here when available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
