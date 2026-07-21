'use client';

import { Activity, Building2, UserPlus, CreditCard, ShieldAlert, Settings, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

const activities = [
  { time: '2 minutes ago', school: 'Springfield Elementary', action: 'New administrator account created', icon: UserPlus },
  { time: '15 minutes ago', school: 'Lincoln High School', action: 'Subscription upgraded to Enterprise plan', icon: CreditCard },
  { time: '1 hour ago', school: 'Riverside Academy', action: 'Security settings updated', icon: ShieldAlert },
  { time: '2 hours ago', school: 'Mountain View Middle', action: 'School profile information edited', icon: Settings },
  { time: '3 hours ago', school: 'Oakwood Preparatory', action: 'Bulk student import completed (180 records)', icon: FileText },
  { time: '5 hours ago', school: 'Springfield Elementary', action: 'Term grades published for Q2', icon: FileText },
  { time: '1 day ago', school: 'Lincoln High School', action: 'New teacher accounts created (5)', icon: UserPlus },
  { time: '1 day ago', school: 'Riverside Academy', action: 'Payment of $2,500 received', icon: CreditCard },
  { time: '2 days ago', school: 'Mountain View Middle', action: 'Account suspended due to non-compliance', icon: ShieldAlert },
  { time: '2 days ago', school: 'Oakwood Preparatory', action: 'Trial period started', icon: Activity },
];

export default function SchoolActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Recent activity across all schools</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {activities.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 border-b border-slate-100 py-4 last:border-0 dark:border-slate-800"
                >
                  <div className="rounded-full bg-primary/10 p-2 shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">
                      <Building2 className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                      {item.school}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
