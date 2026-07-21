'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  School, Building2, Users, GraduationCap, HeartHandshake,
  Briefcase, CreditCard, IndianRupee, BarChart3, TrendingUp,
  Activity, AlertTriangle, CheckCircle2, ArrowUpRight,
  ArrowDownRight, ChevronRight, RefreshCw, Gauge,
} from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button, cn, Skeleton,
} from '@schoolos/ui';
import {
  useDashboardMetrics,
  useRecentSchools,
  useSchoolStatusDistribution,
  useSubscriptionMetrics,
} from '@/hooks/use-dashboard-realtime';
import { SupabaseRealtime } from '@/lib/supabase-realtime';

// ---------------------------------------------------------------------------
// Inline sample data for visual chart sections (revenue trend, plan labels)
// ---------------------------------------------------------------------------

const MONTHLY_REVENUE_DATA = [
  { month: 'Jan', revenue: 125000 },
  { month: 'Feb', revenue: 140000 },
  { month: 'Mar', revenue: 138000 },
  { month: 'Apr', revenue: 162000 },
  { month: 'May', revenue: 158000 },
  { month: 'Jun', revenue: 184000 },
  { month: 'Jul', revenue: 175000 },
  { month: 'Aug', revenue: 192000 },
  { month: 'Sep', revenue: 210000 },
  { month: 'Oct', revenue: 198000 },
  { month: 'Nov', revenue: 225000 },
  { month: 'Dec', revenue: 240000 },
];

const PLAN_COLORS: Record<string, string> = {
  basic: '#3b82f6',
  standard: '#8b5cf6',
  premium: '#f59e0b',
  enterprise: '#10b981',
};

const STATUS_COLORS: Record<string, string> = {
  active: '#10b981',
  trial: '#3b82f6',
  suspended: '#f59e0b',
  inactive: '#6b7280',
};

const STATUS_BADGE_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'secondary'> = {
  active: 'success',
  trial: 'info',
  suspended: 'warning',
  inactive: 'secondary',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Metric Card Skeleton
// ---------------------------------------------------------------------------

function MetricCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Skeleton variant="text" width={80} height={14} />
          <Skeleton variant="text" width={60} height={28} />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Metric Card
// ---------------------------------------------------------------------------

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const colorMap: Record<string, string> = {
  blue: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950',
  emerald: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950',
  purple: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950',
  amber: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950',
  slate: 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-950',
};

function MetricCard({ title, value, icon: Icon, color, subtitle, trend, trendValue }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {(subtitle || trend) && (
                <div className="flex items-center gap-1.5">
                  {trend && (
                    <span
                      className={cn(
                        'inline-flex items-center text-xs font-medium',
                        trend === 'up' ? 'text-emerald-600' : 'text-red-600',
                      )}
                    >
                      {trend === 'up' ? (
                        <ArrowUpRight className="mr-0.5 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-0.5 h-3 w-3" />
                      )}
                      {trendValue}
                    </span>
                  )}
                  {subtitle && (
                    <span className="text-xs text-muted-foreground">{subtitle}</span>
                  )}
                </div>
              )}
            </div>
            <div className={cn('rounded-lg p-2.5', colorMap[color] || colorMap.blue)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mb-1 text-lg font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------

function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-950">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <p className="mb-1 text-lg font-semibold">Something went wrong</p>
        <p className="mb-4 text-sm text-muted-foreground">
          {message || 'Failed to load data. Please try again.'}
        </p>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Status Distribution Pie
// ---------------------------------------------------------------------------

function StatusDistributionChart({
  data,
  loading,
  error,
  onRetry,
}: {
  data: Record<string, number>;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton variant="text" width={180} height={20} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Skeleton variant="circular" width={160} height={160} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>School Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message="Could not load status distribution." onRetry={onRetry} />
        </CardContent>
      </Card>
    );
  }

  const entries = Object.entries(data);
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>School Status</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No data"
            description="No schools have been created yet."
            icon={BarChart3}
          />
        </CardContent>
      </Card>
    );
  }

  const chartData = entries.map(([name, value]) => ({ name, value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>School Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name] || '#6b7280'}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[entry.name] || '#6b7280' }}
                />
                <span className="capitalize text-muted-foreground">{entry.name}</span>
                <span className="font-semibold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Subscription Overview
// ---------------------------------------------------------------------------

function SubscriptionOverview({
  planDistribution,
  expiringSoon,
  loading,
  error,
  onRetry,
}: {
  planDistribution: Record<string, number>;
  expiringSoon: number;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton variant="text" width={180} height={20} />
          <Skeleton variant="text" width={120} height={14} />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton variant="rectangular" width="100%" height={120} />
          <Skeleton variant="text" width={140} height={14} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message="Could not load subscription data." onRetry={onRetry} />
        </CardContent>
      </Card>
    );
  }

  const planEntries = Object.entries(planDistribution);
  const totalPlans = planEntries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subscription Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Plan distribution across schools
          </p>
        </div>
        {expiringSoon > 0 && (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {expiringSoon} expiring soon
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {planEntries.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No subscriptions found
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={planEntries.map(([name, value]) => ({
                  name,
                  value,
                  fill: PLAN_COLORS[name] || '#6b7280',
                }))}
                layout="vertical"
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={70}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {planEntries.map(([name]) => (
                    <Cell key={name} fill={PLAN_COLORS[name] || '#6b7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active subscriptions</span>
              <span className="font-semibold">{totalPlans}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Trial subscriptions</span>
              <span className="font-semibold">
                {planEntries
                  .filter(([name]) => name.toLowerCase().includes('trial'))
                  .reduce((sum, [, v]) => sum + v, 0)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Recent Schools
// ---------------------------------------------------------------------------

function RecentSchoolsList({
  schools,
  loading,
  error,
  onRetry,
}: {
  schools: { id: string; name: string; type: string; status: string; createdAt: string }[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton variant="text" width={160} height={20} />
          <Skeleton variant="text" width={100} height={14} />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton variant="text" width={140} height={14} />
                <Skeleton variant="text" width={100} height={12} />
              </div>
              <Skeleton variant="rectangular" width={60} height={22} />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message="Could not load recent schools." onRetry={onRetry} />
        </CardContent>
      </Card>
    );
  }

  if (schools.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No schools yet"
            description="Schools will appear here once they are created."
            icon={School}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Schools</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest 5 registered schools
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { window.location.href = '/school-management'; }}
        >
          View all
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {schools.map((school) => (
            <div
              key={school.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{school.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{school.type?.replace(/_/g, ' ')}</span>
                  <span>&middot;</span>
                  <span>{formatDate(school.createdAt)}</span>
                </div>
              </div>
              <Badge
                variant={
                  (STATUS_BADGE_VARIANTS[school.status] as 'success' | 'info' | 'warning' | 'secondary') ||
                  'secondary'
                }
                size="sm"
              >
                {school.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Revenue Overview Card
// ---------------------------------------------------------------------------

function RevenueCard({
  revenue,
  loading,
}: {
  revenue: number;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton variant="text" width={160} height={20} />
          <Skeleton variant="text" width={100} height={14} />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton variant="text" width={120} height={28} />
          <Skeleton variant="rectangular" width="100%" height={160} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Total revenue from subscriptions</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{formatCurrency(revenue)}</span>
          <span className="flex items-center text-sm font-medium text-emerald-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            +12.5%
          </span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={MONTHLY_REVENUE_DATA}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Page
// ---------------------------------------------------------------------------

export default function SuperAdminDashboard() {
  const dashboardMetrics = useDashboardMetrics();
  const { schools, loading: recentLoading } = useRecentSchools();
  const { data: statusData, loading: statusLoading } = useSchoolStatusDistribution();
  const {
    planDistribution,
    expiringSoon,
    loading: subLoading,
  } = useSubscriptionMetrics();

  const [error, setError] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setError(false);
    setRefetchKey((k) => k + 1);
  }, []);

  const metrics = dashboardMetrics;

  // Detect error state (all zero + not loading after initial fetch)
  useEffect(() => {
    if (
      !metrics.loading &&
      metrics.totalSchools === 0 &&
      refetchKey > 0
    ) {
      // Could still be valid empty state; we don't set error for zero counts.
      // Error tracking is delegated to individual sub-components.
    }
  }, [metrics, refetchKey]);

  // Aggregate loading state
  const isLoading = metrics.loading;
  const anyLoading = metrics.loading || recentLoading || statusLoading || subLoading;

  const fadeInVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' },
    }),
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-6"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform overview and key metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {anyLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Syncing...
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={anyLoading}
          >
            <RefreshCw className={cn('mr-2 h-4 w-4', anyLoading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Row 1 – Primary Metrics                                            */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <motion.div variants={fadeInVariants} custom={0}>
              <MetricCard
                title="Total Schools"
                value={metrics.totalSchools}
                icon={School}
                color="blue"
                subtitle="Registered institutions"
              />
            </motion.div>
            <motion.div variants={fadeInVariants} custom={1}>
              <MetricCard
                title="Active Schools"
                value={metrics.activeSchools}
                icon={CheckCircle2}
                color="emerald"
                subtitle="Currently operational"
                trend="up"
                trendValue={`${metrics.activeSchools > 0 ? ((metrics.activeSchools / Math.max(metrics.totalSchools, 1)) * 100).toFixed(0) : 0}%`}
              />
            </motion.div>
            <motion.div variants={fadeInVariants} custom={2}>
              <MetricCard
                title="Total Users"
                value={metrics.totalUsers}
                icon={Users}
                color="purple"
                subtitle="Across all schools"
              />
            </motion.div>
            <motion.div variants={fadeInVariants} custom={3}>
              <MetricCard
                title="Active Subscriptions"
                value={
                  metrics.totalSchools > 0
                    ? `${metrics.activeSubscriptions} / ${metrics.totalSchools}`
                    : '0 / 0'
                }
                icon={CreditCard}
                color="amber"
                subtitle={
                  metrics.totalSchools > 0
                    ? `${((metrics.activeSubscriptions / metrics.totalSchools) * 100).toFixed(1)}% adoption`
                    : 'No schools yet'
                }
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Row 2 – People Metrics                                             */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <motion.div variants={fadeInVariants} custom={0}>
              <MetricCard
                title="Total Students"
                value={metrics.totalStudents}
                icon={GraduationCap}
                color="blue"
                subtitle="Enrolled learners"
              />
            </motion.div>
            <motion.div variants={fadeInVariants} custom={1}>
              <MetricCard
                title="Total Teachers"
                value={metrics.totalTeachers}
                icon={Briefcase}
                color="emerald"
                subtitle="Teaching staff"
              />
            </motion.div>
            <motion.div variants={fadeInVariants} custom={2}>
              <MetricCard
                title="Total Parents"
                value={metrics.totalParents}
                icon={HeartHandshake}
                color="purple"
                subtitle="Registered guardians"
              />
            </motion.div>
            <motion.div variants={fadeInVariants} custom={3}>
              <MetricCard
                title="Total Staff"
                value={metrics.totalStaff}
                icon={Building2}
                color="slate"
                subtitle="Non-teaching employees"
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Row 3 – Revenue + Status Distribution                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueCard revenue={metrics.revenue} loading={isLoading} />
        <StatusDistributionChart
          data={statusData}
          loading={statusLoading}
          error={error}
          onRetry={handleRefresh}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Row 4 – Subscriptions + Recent Schools                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SubscriptionOverview
          planDistribution={planDistribution}
          expiringSoon={expiringSoon}
          loading={subLoading}
          error={error}
          onRetry={handleRefresh}
        />
        <RecentSchoolsList
          schools={schools}
          loading={recentLoading}
          error={error}
          onRetry={handleRefresh}
        />
      </div>
    </motion.div>
  );
}
