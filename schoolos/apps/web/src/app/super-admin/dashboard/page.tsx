'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Building2,
  CheckCircle2,
  CreditCard,
  Cpu,
  Globe,
  HardDrive,
  Loader2,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn } from '@schoolos/ui';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface SchoolStatus {
  status: string;
  count: number;
}

interface RecentSchool {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  description: string | null;
  user: { id: string; name: string; email: string };
  createdAt: string;
}

interface DashboardData {
  totalSchools: number;
  totalUsers: number;
  totalPlans: number;
  activeSubscriptions: number;
  schoolsByStatus: SchoolStatus[];
  recentSchools: RecentSchool[];
  recentActivity: ActivityItem[];
}

const statusColors: Record<string, string> = {
  active: '#34d399',
  trial: '#fbbf24',
  inactive: '#64748b',
  suspended: '#f87171',
  closed: '#6b7280',
};

const statusBadgeColors: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  trial: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  inactive: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  suspended: 'bg-red-500/20 text-red-300 border-red-500/30',
  closed: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

function formatTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function actionLabel(action: string, entity: string): string {
  const a: Record<string, string> = {
    create: 'Created', update: 'Updated', delete: 'Deleted', login: 'Login',
    logout: 'Logout', export: 'Exported', import: 'Imported', approve: 'Approved',
    reject: 'Rejected', promote: 'Promoted', transfer: 'Transferred',
    archive: 'Archived', restore: 'Restored', view: 'Viewed',
  };
  const e: Record<string, string> = {
    user: 'User', school: 'School', subscription: 'Subscription', student: 'Student',
    class: 'Class', section: 'Section', subject: 'Subject', fee: 'Payment',
    attendance: 'Attendance', grade: 'Grade', parent: 'Parent',
  };
  return `${a[action] || action} ${e[entity] || entity}`;
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toLocaleString()}{suffix}</>;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
        <p className="font-medium text-slate-200">{payload[0].name}</p>
        <p className="text-slate-400">{payload[0].value} school{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const statCards = [
  { key: 'totalSchools', label: 'Schools', icon: Building2, accent: 'cyan' },
  { key: 'totalUsers', label: 'Users', icon: Users, accent: 'indigo' },
  { key: 'totalPlans', label: 'Plans', icon: CreditCard, accent: 'violet' },
  { key: 'activeSubscriptions', label: 'Active Subs', icon: CheckCircle2, accent: 'emerald' },
  { key: 'activeSchools', label: 'Active Schools', icon: Activity, accent: 'blue' },
  { key: 'trialSchools', label: 'Trial Schools', icon: TrendingUp, accent: 'amber' },
] as const;

const accentMap: Record<string, { border: string; bg: string; text: string; glow: string; iconBg: string }> = {
  cyan: {
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/10',
    iconBg: 'bg-cyan-500/15',
  },
  indigo: {
    border: 'border-indigo-500/20',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    glow: 'shadow-indigo-500/10',
    iconBg: 'bg-indigo-500/15',
  },
  violet: {
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/10',
    iconBg: 'bg-violet-500/15',
  },
  emerald: {
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
    iconBg: 'bg-emerald-500/15',
  },
  blue: {
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/10',
    iconBg: 'bg-blue-500/15',
  },
  amber: {
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/10',
    iconBg: 'bg-amber-500/15',
  },
};

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load');
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const statusData = data?.schoolsByStatus?.map((s) => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count,
    color: statusColors[s.status] || '#64748b',
  })) || [];

  const activeCount = statusData.find((s) => s.name === 'Active')?.value || 0;
  const trialCount = statusData.find((s) => s.name === 'Trial')?.value || 0;

  const values: Record<string, number> = {
    totalSchools: data?.totalSchools ?? 0,
    totalUsers: data?.totalUsers ?? 0,
    totalPlans: data?.totalPlans ?? 0,
    activeSubscriptions: data?.activeSubscriptions ?? 0,
    activeSchools: activeCount,
    trialSchools: trialCount,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-800 border-t-cyan-400" />
            <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-cyan-500/5" />
          </div>
          <p className="text-sm font-medium text-slate-500">Initializing command center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="w-full max-w-md rounded-xl border border-red-500/20 bg-slate-900/80 p-8 text-center backdrop-blur">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <ShieldAlert className="h-7 w-7 text-red-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-200">Connection Error</h3>
          <p className="mb-6 text-sm text-slate-500">{error}</p>
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <Loader2 className="h-4 w-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Grid background overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <Terminal className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-100">Super Admin</h1>
              <p className="text-[10px] font-medium text-slate-500">Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-800/50 bg-slate-900/50 px-3 py-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-[11px] font-medium text-slate-400">All Systems Nominal</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Globe className="h-3.5 w-3.5 text-slate-600" />
            <span className="font-mono">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800/60 pl-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/50 text-[10px] font-bold text-slate-400">
              SA
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <h2 className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Platform Command Center
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cross-tenant health monitoring, revenue tracking, and security oversight.
          </p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate="visible"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            const accent = accentMap[card.accent];
            const value = values[card.key];
            return (
              <motion.div
                key={card.key}
                variants={sectionVariants}
                custom={0}
                className={`rounded-xl border ${accent.border} ${accent.bg} p-4 shadow-sm ${accent.glow} transition-all hover:brightness-110`}
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg ${accent.iconBg} p-2`}>
                    <Icon className={`h-4 w-4 ${accent.text}`} />
                  </div>
                </div>
                <p className="mt-3 font-mono text-2xl font-bold text-slate-100">
                  <AnimatedCounter value={value} />
                </p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Pie chart - Schools by Status */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="lg:col-span-2"
          >
            <Card className="h-full border-slate-800/60 bg-slate-900/60 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <CardTitle className="text-sm font-semibold text-slate-200">
                    Platform Health
                  </CardTitle>
                </div>
                <p className="text-xs text-slate-500">School distribution by status</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 grid w-full grid-cols-2 gap-2">
                    {statusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-400">{item.name}</span>
                        <span className="ml-auto font-mono text-slate-300">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar chart - Schools comparison */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="lg:col-span-3"
          >
            <Card className="h-full border-slate-800/60 bg-slate-900/60 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-400" />
                  <CardTitle className="text-sm font-semibold text-slate-200">
                    Status Breakdown
                  </CardTitle>
                </div>
                <p className="text-xs text-slate-500">Schools grouped by current status</p>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={{ stroke: '#1e293b' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
                        {statusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Schools */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="lg:col-span-1"
          >
            <Card className="h-full border-slate-800/60 bg-slate-900/60 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  <CardTitle className="text-sm font-semibold text-slate-200">
                    Recent Schools
                  </CardTitle>
                </div>
                <p className="text-xs text-slate-500">Newest platform registrations</p>
              </CardHeader>
              <CardContent className="space-y-1">
                {data?.recentSchools && data.recentSchools.length > 0 ? (
                  data.recentSchools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800/40 px-3 py-2.5 transition-colors hover:border-slate-700/60 hover:bg-slate-800/30"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-200">
                          {school.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {school.type} &middot; {formatTime(school.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'ml-2 shrink-0 border text-[10px] font-medium',
                          statusBadgeColors[school.status] || 'border-slate-600 text-slate-400',
                        )}
                      >
                        {school.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-slate-600">No schools registered yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity / Security Log */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={4}
            className="lg:col-span-2"
          >
            <Card className="h-full border-slate-800/60 bg-slate-900/60 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <CardTitle className="text-sm font-semibold text-slate-200">
                    Security & Activity Log
                  </CardTitle>
                </div>
                <p className="text-xs text-slate-500">Recent platform-wide events and changes</p>
              </CardHeader>
              <CardContent className="space-y-0.5">
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                  data.recentActivity.map((entry, idx) => (
                    <div
                      key={entry.id}
                      className="group flex items-start gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-all hover:border-slate-700/50 hover:bg-slate-800/30"
                    >
                      <div className="relative mt-1 flex-shrink-0">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            ['create', 'approve'].includes(entry.action)
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : ['delete', 'reject', 'archive'].includes(entry.action)
                                ? 'bg-red-500/15 text-red-400'
                                : ['login', 'logout'].includes(entry.action)
                                  ? 'bg-blue-500/15 text-blue-400'
                                  : 'bg-slate-500/15 text-slate-400'
                          }`}
                        >
                          {['delete', 'reject', 'archive'].includes(entry.action) ? (
                            <ShieldAlert className="h-3 w-3" />
                          ) : ['login', 'logout'].includes(entry.action) ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <Activity className="h-3 w-3" />
                          )}
                        </div>
                        {idx < data.recentActivity.length - 1 && (
                          <div className="absolute left-1/2 top-7 h-4 w-px -translate-x-1/2 bg-slate-800" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200">
                          {entry.description || actionLabel(entry.action, entry.entity)}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                          <span>{entry.user?.name || entry.user?.email || 'Unknown'}</span>
                          <span className="text-slate-700">&middot;</span>
                          <span>{formatTime(entry.createdAt)}</span>
                          <span className="rounded border border-slate-700/50 px-1.5 py-0.5 text-[10px] text-slate-500">
                            {entry.entity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-slate-600">No recent activity recorded.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Health Footer */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={5}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { label: 'API Latency', value: '24ms', icon: Server, accent: 'text-emerald-400', bar: 'w-3/4' },
            { label: 'Database', value: '98.7%', icon: HardDrive, accent: 'text-cyan-400', bar: 'w-[98%]' },
            { label: 'Cache Hit Rate', value: '92%', icon: Cpu, accent: 'text-indigo-400', bar: 'w-[92%]' },
            { label: 'Uptime', value: '99.99%', icon: Wifi, accent: 'text-emerald-400', bar: 'w-full' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-800/50 bg-slate-900/40 px-4 py-3 backdrop-blur transition-colors hover:border-slate-700/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">{item.label}</span>
                  <Icon className={`h-3.5 w-3.5 ${item.accent}`} />
                </div>
                <p className={`mt-1 font-mono text-lg font-bold ${item.accent}`}>{item.value}</p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">
                  <div className={`h-full rounded-full bg-current opacity-60 ${item.bar} ${item.accent}`} />
                </div>
              </div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
