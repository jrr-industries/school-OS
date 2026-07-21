'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard, CheckCircle2, XCircle, HardDrive, Users,
  Calendar, ArrowRight, Receipt, Building2, Crown,
  Sparkles, Shield, Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, cn } from '@schoolos/ui';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import type { SubscriptionData, PaymentRecord } from '@/features/firebase/types';
import { PageHeader } from '@/features/school-admin/components/page-header';

const planColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  basic: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  standard: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  premium: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  enterprise: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
  expired: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
  trial: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
};

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  active: CheckCircle2,
  expired: XCircle,
  cancelled: XCircle,
  trial: Clock,
};

const paymentStatusColors: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  storage: HardDrive,
  reports: Receipt,
  analytics: Sparkles,
  support: Shield,
  custom: Building2,
};

function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const { schoolId, loading: authLoading } = useFirebaseAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;
    const unsub = RealtimeService.subscribe<SubscriptionData>(
      `schools/${schoolId}/subscription`,
      (data) => {
        if (data) setSubscription(data);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [schoolId]);

  const isLoading = authLoading || loading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Subscription" description="Manage your subscription plan" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="h-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <PageHeader title="Subscription" description="Manage your subscription plan" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <CreditCard className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold">No Subscription Found</h2>
            <p className="mt-1 text-sm">Unable to load subscription data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = statusIcons[subscription.status] || CheckCircle2;
  const statusColor = statusColors[subscription.status] || statusColors.active;
  const planColor = planColors[subscription.plan] || planColors.free;

  const features: { key: string; label: string; included: boolean }[] = [
    { key: 'users', label: 'User Management', included: subscription.features?.includes('users') ?? false },
    { key: 'storage', label: 'Cloud Storage', included: subscription.features?.includes('storage') ?? false },
    { key: 'reports', label: 'Advanced Reports', included: subscription.features?.includes('reports') ?? false },
    { key: 'analytics', label: 'Analytics Dashboard', included: subscription.features?.includes('analytics') ?? false },
    { key: 'support', label: 'Priority Support', included: subscription.features?.includes('support') ?? false },
    { key: 'custom', label: 'Custom Branding', included: subscription.features?.includes('custom') ?? false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription"
        description="View your subscription plan and usage"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={cn('rounded-xl p-4', planColor.replace('border', 'bg').split(' ')[0] + ' bg-opacity-20')}>
                  <Crown className={cn('h-10 w-10', planColor.split(' ')[1])} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold capitalize">{subscription.plan}</h2>
                    <Badge className={cn('capitalize border', planColor)} variant="outline">
                      {subscription.plan} Plan
                    </Badge>
                    <Badge className={cn('capitalize gap-1', statusColor)} variant="outline">
                      <StatusIcon className="h-3 w-3" />
                      {subscription.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subscription.status === 'active' && 'Your subscription is active and running'}
                    {subscription.status === 'trial' && 'Your trial period is active'}
                    {subscription.status === 'expired' && 'Your subscription has expired'}
                    {subscription.status === 'cancelled' && 'Your subscription has been cancelled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <ProgressBar value={subscription.storageUsed} max={subscription.storageLimit} label="Storage" />
              <ProgressBar value={subscription.userLimit} max={subscription.userLimit * 2} label="Users" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoRow icon={Calendar} label="Start Date" value={subscription.startDate ? new Date(subscription.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} />
                <InfoRow icon={Calendar} label="End Date" value={subscription.endDate ? new Date(subscription.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} />
                <InfoRow icon={ArrowRight} label="Renewal Date" value={subscription.renewDate ? new Date(subscription.renewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {features.map((f) => {
                  const Icon = featureIcons[f.key] || CheckCircle2;
                  return (
                    <div key={f.key} className={cn('flex items-center gap-3 rounded-lg border p-3', !f.included && 'opacity-50')}>
                      <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm font-medium">{f.label}</span>
                      {f.included ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Plan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Plan</p>
                <p className={cn('text-lg font-bold capitalize', planColor.split(' ')[1])}>{subscription.plan}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={cn('mt-1 capitalize', statusColor)} variant="outline">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {subscription.status}
                </Badge>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Storage Limit</p>
                <p className="text-lg font-bold">{subscription.storageLimit} GB</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">User Limit</p>
                <p className="text-lg font-bold">{subscription.userLimit.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription.paymentHistory && subscription.paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Method</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {subscription.paymentHistory.map((payment: PaymentRecord) => (
                    <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-3 py-2.5">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="px-3 py-2.5 font-medium">₹{payment.amount.toLocaleString()}</td>
                      <td className="px-3 py-2.5 capitalize">{payment.method}</td>
                      <td className="px-3 py-2.5">
                        <Badge className={cn('capitalize', paymentStatusColors[payment.status])} variant="outline">
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        {payment.invoiceUrl ? (
                          <a
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Receipt className="h-3 w-3" />
                            View
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Receipt className="h-10 w-10 mb-3" />
              <p className="text-sm font-medium">No payment history</p>
              <p className="text-xs mt-1">Payment records will appear here once transactions are made.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
