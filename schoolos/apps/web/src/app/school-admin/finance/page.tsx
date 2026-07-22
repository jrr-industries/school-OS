'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, IndianRupee, AlertCircle,
  Car, UtensilsCrossed, BookOpen, Briefcase, Wrench, Zap,
  MoreHorizontal, ArrowUpRight, ArrowDownRight,
  PieChart as PieChartIcon, Wallet,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn } from '@schoolos/ui';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCrore(amount: number): string {
  const crore = amount / 10000000;
  return `₹${crore.toFixed(1)}Cr`;
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

export default function FinanceDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/school-admin/finance')
      .then((r) => r.json())
      .then((json) => { if (json.success) setData(json.data); })
      .catch(() => toast.error('Failed to load finance data'))
      .finally(() => setLoading(false));
  }, []);

  const profitMargin = useMemo(() => {
    if (!data) return 0;
    return (data.netProfit / data.totalIncome) * 100;
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Failed to load finance dashboard</p>
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

  const isLoading = loading && !data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Finance Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Complete financial overview and P&amp;L analysis
          </p>
        </div>
        {data && (
          <Badge variant={data.netProfit >= 0 ? 'success' : 'destructive'} size="sm" className="w-fit mt-2 sm:mt-0">
            {data.netProfit >= 0 ? 'Profitable' : 'Loss'} • {profitMargin.toFixed(1)}% margin
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                      <p className="text-3xl font-bold tracking-tight text-emerald-600">{formatCrore(data!.totalIncome)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>{(data!.totalIncome / (data!.totalExpenses + data!.netProfit) * 100).toFixed(1)}% of total</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <TrendingUp className="h-6 w-6" />
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
                      <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                      <p className="text-3xl font-bold tracking-tight text-red-600">{formatCrore(data!.totalExpenses)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                        <TrendingDown className="h-3 w-3" />
                        <span>{(data!.totalExpenses / data!.totalIncome * 100).toFixed(1)}% of income</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      <TrendingDown className="h-6 w-6" />
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
                      <p className="text-sm font-medium text-muted-foreground">Net Profit / Loss</p>
                      <p className="text-3xl font-bold tracking-tight" style={{ color: data!.netProfit >= 0 ? 'var(--color-emerald-600)' : 'var(--color-red-600)' }}>
                        {data!.netProfit >= 0 ? '+' : ''}{formatCrore(Math.abs(data!.netProfit))}
                      </p>
                      <div className={cn('flex items-center gap-1 text-xs font-medium', data!.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                        {data!.netProfit >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        <span>{profitMargin.toFixed(1)}% profit margin</span>
                      </div>
                    </div>
                    <div className={cn('rounded-xl p-3', data!.netProfit >= 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400')}>
                      <Wallet className="h-6 w-6" />
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
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2.5 dark:bg-blue-900/30">
                      <IndianRupee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Fee Income</p>
                      <p className="text-sm font-semibold truncate">{formatCrore(data!.feeIncome)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2.5 dark:bg-purple-900/30">
                      <Car className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Transport Income</p>
                      <p className="text-sm font-semibold truncate">{formatCrore(data!.transportIncome)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-100 p-2.5 dark:bg-orange-900/30">
                      <UtensilsCrossed className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Lunch Income</p>
                      <p className="text-sm font-semibold truncate">{formatCrore(data!.lunchIncome)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-100 p-2.5 dark:bg-cyan-900/30">
                      <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Book Sales</p>
                      <p className="text-sm font-semibold truncate">{formatCrore(data!.bookSales)}</p>
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
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2.5 dark:bg-indigo-900/30">
                      <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Salary Expenses</p>
                      <p className="text-sm font-semibold">{formatCrore(data!.salaryExpenses)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-100 p-2.5 dark:bg-amber-900/30">
                      <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Maintenance</p>
                      <p className="text-sm font-semibold">{formatCrore(data!.maintenanceExpenses)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-l-4 border-l-cyan-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-100 p-2.5 dark:bg-cyan-900/30">
                      <Zap className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Utilities</p>
                      <p className="text-sm font-semibold">{formatCrore(data!.utilitiesExpenses)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-100 p-2.5 dark:bg-red-900/30">
                      <MoreHorizontal className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Other Expenses</p>
                      <p className="text-sm font-semibold">{formatCrore(data!.otherExpenses)}</p>
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
          transition={{ delay: 0.4 }}
          className="lg:col-span-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Income vs Expenses Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-72 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data!.incomeVsExpenses}>
                      <defs>
                        <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-xs text-muted-foreground" />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`}
                        className="text-xs text-muted-foreground"
                      />
                      <Tooltip
                        // @ts-expect-error - recharts v3 formatter accepts [ReactNode, ReactNode]
                        formatter={(value: number, name: string) => [formatINR(value), name === 'income' ? 'Income' : 'Expenses']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)' }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-3"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                Expense Breakdown
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
                        data={data!.expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="amount"
                        paddingAngle={4}
                      >
                        {data!.expenseBreakdown.map((entry: any) => (
                          <Cell key={entry.category} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend
                        formatter={(value: string) => (
                          <span className="text-xs text-muted-foreground">{value}</span>
                        )}
                      />
                      <Tooltip
                        // @ts-expect-error - recharts v3 formatter accepts [ReactNode, ReactNode]
                        formatter={(value: number) => [formatINR(value), 'Amount']}
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Monthly Profit & Loss Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                ))}
              </div>
            ) : data!.monthlyPnL.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mb-2" />
                <p className="text-sm">No P&amp;L data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="pb-3 pr-6 font-medium">Month</th>
                      <th className="pb-3 pr-6 font-medium">Income</th>
                      <th className="pb-3 pr-6 font-medium">Expenses</th>
                      <th className="pb-3 pr-6 font-medium">Profit</th>
                      <th className="pb-3 font-medium">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.monthlyPnL.map((row: any, idx: number) => {
                      const margin = row.income > 0 ? (row.profit / row.income) * 100 : 0;
                      return (
                        <motion.tr
                          key={row.month}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b last:border-0 transition-colors hover:bg-muted/30"
                        >
                          <td className="py-3 pr-6 font-medium">{row.month}</td>
                          <td className="py-3 pr-6">{formatINR(row.income)}</td>
                          <td className="py-3 pr-6">{formatINR(row.expenses)}</td>
                          <td className={cn('py-3 pr-6 font-medium', row.profit >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                            {row.profit >= 0 ? '+' : ''}{formatINR(row.profit)}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                <div
                                  className={cn('h-full rounded-full', margin >= 0 ? 'bg-emerald-500' : 'bg-red-500')}
                                  style={{ width: `${Math.min(Math.abs(margin), 100)}%` }}
                                />
                              </div>
                              <span className="text-xs">{margin.toFixed(1)}%</span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
