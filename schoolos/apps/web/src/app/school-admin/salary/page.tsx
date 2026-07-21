'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users, Briefcase, AlertCircle, Clock,
  TrendingDown, BadgePercent, Banknote,
  Calculator, Building2, DollarSign,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@schoolos/ui';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PayrollRecord {
  month: string;
  year: number;
  teacherSalaries: number;
  staffSalaries: number;
  totalAmount: number;
  bonuses: number;
  deductions: number;
  pfAmount: number;
  esiAmount: number;
  status: 'paid' | 'pending' | 'processing';
  paidDate: string | null;
}

interface SalaryAnalytics {
  totalTeacherSalaries: number;
  totalStaffSalaries: number;
  pendingSalaryAmount: number;
  payrollStatus: 'all_paid' | 'some_pending' | 'none_paid';
  totalBonuses: number;
  totalDeductions: number;
  totalPF: number;
  totalESI: number;
  monthlyPayrollCost: number;
  annualPayrollCost: number;
  history: PayrollRecord[];
}

const sampleSalaryData: SalaryAnalytics = {
  totalTeacherSalaries: 5840000,
  totalStaffSalaries: 2160000,
  pendingSalaryAmount: 480000,
  payrollStatus: 'some_pending',
  totalBonuses: 350000,
  totalDeductions: 280000,
  totalPF: 720000,
  totalESI: 240000,
  monthlyPayrollCost: 685000,
  annualPayrollCost: 8220000,
  history: [
    { month: 'January', year: 2026, teacherSalaries: 487000, staffSalaries: 180000, totalAmount: 667000, bonuses: 0, deductions: 22000, pfAmount: 58000, esiAmount: 19000, status: 'paid', paidDate: '2026-02-01' },
    { month: 'February', year: 2026, teacherSalaries: 487000, staffSalaries: 180000, totalAmount: 667000, bonuses: 25000, deductions: 24000, pfAmount: 60000, esiAmount: 20000, status: 'paid', paidDate: '2026-03-01' },
    { month: 'March', year: 2026, teacherSalaries: 487000, staffSalaries: 180000, totalAmount: 667000, bonuses: 50000, deductions: 22000, pfAmount: 58000, esiAmount: 19000, status: 'paid', paidDate: '2026-04-01' },
    { month: 'April', year: 2026, teacherSalaries: 487000, staffSalaries: 180000, totalAmount: 667000, bonuses: 0, deductions: 23000, pfAmount: 60000, esiAmount: 20000, status: 'paid', paidDate: '2026-05-01' },
    { month: 'May', year: 2026, teacherSalaries: 487000, staffSalaries: 180000, totalAmount: 667000, bonuses: 0, deductions: 22000, pfAmount: 58000, esiAmount: 19000, status: 'paid', paidDate: '2026-05-31' },
    { month: 'June', year: 2026, teacherSalaries: 487000, staffSalaries: 180000, totalAmount: 667000, bonuses: 0, deductions: 24000, pfAmount: 62000, esiAmount: 21000, status: 'paid', paidDate: '2026-07-01' },
    { month: 'July', year: 2026, teacherSalaries: 487000, staffSalaries: 180000, totalAmount: 667000, bonuses: 35000, deductions: 23000, pfAmount: 60000, esiAmount: 20000, status: 'processing', paidDate: null },
    { month: 'August', year: 2026, teacherSalaries: 487000, staffSalaries: 180000, totalAmount: 667000, bonuses: 0, deductions: 22000, pfAmount: 58000, esiAmount: 19000, status: 'pending', paidDate: null },
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

const statusConfig = {
  paid: { label: 'Paid', variant: 'success' as const },
  pending: { label: 'Pending', variant: 'warning' as const },
  processing: { label: 'Processing', variant: 'info' as const },
};

export default function SalaryDashboardPage() {
  const { schoolId, loading: authLoading } = useFirebaseAuth();
  const [data, setData] = useState<SalaryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      if (!authLoading) {
        setData(sampleSalaryData);
        setLoading(false);
      }
      return;
    }

    const unsub = RealtimeService.subscribe<SalaryAnalytics>(
      `schools/${schoolId}/analytics/salary`,
      (fetched) => {
        if (fetched) {
          setData(fetched);
          setLoading(false);
        }
      },
    );

    const timeout = setTimeout(() => {
      if (loading) {
        setData(sampleSalaryData);
        setLoading(false);
        toast.info('Using sample data — realtime feed unavailable');
      }
    }, 5000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [schoolId, authLoading]);

  const payrollStatusBadge = useMemo(() => {
    if (!data) return null;
    switch (data.payrollStatus) {
      case 'all_paid': return <Badge variant="success">All Paid</Badge>;
      case 'some_pending': return <Badge variant="warning">Some Pending</Badge>;
      case 'none_paid': return <Badge variant="destructive">None Paid</Badge>;
      default: return null;
    }
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Failed to load salary dashboard</p>
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

  const isLoading = authLoading || (loading && !data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Salary & Payroll Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Complete payroll overview and salary management
          </p>
        </div>
        {data && payrollStatusBadge}
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
                      <p className="text-sm font-medium text-muted-foreground">Teacher Salaries</p>
                      <p className="text-3xl font-bold tracking-tight">{formatINR(data!.totalTeacherSalaries)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Briefcase className="h-3 w-3" />
                        <span>Annual total</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Briefcase className="h-6 w-6" />
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
                      <p className="text-sm font-medium text-muted-foreground">Staff Salaries</p>
                      <p className="text-3xl font-bold tracking-tight">{formatINR(data!.totalStaffSalaries)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Users className="h-3 w-3" />
                        <span>Annual total</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <Users className="h-6 w-6" />
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
                      <p className="text-sm font-medium text-muted-foreground">Pending Salary</p>
                      <p className="text-3xl font-bold tracking-tight text-amber-600">{formatINR(data!.pendingSalaryAmount)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                        <Clock className="h-3 w-3" />
                        <span>{data!.history.filter(h => h.status === 'pending').length} months pending</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      <Clock className="h-6 w-6" />
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
                      <p className="text-sm font-medium text-muted-foreground">Monthly Payroll Cost</p>
                      <p className="text-3xl font-bold tracking-tight">{formatINR(data!.monthlyPayrollCost)}</p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <Calculator className="h-3 w-3" />
                        <span>Current month</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Calculator className="h-6 w-6" />
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Bonuses</p>
                      <p className="text-2xl font-bold tracking-tight">{formatINR(data!.totalBonuses)}</p>
                    </div>
                    <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <BadgePercent className="h-5 w-5" />
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
                      <p className="text-sm font-medium text-muted-foreground">Deductions</p>
                      <p className="text-2xl font-bold tracking-tight text-red-600">{formatINR(data!.totalDeductions)}</p>
                    </div>
                    <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      <TrendingDown className="h-5 w-5" />
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
                      <p className="text-sm font-medium text-muted-foreground">PF (Provident Fund)</p>
                      <p className="text-2xl font-bold tracking-tight">{formatINR(data!.totalPF)}</p>
                    </div>
                    <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <Building2 className="h-5 w-5" />
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
                      <p className="text-sm font-medium text-muted-foreground">ESI Amount</p>
                      <p className="text-2xl font-bold tracking-tight">{formatINR(data!.totalESI)}</p>
                    </div>
                    <div className="rounded-xl bg-cyan-100 p-3 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                      <HeartPulseIcon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Payroll Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Annual Payroll Cost</p>
                      <p className="text-xs text-muted-foreground">Total salary outlay for the year</p>
                    </div>
                    <span className="text-xl font-bold">{formatINR(data!.annualPayrollCost)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Teacher : Staff Ratio</p>
                      <p className="text-xs text-muted-foreground">Salary distribution</p>
                    </div>
                    <span className="text-lg font-semibold">
                      {Math.round((data!.totalTeacherSalaries / (data!.totalTeacherSalaries + data!.totalStaffSalaries)) * 100)}% : {Math.round((data!.totalStaffSalaries / (data!.totalTeacherSalaries + data!.totalStaffSalaries)) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">PF + ESI Contribution</p>
                      <p className="text-xs text-muted-foreground">Statutory contributions</p>
                    </div>
                    <span className="text-lg font-semibold">{formatINR(data!.totalPF + data!.totalESI)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                    <div>
                      <p className="text-sm font-medium">Net Payroll (after deductions)</p>
                      <p className="text-xs text-muted-foreground">Annual payroll minus deductions</p>
                    </div>
                    <span className="text-lg font-bold">{formatINR(data!.annualPayrollCost - data!.totalDeductions)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Banknote className="h-4 w-4 text-muted-foreground" />
                Contributions Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                          <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Provident Fund (PF)</p>
                          <p className="text-xs text-muted-foreground">12% employer + 12% employee</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">{formatINR(data!.totalPF)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data!.totalPF / (data!.totalPF + data!.totalESI)) * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-cyan-100 p-2 dark:bg-cyan-900/30">
                          <HeartPulseIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">ESI</p>
                          <p className="text-xs text-muted-foreground">3.25% employer + 0.75% employee</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">{formatINR(data!.totalESI)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data!.totalESI / (data!.totalPF + data!.totalESI)) * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              Payroll History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                ))}
              </div>
            ) : data!.history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Banknote className="h-8 w-8 mb-2" />
                <p className="text-sm">No payroll history available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Month</th>
                      <th className="pb-3 pr-4 font-medium">Teacher Salary</th>
                      <th className="pb-3 pr-4 font-medium">Staff Salary</th>
                      <th className="pb-3 pr-4 font-medium">Bonuses</th>
                      <th className="pb-3 pr-4 font-medium">Deductions</th>
                      <th className="pb-3 pr-4 font-medium">Total</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Paid Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.history.map((record, idx) => (
                      <motion.tr
                        key={`${record.month}-${record.year}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-b last:border-0 transition-colors hover:bg-muted/30"
                      >
                        <td className="py-3 pr-4">
                          <span className="font-medium">{record.month}</span>
                          <span className="text-muted-foreground ml-1">{record.year}</span>
                        </td>
                        <td className="py-3 pr-4">{formatINR(record.teacherSalaries)}</td>
                        <td className="py-3 pr-4">{formatINR(record.staffSalaries)}</td>
                        <td className="py-3 pr-4">{record.bonuses > 0 ? formatINR(record.bonuses) : '-'}</td>
                        <td className="py-3 pr-4">{formatINR(record.deductions)}</td>
                        <td className="py-3 pr-4 font-semibold">{formatINR(record.totalAmount)}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={statusConfig[record.status].variant} size="sm">
                            {statusConfig[record.status].label}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {record.paidDate ? new Date(record.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </td>
                      </motion.tr>
                    ))}
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

function HeartPulseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <polyline points="3.5 11.5 7.5 11.5 9.5 8.5 12.5 14.5 14.5 11.5 18.5 11.5" />
    </svg>
  );
}
