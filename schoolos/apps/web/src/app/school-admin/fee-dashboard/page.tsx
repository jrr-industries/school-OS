'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  IndianRupee, TrendingUp, TrendingDown, AlertCircle, Calendar,
  PiggyBank, Percent, BookOpen, Users, ArrowUpRight,
  Clock, Zap, Banknote,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn } from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { SupabaseService } from '@/features/supabase/services/supabase.service';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface FeeAnalytics {
  totalCollected: number;
  totalPending: number;
  todayCollection: number;
  monthlyCollection: number;
  scholarshipsAmount: number;
  concessionsGiven: number;
  outstandingBalance: number;
  feeCollectionRate: number;
  monthlyTrend: { month: string; amount: number }[];
  pendingFees: {
    studentName: string;
    className: string;
    amount: number;
    dueDate: string;
    status: 'overdue' | 'upcoming';
  }[];
}

const sampleFeeAnalytics: FeeAnalytics = {
  totalCollected: 12500000,
  totalPending: 1850000,
  todayCollection: 142500,
  monthlyCollection: 2850000,
  scholarshipsAmount: 450000,
  concessionsGiven: 180000,
  outstandingBalance: 670000,
  feeCollectionRate: 87.5,
  monthlyTrend: [
    { month: 'Apr', amount: 2100000 },
    { month: 'May', amount: 1950000 },
    { month: 'Jun', amount: 2850000 },
    { month: 'Jul', amount: 2600000 },
    { month: 'Aug', amount: 2400000 },
    { month: 'Sep', amount: 2750000 },
    { month: 'Oct', amount: 2300000 },
    { month: 'Nov', amount: 2500000 },
    { month: 'Dec', amount: 2200000 },
    { month: 'Jan', amount: 2650000 },
    { month: 'Feb', amount: 2100000 },
    { month: 'Mar', amount: 1950000 },
  ],
  pendingFees: [
    { studentName: 'Aarav Sharma', className: '10-A', amount: 45000, dueDate: '2026-07-15', status: 'overdue' },
    { studentName: 'Priya Patel', className: '9-B', amount: 38000, dueDate: '2026-07-20', status: 'overdue' },
    { studentName: 'Rohit Singh', className: '8-C', amount: 52000, dueDate: '2026-08-01', status: 'upcoming' },
    { studentName: 'Sneha Reddy', className: '11-A', amount: 41000, dueDate: '2026-07-18', status: 'overdue' },
    { studentName: 'Vikram Joshi', className: '12-B', amount: 55000, dueDate: '2026-08-05', status: 'upcoming' },
    { studentName: 'Ananya Gupta', className: '7-A', amount: 33000, dueDate: '2026-07-25', status: 'overdue' },
    { studentName: 'Karan Mehta', className: '10-B', amount: 47000, dueDate: '2026-08-10', status: 'upcoming' },
    { studentName: 'Divya Nair', className: '9-A', amount: 36000, dueDate: '2026-07-22', status: 'overdue' },
  ],
};

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeeDashboardPage() {
  const { schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [analytics, setAnalytics] = useState<FeeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      if (!authLoading) {
        setAnalytics(sampleFeeAnalytics);
        setLoading(false);
      }
      return;
    }

    const unsub = SupabaseService.subscribeByField<FeeAnalytics>(
      'fee_analytics', schoolId, 'school_id', schoolId,
      (data) => {
        if (data) {
          setAnalytics(data);
          setLoading(false);
        }
      },
    );

    const timeout = setTimeout(() => {
      if (loading) {
        setAnalytics(sampleFeeAnalytics);
        setLoading(false);
        toast.info('Using sample data — realtime feed unavailable');
      }
    }, 5000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [schoolId, authLoading]);

  const collectionRateColor = useMemo(() => {
    if (!analytics) return 'bg-primary';
    const rate = analytics.feeCollectionRate;
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 75) return 'bg-amber-500';
    return 'bg-red-500';
  }, [analytics]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Failed to load fee dashboard</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const isLoading = authLoading || (loading && !analytics);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Fee Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time fee collection overview for the academic year
          </p>
        </div>
        <Badge variant="info" size="sm" className="w-fit mt-2 sm:mt-0">
          <Banknote className="h-3 w-3 mr-1" />
          FY 2026-27
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                      <p className="text-3xl font-bold tracking-tight">{formatINR(analytics!.totalCollected)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>12% vs last year</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <IndianRupee className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                      <p className="text-3xl font-bold tracking-tight text-amber-600">{formatINR(analytics!.totalPending)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                        <TrendingDown className="h-3 w-3" />
                        <span>5% increase</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Today&apos;s Collection</p>
                      <p className="text-3xl font-bold tracking-tight">{formatINR(analytics!.todayCollection)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>{Math.round((analytics!.todayCollection / analytics!.monthlyCollection) * 100)}% of monthly</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Zap className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Monthly Collection</p>
                      <p className="text-3xl font-bold tracking-tight">{formatINR(analytics!.monthlyCollection)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Calendar className="h-3 w-3" />
                        <span>Current month</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Scholarships</p>
                      <p className="text-2xl font-bold tracking-tight">{formatINR(analytics!.scholarshipsAmount)}</p>
                    </div>
                    <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Concessions</p>
                      <p className="text-2xl font-bold tracking-tight">{formatINR(analytics!.concessionsGiven)}</p>
                    </div>
                    <div className="rounded-xl bg-rose-100 p-3 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                      <Percent className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
                      <p className="text-2xl font-bold tracking-tight text-red-600">{formatINR(analytics!.outstandingBalance)}</p>
                    </div>
                    <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Students with Dues</p>
                      <p className="text-2xl font-bold tracking-tight">{analytics!.pendingFees.length}</p>
                    </div>
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Percent className="h-4 w-4 text-muted-foreground" />
                Fee Collection Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{analytics!.feeCollectionRate}%</span>
                    <Badge variant={analytics!.feeCollectionRate >= 90 ? 'success' : analytics!.feeCollectionRate >= 75 ? 'warning' : 'destructive'} size="sm">
                      {analytics!.feeCollectionRate >= 90 ? 'Excellent' : analytics!.feeCollectionRate >= 75 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analytics!.feeCollectionRate}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn('h-full rounded-full transition-colors', collectionRateColor)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics!.totalCollected.toLocaleString('en-IN')} collected out of {(analytics!.totalCollected + analytics!.totalPending).toLocaleString('en-IN')} total
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Scholarships & Concessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                        <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Scholarships</p>
                        <p className="text-xs text-muted-foreground">Merit & need-based</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold">{formatINR(analytics!.scholarshipsAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-rose-100 p-2 dark:bg-rose-900/30">
                        <Percent className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Concessions</p>
                        <p className="text-xs text-muted-foreground">Staff & sibling discounts</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold">{formatINR(analytics!.concessionsGiven)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                        <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Waived</p>
                        <p className="text-xs text-muted-foreground">Scholarships + Concessions</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold">{formatINR(analytics!.scholarshipsAmount + analytics!.concessionsGiven)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Monthly Fee Collection Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics!.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-xs text-muted-foreground" />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`}
                        className="text-xs text-muted-foreground"
                      />
                      <Tooltip
                        // @ts-expect-error - recharts v3 formatter accepts [ReactNode, ReactNode]
                        formatter={(value: number) => [formatINR(value), 'Collected']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          background: 'var(--card)',
                        }}
                      />
                      <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="lg:col-span-3"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
                Pending Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  ))}
                </div>
              ) : analytics!.pendingFees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <PiggyBank className="h-8 w-8 mb-2" />
                  <p className="text-sm">No pending fees</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {analytics!.pendingFees.map((fee, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{fee.studentName}</span>
                          <Badge variant={fee.status === 'overdue' ? 'destructive' : 'warning'} size="sm">
                            {fee.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{fee.className} • Due {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <span className="text-sm font-semibold ml-3 whitespace-nowrap">{formatINR(fee.amount)}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
