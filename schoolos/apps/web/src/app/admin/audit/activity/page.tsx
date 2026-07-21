'use client';

import { Clock, School, GraduationCap, DollarSign, Settings, Shield, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface ActivityItem {
  id: string;
  type: 'school' | 'user' | 'payment' | 'setting' | 'security' | 'system';
  user: string;
  avatar: string;
  action: string;
  detail: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error';
}

const groupedActivities: { label: string; activities: ActivityItem[] }[] = [
  {
    label: 'Today',
    activities: [
      { id: '1', type: 'school', user: 'Super Admin', avatar: 'SA', action: 'New school registered', detail: 'Springfield Elementary School has been onboarded', timestamp: '2 minutes ago', status: 'success' },
      { id: '2', type: 'user', user: 'John Smith', avatar: 'JS', action: 'Bulk student import', detail: '240 students imported from CSV to Lincoln High', timestamp: '15 minutes ago', status: 'success' },
      { id: '3', type: 'payment', user: 'System', avatar: 'SY', action: 'Payment received', detail: '$15,000 monthly subscription - Lincoln High', timestamp: '1 hour ago', status: 'success' },
      { id: '4', type: 'security', user: 'System', avatar: 'SY', action: 'Failed login attempt', detail: 'IP 203.0.113.45 - 3 failed attempts in 5 minutes', timestamp: '1 hour ago', status: 'error' },
      { id: '5', type: 'setting', user: 'Super Admin', avatar: 'SA', action: 'System configuration updated', detail: 'Email delivery settings modified', timestamp: '2 hours ago', status: 'success' },
      { id: '6', type: 'school', user: 'Sarah Johnson', avatar: 'SJ', action: 'Teacher account created', detail: 'Mr. David Wilson - Mathematics Department', timestamp: '3 hours ago', status: 'success' },
    ],
  },
  {
    label: 'Yesterday',
    activities: [
      { id: '7', type: 'system', user: 'System', avatar: 'SY', action: 'Daily backup completed', detail: 'Full system backup - 2.4 GB stored to S3', timestamp: 'Yesterday at 11:00 PM', status: 'success' },
      { id: '8', type: 'security', user: 'System', avatar: 'SY', action: 'Permission change detected', detail: 'Role permissions updated for School Admin role', timestamp: 'Yesterday at 8:30 PM', status: 'warning' },
      { id: '9', type: 'payment', user: 'Admin', avatar: 'AD', action: 'Invoice generated', detail: 'July 2024 invoice for Riverside Academy ($3,500)', timestamp: 'Yesterday at 6:15 PM', status: 'success' },
      { id: '10', type: 'user', user: 'Emily Wilson', avatar: 'EW', action: 'Student transferred', detail: '5 students transferred from Oakwood to Riverside', timestamp: 'Yesterday at 4:45 PM', status: 'success' },
      { id: '11', type: 'school', user: 'System', avatar: 'SY', action: 'School suspension lifted', detail: 'Mountain View Middle School reactivated', timestamp: 'Yesterday at 2:20 PM', status: 'warning' },
    ],
  },
  {
    label: 'Last 7 Days',
    activities: [
      { id: '12', type: 'system', user: 'System', avatar: 'SY', action: 'API rate limit exceeded', detail: 'Springfield Elementary exceeded 80% of API quota', timestamp: '3 days ago', status: 'warning' },
      { id: '13', type: 'setting', user: 'Super Admin', avatar: 'SA', action: 'Feature flag toggled', detail: 'New attendance module enabled for pilot schools', timestamp: '4 days ago', status: 'success' },
      { id: '14', type: 'user', user: 'System', avatar: 'SY', action: 'Account suspended', detail: 'User account "j.doe" suspended due to policy violation', timestamp: '5 days ago', status: 'error' },
      { id: '15', type: 'payment', user: 'System', avatar: 'SY', action: 'Subscription upgraded', detail: 'Riverside Academy upgraded from Pro to Enterprise', timestamp: '6 days ago', status: 'success' },
    ],
  },
];

const typeIcon: Record<string, typeof School> = {
  school: School,
  user: GraduationCap,
  payment: DollarSign,
  setting: Settings,
  security: Shield,
  system: FileText,
};

const statusColor: Record<string, string> = {
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
};

export default function ActivityTimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Activity Timeline</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time platform activity feed</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Platform Activity
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {groupedActivities.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">{group.label}</h3>
              <div className="space-y-0">
                {group.activities.map((activity, index) => {
                  const TypeIcon = typeIcon[activity.type];
                  const isLast = index === group.activities.length - 1;
                  return (
                    <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {!isLast && (
                        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                      )}
                      <div className="relative shrink-0">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          activity.status === 'error' ? 'bg-red-100 dark:bg-red-900/20' :
                          activity.status === 'warning' ? 'bg-amber-100 dark:bg-amber-900/20' :
                          'bg-primary/10'
                        }`}>
                          {activity.avatar.length <= 2 ? (
                            <span className="text-xs font-bold text-primary">{activity.avatar}</span>
                          ) : (
                            <TypeIcon className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">{activity.detail}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {activity.status && (
                              <div className={`${statusColor[activity.status]}`}>
                                {activity.status === 'success' ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <AlertCircle className="h-4 w-4" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-muted-foreground">{activity.user}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
