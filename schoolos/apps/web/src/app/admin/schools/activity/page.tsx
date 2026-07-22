'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Activity, Building2, UserPlus, ShieldAlert, Settings,
  Loader2, Clock, Trash2, RotateCcw, CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@schoolos/ui';

interface ActivityEntry {
  id: string;
  schoolName: string;
  action: string;
  description: string;
  timestamp: string;
  icon: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  created: UserPlus,
  activated: CheckCircle,
  suspended: ShieldAlert,
  deleted: Trash2,
  restored: RotateCcw,
  updated: Settings,
  default: Activity,
};

const TIME_FILTERS = ['All Time', 'Today', 'This Week', 'This Month'] as const;

export default function SchoolActivityPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('All Time');

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (timeFilter !== 'All Time') params.set('period', timeFilter.toLowerCase().replace(' ', '_'));

      const res = await fetch(`/api/admin/schools/activity?${params}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Failed to load activity');
        return;
      }
      setActivities(data.data ?? []);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [timeFilter]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  function formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">School Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">Recent activity across all schools</p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_FILTERS.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <Activity className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading activity...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No activity yet</h3>
          <p className="text-sm text-muted-foreground">School activity will appear here as changes are made</p>
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">Activity Feed</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-0">
              {activities.map((item, index) => {
                const Icon = ICON_MAP[item.icon] || ICON_MAP.default;
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-start gap-4 border-b py-4 last:border-0"
                  >
                    <div className="rounded-full bg-primary/10 p-2 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        <Building2 className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                        {item.schoolName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
