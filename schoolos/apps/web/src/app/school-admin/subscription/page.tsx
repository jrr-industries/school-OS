'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2, XCircle, HardDrive, Users,
  Calendar, ArrowRight, Crown,
  Check, CreditCard,
} from 'lucide-react';
import { Card, CardContent, Button, Badge, cn } from '@schoolos/ui';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/features/school-admin/components/page-header';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  currency: string;
  interval: string;
  maxStudents: number;
  maxTeachers: number;
  maxStorageGB: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

interface Subscription {
  id: string;
  schoolId: string;
  planId: string;
  status: string;
  startsAt: string;
  endsAt: string | null;
  trialEndsAt: string | null;
  autoRenew: boolean;
  plan: Plan;
}

const planBadgeColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  basic: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  standard: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  premium: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  enterprise: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
};

const planHeaderBg: Record<string, string> = {
  free: 'bg-slate-50 dark:bg-slate-900',
  basic: 'bg-blue-50 dark:bg-blue-950',
  standard: 'bg-emerald-50 dark:bg-emerald-950',
  premium: 'bg-purple-50 dark:bg-purple-950',
  enterprise: 'bg-amber-50 dark:bg-amber-950',
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
  trial: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  past_due: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
  cancelled: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  expired: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
};

export default function SubscriptionPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/school-admin/subscription');
      const json = await res.json();
      if (json.success) {
        setPlans(json.data.plans);
        setCurrentSubscription(json.data.currentSubscription);
      }
    } catch {
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChoosePlan = (planId: string) => {
    router.push(`/school-admin/subscription/payment?planId=${planId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Subscription" description="Manage your subscription plan" />
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    );
  }

  const currentPlanId = currentSubscription?.planId;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription"
        description="Choose a plan that fits your school"
      />

      {currentSubscription ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={cn(
                'rounded-xl p-3',
                planBadgeColors[currentSubscription.plan.slug] || planBadgeColors.free,
              )}>
                <Crown className="h-8 w-8" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold">{currentSubscription.plan.name}</h2>
                  <Badge variant="outline" className={cn('capitalize', statusColors[currentSubscription.status])}>
                    {currentSubscription.status === 'past_due' ? 'Past Due' : currentSubscription.status}
                  </Badge>
                  {currentSubscription.autoRenew && (
                    <Badge variant="outline" className="text-xs">Auto-Renew On</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Started {new Date(currentSubscription.startsAt).toLocaleDateString()}
                  </span>
                  {currentSubscription.endsAt && (
                    <span className="flex items-center gap-1">
                      <ArrowRight className="h-3.5 w-3.5" />
                      {currentSubscription.status === 'active' ? 'Renew' : 'Ended'} {new Date(currentSubscription.endsAt).toLocaleDateString()}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {currentSubscription.plan.maxStudents} Students / {currentSubscription.plan.maxTeachers} Teachers
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3.5 w-3.5" />
                    {currentSubscription.plan.maxStorageGB} GB Storage
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/school-admin/subscription/payment?planId=${currentSubscription.planId}`)}>
                <CreditCard className="h-4 w-4 mr-1" /> Renew
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Crown className="h-12 w-12 mb-3" />
            <h2 className="text-lg font-semibold">No Active Subscription</h2>
            <p className="text-sm mt-1">Choose a plan below to get started</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const price = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
          const features = (plan.features as string[]) || [];

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative flex flex-col overflow-hidden transition-all duration-200',
                isCurrent && 'ring-2 ring-primary shadow-lg scale-[1.02]',
              )}
            >
              {isCurrent && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" /> Active
                  </Badge>
                </div>
              )}
              <div className={cn('p-6 text-center', planHeaderBg[plan.slug] || 'bg-muted')}>
                <Crown className={cn(
                  'h-10 w-10 mx-auto mb-2',
                  plan.slug === 'free' ? 'text-slate-500' :
                  plan.slug === 'basic' ? 'text-blue-500' :
                  plan.slug === 'standard' ? 'text-emerald-500' :
                  plan.slug === 'premium' ? 'text-purple-500' :
                  'text-amber-500',
                )} />
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {plan.description && (
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                )}
                <div className="mt-3">
                  <span className="text-3xl font-bold">
                    {plan.currency === 'INR' ? '₹' : '$'}{price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                </div>
              </div>
              <CardContent className="flex-1 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{plan.maxStudents.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Teachers</span>
                    <span className="font-medium">{plan.maxTeachers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">{plan.maxStorageGB} GB</span>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  {features.length > 0 ? features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  )) : (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>No features listed</span>
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full"
                    variant={isCurrent ? 'outline' : 'default'}
                    onClick={() => handleChoosePlan(plan.id)}
                  >
                    {isCurrent ? 'Current Plan' : 'Choose Plan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
