'use client';

import { Clock, RefreshCw, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface ExpiringSubscription {
  id: string;
  school: string;
  plan: string;
  expiryDate: string;
  daysLeft: number;
  autoRenew: boolean;
}

const expiringSubscriptions: ExpiringSubscription[] = [
  { id: '1', school: 'Springfield Elementary', plan: 'Pro', expiryDate: '2024-06-15', daysLeft: 5, autoRenew: true },
  { id: '2', school: 'Westside Academy', plan: 'Basic', expiryDate: '2024-06-20', daysLeft: 10, autoRenew: false },
  { id: '3', school: 'Bright Future School', plan: 'Pro', expiryDate: '2024-07-01', daysLeft: 21, autoRenew: true },
  { id: '4', school: 'Harmony Institute', plan: 'Enterprise', expiryDate: '2024-07-10', daysLeft: 30, autoRenew: true },
  { id: '5', school: 'Sunrise Learning Center', plan: 'Basic', expiryDate: '2024-06-25', daysLeft: 15, autoRenew: false },
];

export default function ExpiringSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Expiring Soon</h1>
        <p className="text-sm text-muted-foreground mt-1">Subscriptions that will expire within 30 days</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expiring Subscriptions ({expiringSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium py-3 px-4">School</th>
                  <th className="text-left font-medium py-3 px-4">Plan</th>
                  <th className="text-left font-medium py-3 px-4">Expiry Date</th>
                  <th className="text-left font-medium py-3 px-4">Days Left</th>
                  <th className="text-left font-medium py-3 px-4">Auto-renew</th>
                  <th className="text-right font-medium py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {expiringSubscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4">
                      <strong>{sub.school}</strong>
                    </td>
                    <td className="py-3 px-4">{sub.plan}</td>
                    <td className="py-3 px-4 text-muted-foreground">{sub.expiryDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${sub.daysLeft <= 7 ? 'text-red-500' : 'text-amber-500'}`} />
                        <span className={`font-medium ${sub.daysLeft <= 7 ? 'text-red-600' : ''}`}>
                          {sub.daysLeft} days
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <RefreshCw className={`h-3.5 w-3.5 ${sub.autoRenew ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                        <span className="text-muted-foreground">{sub.autoRenew ? 'On' : 'Off'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                        aria-label="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
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
