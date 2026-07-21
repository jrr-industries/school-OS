'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface ActiveSubscription {
  id: string;
  school: string;
  plan: string;
  amount: string;
  billingCycle: string;
  nextBilling: string;
  status: 'active' | 'past_due' | 'cancelled';
}

const subscriptions: ActiveSubscription[] = [
  { id: '1', school: 'Springfield Elementary', plan: 'Pro', amount: '$99/mo', billingCycle: 'Monthly', nextBilling: '2024-06-15', status: 'active' },
  { id: '2', school: 'Lincoln High School', plan: 'Enterprise', amount: '$299/mo', billingCycle: 'Annual', nextBilling: '2024-12-01', status: 'active' },
  { id: '3', school: 'Riverside Academy', plan: 'Pro', amount: '$99/mo', billingCycle: 'Monthly', nextBilling: '2024-06-20', status: 'active' },
  { id: '4', school: 'Westside Academy', plan: 'Basic', amount: '$29/mo', billingCycle: 'Monthly', nextBilling: '2024-06-10', status: 'past_due' },
  { id: '5', school: 'Bright Future School', plan: 'Pro', amount: '$99/mo', billingCycle: 'Quarterly', nextBilling: '2024-08-01', status: 'active' },
];

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  past_due: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function ActiveSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Active Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">Schools with active paid subscriptions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Subscriptions ({subscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium py-3 px-4">School</th>
                  <th className="text-left font-medium py-3 px-4">Plan</th>
                  <th className="text-left font-medium py-3 px-4">Amount</th>
                  <th className="text-left font-medium py-3 px-4">Billing Cycle</th>
                  <th className="text-left font-medium py-3 px-4">Next Billing</th>
                  <th className="text-right font-medium py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4">
                      <strong>{sub.school}</strong>
                    </td>
                    <td className="py-3 px-4">{sub.plan}</td>
                    <td className="py-3 px-4 text-muted-foreground">{sub.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{sub.billingCycle}</td>
                    <td className="py-3 px-4 text-muted-foreground">{sub.nextBilling}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[sub.status]}`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
