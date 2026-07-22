'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Library, BookOpen, BookCheck, BookX, AlertCircle,
  Star, Clock, BadgePercent,
  Hash, Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PopularBook {
  title: string;
  author: string;
  timesIssued: number;
}

interface LibraryAnalytics {
  totalBooks: number;
  issuedBooks: number;
  returnedBooks: number;
  overdueBooks: number;
  lostBooks: number;
  fineCollected: number;
  popularBooks: PopularBook[];
  categoryDistribution: { category: string; count: number; color: string }[];
  usageTrend: { month: string; issued: number; returned: number }[];
}

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

export default function LibraryDashboardPage() {
  const { schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [data, setData] = useState<LibraryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchData = async () => {
    setFetchError(false);
    try {
      const res = await fetch('/api/school-admin/library');
      const json = await res.json();
      if (json.success) setData(json.data);
      else { setFetchError(true); toast.error(json.error || 'Failed to load'); }
    } catch {
      setFetchError(true);
      toast.error('Failed to load library data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    fetchData();
  }, [schoolId, authLoading]);

  const availableBooks = useMemo(() => {
    if (!data) return 0;
    return data.totalBooks - data.issuedBooks;
  }, [data]);

  const issueRate = useMemo(() => {
    if (!data) return 0;
    return (data.issuedBooks / data.totalBooks) * 100;
  }, [data]);

  if (fetchError && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Failed to load library dashboard</p>
        <p className="text-sm">Could not fetch library data from the server.</p>
        <button
          onClick={() => { setLoading(true); setFetchError(false); fetchData(); }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const isLoading = authLoading || (loading && !data);

  if (!data && !loading && !fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
        <Library className="h-12 w-12" />
        <p className="text-lg font-medium">No Library Data</p>
        <p className="text-sm">No library data available. Add books to get started.</p>
      </div>
    );
  }

  const d = data as LibraryAnalytics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Library Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time library analytics and book management overview
          </p>
        </div>
        <Badge variant="info" size="sm" className="w-fit mt-2 sm:mt-0">
          <Library className="h-3 w-3 mr-1" />
          {data ? `${data.totalBooks.toLocaleString('en-IN')} Books` : '...'}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Books</p>
                      <p className="text-3xl font-bold tracking-tight">{d.totalBooks.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Library className="h-3 w-3" />
                        <span>{availableBooks.toLocaleString('en-IN')} available</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Library className="h-6 w-6" />
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
                      <p className="text-sm font-medium text-muted-foreground">Issued</p>
                      <p className="text-3xl font-bold tracking-tight">{d.issuedBooks.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                        <BookOpen className="h-3 w-3" />
                        <span>{issueRate.toFixed(1)}% of collection</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      <BookOpen className="h-6 w-6" />
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
                      <p className="text-sm font-medium text-muted-foreground">Returned</p>
                      <p className="text-3xl font-bold tracking-tight">{d.returnedBooks.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <BookCheck className="h-3 w-3" />
                        <span>{d.returnedBooks > 0 ? `${Math.round((d.returnedBooks / (d.issuedBooks + d.returnedBooks)) * 100)}% return rate` : '-'}</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <BookCheck className="h-6 w-6" />
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
                      <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                      <p className="text-3xl font-bold tracking-tight text-red-600">{d.overdueBooks.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                        <Clock className="h-3 w-3" />
                        <span>{(d.overdueBooks / d.issuedBooks * 100).toFixed(1)}% of issued</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      <Clock className="h-6 w-6" />
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
            <StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-rose-100 p-2.5 dark:bg-rose-900/30">
                      <BookX className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lost Books</p>
                      <p className="text-xl font-bold">{d.lostBooks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2.5 dark:bg-emerald-900/30">
                      <BadgePercent className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fine Collected</p>
                      <p className="text-xl font-bold">{formatINR(d.fineCollected)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Star className="h-4 w-4 text-muted-foreground" />
                Popular Books
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  ))}
                </div>
              ) : d.popularBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mb-2" />
                  <p className="text-sm">No popular books data</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {d.popularBooks.slice(0, 6).map((book, idx) => (
                    <motion.div
                      key={book.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{book.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <Badge variant="secondary" size="sm" className="whitespace-nowrap">
                          {book.timesIssued} issued
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Book Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-72 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={d.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        dataKey="count"
                        paddingAngle={3}
                        // @ts-expect-error - recharts v3 Pie label type
                        label={({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {d.categoryDistribution.map((entry) => (
                          <Cell key={entry.category} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        // @ts-expect-error - recharts v3 formatter accepts [ReactNode, ReactNode]
                        formatter={(value: number) => [value.toLocaleString('en-IN'), 'Count']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Library Usage Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={d.usageTrend}>
                    <defs>
                      <linearGradient id="issuedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="returnedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-xs text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="text-xs text-muted-foreground" />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)' }}
                    />
                    <Area type="monotone" dataKey="issued" stroke="#6366f1" fill="url(#issuedGrad)" strokeWidth={2} name="Issued" />
                    <Area type="monotone" dataKey="returned" stroke="#10b981" fill="url(#returnedGrad)" strokeWidth={2} name="Returned" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
