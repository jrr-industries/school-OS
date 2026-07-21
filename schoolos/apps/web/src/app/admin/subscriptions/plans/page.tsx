'use client';

import { Check, X as XIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: { name: string; included: boolean }[];
  popular: boolean;
  status: 'active' | 'archived' | 'coming-soon';
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$29',
    period: '/month',
    description: 'Essential tools for small schools getting started',
    features: [
      { name: 'Up to 500 students', included: true },
      { name: 'Up to 30 teachers', included: true },
      { name: 'Basic gradebook', included: true },
      { name: 'Attendance tracking', included: true },
      { name: 'Email support', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
    popular: false,
    status: 'active',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'Advanced features for growing schools',
    features: [
      { name: 'Up to 2,000 students', included: true },
      { name: 'Up to 150 teachers', included: true },
      { name: 'Advanced gradebook', included: true },
      { name: 'Attendance & behavior tracking', included: true },
      { name: 'Priority email & chat support', included: true },
      { name: 'Advanced analytics & reports', included: true },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
    popular: true,
    status: 'active',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$299',
    period: '/month',
    description: 'Full platform access for large institutions',
    features: [
      { name: 'Unlimited students', included: true },
      { name: 'Unlimited teachers', included: true },
      { name: 'Full gradebook & LMS', included: true },
      { name: 'Comprehensive tracking', included: true },
      { name: 'Dedicated support manager', included: true },
      { name: 'Advanced analytics & custom reports', included: true },
      { name: 'Custom branding & white-label', included: true },
      { name: 'Full API access', included: true },
    ],
    popular: false,
    status: 'active',
  },
];

export default function SubscriptionPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Subscription Plans</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage platform subscription tiers</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.popular ? 'border-primary shadow-md' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>
                {plan.popular && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={feature.included ? '' : 'text-muted-foreground'}>{feature.name}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    {plan.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
