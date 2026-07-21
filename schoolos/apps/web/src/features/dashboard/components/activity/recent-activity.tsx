'use client';

import { WidgetCard } from '../shared/widget-card';
import { EmptyState } from '../shared/empty-state';
import { cn } from '@schoolos/ui';
import { Activity, UserPlus, ClipboardCheck, IndianRupee, FileEdit, ClipboardList, Bus, MessageSquare, FileText } from 'lucide-react';
import type { RecentActivity } from '../../types';

const activityIcons = {
  admission: UserPlus,
  attendance: ClipboardCheck,
  fee: IndianRupee,
  homework: FileEdit,
  assignment: ClipboardList,
  transport: Bus,
  communication: MessageSquare,
  audit: FileText,
};

const activityColors = {
  admission: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
  attendance: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950',
  fee: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
  homework: 'text-purple-500 bg-purple-50 dark:bg-purple-950',
  assignment: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950',
  transport: 'text-orange-500 bg-orange-50 dark:bg-orange-950',
  communication: 'text-rose-500 bg-rose-50 dark:bg-rose-950',
  audit: 'text-slate-500 bg-slate-50 dark:bg-slate-950',
};

interface RecentActivityProps {
  activities?: RecentActivity[];
  isLoading?: boolean;
  error?: string;
}

const mockActivities: RecentActivity[] = [
  { id: '1', type: 'admission', title: 'New student admitted', description: 'John Doe enrolled in Class 10-A', user: { name: 'Admin' }, timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: '2', type: 'attendance', title: 'Attendance marked', description: 'Class 9-B - 85% present', user: { name: 'Mrs. Sharma' }, timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: '3', type: 'fee', title: 'Fee payment received', description: '₹25,000 received from Priya Singh', user: { name: 'Accountant' }, timestamp: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: '4', type: 'homework', title: 'Homework assigned', description: 'Mathematics - Chapter 5 exercises', user: { name: 'Mr. Verma' }, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '5', type: 'transport', title: 'Bus route updated', description: 'Route 7 - New stop added', user: { name: 'Transport Dept' }, timestamp: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: '6', type: 'communication', title: 'Announcement sent', description: 'Parent-teacher meeting on Saturday', user: { name: 'Principal' }, timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: '7', type: 'audit', title: 'Settings updated', description: 'Academic year 2025-26 activated', user: { name: 'Admin' }, timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '8', type: 'assignment', title: 'Assignment submitted', description: 'Science project - Solar System', user: { name: 'Rahul K.' }, timestamp: new Date(Date.now() - 6 * 3600000).toISOString() },
];

export function RecentActivityWidget({ activities, isLoading, error }: RecentActivityProps) {
  const data = activities ?? mockActivities;

  return (
    <WidgetCard
      title="Recent Activity"
      description="Latest actions across the school"
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      {data.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No recent activity"
          description="Activity will appear here as actions are performed"
        />
      ) : (
        <div className="divide-y">
          {data.slice(0, 8).map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
              >
                <div className={cn('rounded-lg p-1.5', activityColors[activity.type])}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{activity.user.name}</span>
                    <span>&middot;</span>
                    <span>{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
