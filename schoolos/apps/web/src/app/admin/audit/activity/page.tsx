'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock, School, GraduationCap, DollarSign, Settings, Shield,
  FileText, CheckCircle2, AlertCircle, Loader2, AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { EmptyState } from '@/features/super-admin/components';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  description: string | null;
  ipAddress: string | null;
  createdAt: string;
  userEmail: string | null;
  userName: string | null;
}

interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  meta: { total: number };
}

const entityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  school: School,
  user: GraduationCap,
  payment: DollarSign,
  subscription: DollarSign,
  setting: Settings,
  security: Shield,
  system: FileText,
  role: Shield,
  permission: Shield,
  login: Shield,
  logout: Shield,
  api_key: KeyIcon,
};

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}

function getActionStatus(action: string): 'success' | 'warning' | 'error' {
  if (action === 'delete') return 'error';
  if (action === 'update' || action === 'permission') return 'warning';
  return 'success';
}

function getEntityType(entity: string): string {
  const entityLower = entity.toLowerCase();
  if (entityLower.includes('school')) return 'school';
  if (entityLower.includes('user') || entityLower.includes('student') || entityLower.includes('teacher')) return 'user';
  if (entityLower.includes('payment') || entityLower.includes('invoice') || entityLower.includes('subscription')) return 'payment';
  if (entityLower.includes('setting') || entityLower.includes('config')) return 'setting';
  if (entityLower.includes('login') || entityLower.includes('logout') || entityLower.includes('permission') || entityLower.includes('role')) return 'security';
  return 'system';
}

function groupByDate(logs: AuditLog[]): Array<{ label: string; activities: AuditLog[] }> {
  const groups: Record<string, AuditLog[]> = {};
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();

  for (const log of logs) {
    const date = new Date(log.createdAt);
    const dateStr = date.toDateString();
    let label: string;
    if (dateStr === today) label = 'Today';
    else if (dateStr === yesterday) label = 'Yesterday';
    else {
      const diff = (now.getTime() - date.getTime()) / 86400000;
      if (diff <= 7) label = 'Last 7 Days';
      else label = date.toLocaleDateString('en-CA');
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(log);
  }

  const order = ['Today', 'Yesterday', 'Last 7 Days'];
  return Object.entries(groups)
    .sort(([a], [b]) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return b.localeCompare(a);
    })
    .map(([label, activities]) => ({
      label,
      activities: activities.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return d.toLocaleString('en-CA', {
    hour: '2-digit', minute: '2-digit',
    hour12: false,
  });
}

export default function ActivityTimelinePage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/audit/logs?limit=100');
      const json: AuditLogsResponse = await res.json();

      if (!json.success) {
        setError('Failed to load activity');
        setLogs([]);
      } else {
        setLogs(json.data ?? []);
      }
    } catch {
      setError('Network error. Please try again.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const grouped = groupByDate(logs);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Activity Timeline</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time platform activity feed</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Platform Activity
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState title="No activity found" description="There is no recent platform activity to display." />
          ) : (
            <div className="space-y-8">
              {grouped.map((group) => (
                <div key={group.label}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                    {group.label}
                  </h3>
                  <div className="space-y-0">
                    {group.activities.map((activity, index) => {
                      const entityType = getEntityType(activity.entity);
                      const TypeIcon = entityIcons[entityType] || FileText;
                      const isLast = index === group.activities.length - 1;
                      const statusType = getActionStatus(activity.action);
                      const initials = (activity.userName || activity.userEmail || 'SY')
                        .split(' ')
                        .map((s) => s[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                          {!isLast && (
                            <div className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                          )}
                          <div className="relative shrink-0">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                statusType === 'error'
                                  ? 'bg-red-100 dark:bg-red-900/20'
                                  : statusType === 'warning'
                                    ? 'bg-amber-100 dark:bg-amber-900/20'
                                    : 'bg-primary/10'
                              }`}
                            >
                              {initials.length <= 2 ? (
                                <span className="text-xs font-bold text-primary">{initials}</span>
                              ) : (
                                <TypeIcon className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium capitalize">
                                  {activity.action} {activity.entity}
                                </p>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  {activity.description || '-'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {statusType === 'success' ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : statusType === 'error' ? (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                {activity.userEmail || activity.userName || 'System'}
                              </span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(activity.createdAt)}
                              </span>
                              {activity.ipAddress && (
                                <>
                                  <span className="text-xs text-muted-foreground">·</span>
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {activity.ipAddress}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
