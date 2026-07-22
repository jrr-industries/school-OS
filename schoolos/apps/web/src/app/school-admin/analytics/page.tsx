'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, Users, GraduationCap, ClipboardCheck, IndianRupee,
  Activity, LogIn, HardDrive, Download, Calendar, ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, cn } from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { toast } from 'sonner';

const dateRanges = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
];

const PIE_COLORS = ['hsl(var(--primary))', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

function ChartSkeleton() {
  return (
    <div className="space-y-3 p-6">
      <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-[250px] animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

function SummaryCard({ title, value, trend, icon: Icon, color }: {
  title: string; value: string; trend?: { value: number; positive: boolean }; icon: React.ComponentType<{ className?: string }>; color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn('rounded-lg p-2.5', color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-lg font-bold">{value}</p>
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
  );
}

function DownloadButton({ chartRef, title }: { chartRef: React.RefObject<HTMLDivElement | null>; title: string }) {
  const handleDownload = useCallback(() => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [chartRef, title]);

  return (
    <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1.5 text-xs">
      <Download className="h-3.5 w-3.5" />
      Download
    </Button>
  );
}

function CustomTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-xs">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}: <span className="font-medium text-foreground">{formatter ? formatter(entry.value) : entry.value}</span></span>
        </div>
      ))}
    </div>
  );
}

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  const studentChartRef = useRef<HTMLDivElement>(null);
  const teacherChartRef = useRef<HTMLDivElement>(null);
  const attendanceChartRef = useRef<HTMLDivElement>(null);
  const feeChartRef = useRef<HTMLDivElement>(null);
  const activeUsersChartRef = useRef<HTMLDivElement>(null);
  const loginsChartRef = useRef<HTMLDivElement>(null);
  const storageChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/school-admin/analytics')
      .then((r) => r.json())
      .then((json) => { if (json.success) setData(json.data); })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const isLoading = loading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="School performance analytics" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const studentGrowth = data?.studentGrowth ?? [];
  const teacherGrowth = data?.teacherGrowth ?? [];
  const attendanceTrend = data?.attendanceTrend ?? [];
  const feeCollection = data?.feeCollection ?? [];
  const activeUsers = data?.activeUsers ?? [];
  const dailyLogins = data?.dailyLogins ?? [];
  const monthlyLogins = data?.monthlyLogins ?? [];
  const storageUsage = data?.storageUsage ?? [];

  const totalStudentGrowth = studentGrowth.length > 1
    ? ((studentGrowth[studentGrowth.length - 1].count - studentGrowth[0].count) / studentGrowth[0].count * 100)
    : 0;
  const avgAttendance = attendanceTrend.length
    ? attendanceTrend.reduce((s: number, d: any) => s + d.percentage, 0) / attendanceTrend.length
    : 0;
  const totalFee = feeCollection.reduce((s: number, d: any) => s + d.amount, 0);
  const avgActiveUsers = activeUsers.length
    ? activeUsers.reduce((s: number, d: any) => s + d.count, 0) / activeUsers.length
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="School performance analytics and insights"
        actions={
          <div className="flex items-center gap-1.5 rounded-lg border p-1 bg-muted/50">
            <Calendar className="h-4 w-4 text-muted-foreground ml-1" />
            {dateRanges.map((r) => (
              <button
                key={r.value}
                onClick={() => setDateRange(r.value)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  dateRange === r.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Student Growth" value={`${totalStudentGrowth > 0 ? '+' : ''}${totalStudentGrowth.toFixed(1)}%`} trend={{ value: Math.abs(Number(totalStudentGrowth.toFixed(1))), positive: totalStudentGrowth >= 0 }} icon={GraduationCap} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <SummaryCard title="Avg Attendance" value={`${avgAttendance.toFixed(1)}%`} trend={{ value: 2.1, positive: true }} icon={ClipboardCheck} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
        <SummaryCard title="Total Fee Collected" value={`₹${(totalFee / 100000).toFixed(2)}L`} trend={{ value: 12.5, positive: true }} icon={IndianRupee} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
        <SummaryCard title="Avg Active Users" value={avgActiveUsers.toFixed(0)} trend={{ value: 5.3, positive: true }} icon={Activity} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Student Growth
              </CardTitle>
              <p className="text-xs text-muted-foreground">Monthly student enrollment trend</p>
            </div>
            <DownloadButton chartRef={studentChartRef} title="Student Growth" />
          </CardHeader>
          <CardContent>
            <div ref={studentChartRef} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studentGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <Tooltip {...chartTooltipStyle} content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#studentGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Teacher Growth
              </CardTitle>
              <p className="text-xs text-muted-foreground">Monthly teacher count</p>
            </div>
            <DownloadButton chartRef={teacherChartRef} title="Teacher Growth" />
          </CardHeader>
          <CardContent>
            <div ref={teacherChartRef} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={teacherGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <Tooltip {...chartTooltipStyle} />
                  <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                Attendance Trend
              </CardTitle>
              <p className="text-xs text-muted-foreground">Daily attendance percentage</p>
            </div>
            <DownloadButton chartRef={attendanceChartRef} title="Attendance Trend" />
          </CardHeader>
          <CardContent>
            <div ref={attendanceChartRef} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" tickFormatter={(v) => `${v}%`} />
                  <Tooltip {...chartTooltipStyle} formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Attendance']} />
                  <Line type="monotone" dataKey="percentage" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                Fee Collection
              </CardTitle>
              <p className="text-xs text-muted-foreground">Monthly fee amounts</p>
            </div>
            <DownloadButton chartRef={feeChartRef} title="Fee Collection" />
          </CardHeader>
          <CardContent>
            <div ref={feeChartRef} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeCollection} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...chartTooltipStyle} formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Active Users
              </CardTitle>
              <p className="text-xs text-muted-foreground">Daily active users</p>
            </div>
            <DownloadButton chartRef={activeUsersChartRef} title="Active Users" />
          </CardHeader>
          <CardContent>
            <div ref={activeUsersChartRef} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeUsers} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activeUsersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fill="url(#activeUsersGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LogIn className="h-4 w-4 text-muted-foreground" />
                Daily Logins
              </CardTitle>
              <p className="text-xs text-muted-foreground">Login activity</p>
            </div>
            <DownloadButton chartRef={loginsChartRef} title="Daily Logins" />
          </CardHeader>
          <CardContent>
            <div ref={loginsChartRef} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyLogins} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <LogIn className="h-4 w-4 text-muted-foreground" />
                Monthly Logins
              </CardTitle>
              <p className="text-xs text-muted-foreground">Monthly login summary</p>
            </div>
            <DownloadButton chartRef={loginsChartRef} title="Monthly Logins" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyLogins} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                Storage Usage
              </CardTitle>
              <p className="text-xs text-muted-foreground">Storage by category</p>
            </div>
            <DownloadButton chartRef={storageChartRef} title="Storage Usage" />
          </CardHeader>
          <CardContent>
            <div ref={storageChartRef} className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageUsage}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    paddingAngle={3} dataKey="size"
                  >
                    {storageUsage.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipStyle} formatter={(value) => [`${Number(value).toFixed(1)} GB`, 'Size']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-bold">{storageUsage.reduce((s: number, d: any) => s + d.size, 0).toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">Total GB</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {storageUsage.map((entry: any, i: number) => (
                <div key={entry.category} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-muted-foreground">{entry.category}</span>
                  <span className="font-medium">{entry.size.toFixed(1)} GB</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
