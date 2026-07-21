'use client';

import { WidgetCard } from '../shared/widget-card';
import { EmptyState } from '../shared/empty-state';
import { cn } from '@schoolos/ui';
import { ClipboardList, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import type { TaskCenterItem } from '../../types';

interface TaskCenterProps {
  tasks?: TaskCenterItem[];
  isLoading?: boolean;
  error?: string;
}

const mockTasks: TaskCenterItem[] = [
  { id: '1', type: 'approval', title: 'New Student Approval', description: 'John Doe - Class 10-A', priority: 'high', status: 'pending', user: { name: 'Admissions' }, timestamp: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: '2', type: 'leave', title: 'Leave Request', description: 'Mrs. Sharma - Apr 15-17', priority: 'medium', status: 'pending', user: { name: 'Teacher' }, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '3', type: 'fee', title: 'Fee Verification', description: 'Priya Singh - ₹25,000', priority: 'urgent', status: 'in_review', user: { name: 'Accounts' }, timestamp: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: '4', type: 'transport', title: 'Route Change Request', description: 'Bus 7 - New stop at Sector 5', priority: 'low', status: 'pending', user: { name: 'Transport' }, timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: '5', type: 'library', title: 'Book Return Overdue', description: 'The Great Gatsby - 5 days overdue', priority: 'medium', status: 'pending', user: { name: 'Library' }, timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
];

const priorityStyles = {
  low: 'text-slate-500 bg-slate-50 dark:bg-slate-950',
  medium: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
  high: 'text-orange-500 bg-orange-50 dark:bg-orange-950',
  urgent: 'text-red-500 bg-red-50 dark:bg-red-950',
};

const statusIcons = {
  pending: Clock,
  in_review: AlertCircle,
  approved: CheckCircle2,
  rejected: XCircle,
};

export function TaskCenter({ tasks, isLoading, error }: TaskCenterProps) {
  const data = tasks ?? mockTasks;

  return (
    <WidgetCard
      title="Task Center"
      description={`${data.length} pending items`}
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      {data.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No pending tasks"
          description="All caught up!"
        />
      ) : (
        <div className="space-y-2">
          {data.map((task) => {
            const StatusIcon = statusIcons[task.status];
            return (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <StatusIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium truncate">{task.title}</p>
                    <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-medium capitalize', priorityStyles[task.priority])}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{task.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{task.user.name}</span>
                    <span>&middot;</span>
                    <span>{formatRelativeTime(task.timestamp)}</span>
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
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
