'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, Award, Users, BookOpen, AlertTriangle,
  BarChart3, PieChart as PieChartIcon, School, GraduationCap,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button, cn,
} from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { PageHeader } from '@/features/school-admin/components/page-header';

const PIE_COLORS = ['hsl(var(--primary))', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

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

interface PerformanceData {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  subjectCount: number;
  topClass: { name: string; students: number };
  classList: { name: string; count: number }[];
  subjectPerformance: {
    id: string; name: string; code: string; type: string;
    group: string | null; maxMarks: number; passMarks: number;
    creditHours: number; isLanguage: boolean; isOptional: boolean;
  }[];
  performanceTrend: { month: string; average: number; passRate: number }[];
  gradeDistribution: { grade: string; count: number }[];
  topStudents: { name: string; class: string; percentage: number }[];
  weakSubjects: { name: string; score: number; improvement: string }[];
  boardExamResults: { appeared: number; passed: number; passPercentage: number; distinction: number; firstClass: number } | null;
  lastUpdated: string;
}

export default function AcademicPerformancePage() {
  const { schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    fetch('/api/school-admin/academic-performance')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(json.error || 'Failed to load');
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const overallAverage = useMemo(() => {
    if (!data?.performanceTrend?.length) return '—';
    const avg = data.performanceTrend.reduce((s, m) => s + m.average, 0) / data.performanceTrend.length;
    return `${Math.round(avg)}%`;
  }, [data]);

  const passRate = useMemo(() => {
    if (!data?.performanceTrend?.length) return '—';
    const avg = data.performanceTrend.reduce((s, m) => s + m.passRate, 0) / data.performanceTrend.length;
    return `${Math.round(avg)}%`;
  }, [data]);

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
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return <LoadingSkeleton />;
  }

  const weak = data.weakSubjects || [];
  const topStudents = data.topStudents || [];
  const gradeDist = data.gradeDistribution || [];
  const trend = data.performanceTrend || [];
  const boardExams = data.boardExamResults;
  const subjectPerf = data.subjectPerformance || [];
  const classList = data.classList || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Performance"
        description="Student academic performance analytics and insights"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Overall Average" value={overallAverage} icon={TrendingUp} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard title="Pass Rate" value={passRate} icon={Award} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <StatCard title="Total Students" value={data.totalStudents?.toLocaleString() || '0'} icon={Users} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
        <StatCard title="Top Class" value={`${data.topClass?.name || '—'} (${data.topClass?.students || 0})`} icon={GraduationCap} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Teachers" value={String(data.totalTeachers || 0)} icon={Users} color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" />
        <StatCard title="Classes" value={String(data.totalClasses || 0)} icon={GraduationCap} color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" />
        <StatCard title="Subjects" value={String(data.subjectCount || 0)} icon={BookOpen} color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" />
        <StatCard title="Languages" value={String(subjectPerf.filter((s) => s.isLanguage).length)} icon={BookOpen} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
        <StatCard title="Electives" value={String(subjectPerf.filter((s) => s.isOptional || s.type === 'elective').length)} icon={BookOpen} color="bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" />
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
            {trend.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No trend data available</div>
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
            )}
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
            {gradeDist.length === 0 || gradeDist.every((g) => g.count === 0) ? (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No grade data available</div>
            ) : (
              <>
                <div className="h-[280px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={gradeDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="count" nameKey="grade">
                        {gradeDist.map((_: any, i: number) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  {gradeDist.map((entry: any, i: number) => (
                    <div key={entry.grade} className="flex items-center gap-1.5 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground">{entry.grade}</span>
                      <span className="font-medium">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
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
            {subjectPerf.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">No subject data available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="pb-3 pr-4">Subject</th>
                      <th className="pb-3 pr-4">Code</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3 pr-4 text-center">Max</th>
                      <th className="pb-3 pr-4 text-center">Pass</th>
                      <th className="pb-3 pr-4 text-center">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectPerf.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 pr-4 font-medium">{s.name}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.code}</code></td>
                        <td className="py-2.5 pr-4"><Badge variant="outline" className="text-[10px] capitalize">{s.type}</Badge></td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{s.group || '—'}</td>
                        <td className="py-2.5 pr-4 text-center">{s.maxMarks}</td>
                        <td className="py-2.5 pr-4 text-center">{s.passMarks}</td>
                        <td className="py-2.5 pr-4 text-center">{s.creditHours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                        <TrendingUp className="h-4 w-4 rotate-180" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{subj.name}</p>
                          <Badge variant="destructive">{subj.score}%</Badge>
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
              {topStudents.length > 0 ? (
                <div className="space-y-2">
                  {topStudents.map((student: any, i: number) => (
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
              Class Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {classList.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No class data available</div>
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classList} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
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
            {boardExams ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Appeared</p>
                    <p className="text-xl font-bold">{boardExams.appeared}</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Passed</p>
                    <p className="text-xl font-bold text-emerald-600">{boardExams.passed}</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Pass %</p>
                    <p className="text-xl font-bold">{boardExams.passPercentage}%</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Distinction</p>
                    <p className="text-lg font-bold text-amber-600">{boardExams.distinction}</p>
                  </div>
                  <div className="flex-1 rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">First Class</p>
                    <p className="text-lg font-bold text-blue-600">{boardExams.firstClass}</p>
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
