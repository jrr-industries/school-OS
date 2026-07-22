'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Building2,
  UserPlus,
  UserMinus,
  ShieldOff,
  ShieldCheck,
  Edit3,
  Trash2,
  RotateCcw,
  Loader2,
  School,
  Clock,
} from 'lucide-react';
import { SupabaseRealtime } from '@/lib/supabase-realtime';
import { createClientSupabaseClient } from '@schoolos/auth/client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  cn,
} from '@schoolos/ui';

interface ActivityEntry {
  id: string;
  schoolName: string;
  schoolId: string;
  action: string;
  actor: string;
  description: string;
  timestamp: string;
  type: 'created' | 'updated' | 'suspended' | 'activated' | 'deleted' | 'restored';
}

const ACTION_ICONS: Record<string, React.ElementType> = {
  created: UserPlus,
  updated: Edit3,
  suspended: ShieldOff,
  activated: ShieldCheck,
  deleted: Trash2,
  restored: RotateCcw,
};

const ACTION_COLORS: Record<string, string> = {
  created: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
  updated: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
  suspended: 'text-red-500 bg-red-50 dark:bg-red-950',
  activated: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950',
  deleted: 'text-destructive bg-destructive/10',
  restored: 'text-purple-500 bg-purple-50 dark:bg-purple-950',
};

const TIME_FILTERS = ['Today', 'This Week', 'This Month', 'All Time'] as const;

export default function SchoolActivityPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('All Time');

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClientSupabaseClient();
      let query = supabase
        .from('School')
        .select('id, name, status, updatedAt, createdAt')
        .order('updatedAt', { ascending: false })
        .limit(50);

      if (timeFilter === 'Today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('updatedAt', today.toISOString());
      } else if (timeFilter === 'This Week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('updatedAt', weekAgo.toISOString());
      } else if (timeFilter === 'This Month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('updatedAt', monthAgo.toISOString());
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw new Error(fetchError.message);

      const mapped: ActivityEntry[] = (data ?? []).map((school: Record<string, unknown>) => {
        const isDeleted = school.deletedAt != null;
        const status = school.status as string;
        let actionType: ActivityEntry['type'] = 'updated';
        if (status === 'suspended') actionType = 'suspended';
        else if (status === 'active' && school.deletedAt == null) actionType = 'activated';
        else if (isDeleted) actionType = 'deleted';

        return {
          id: school.id as string,
          schoolName: school.name as string,
          schoolId: school.id as string,
          action: actionType,
          actor: 'System',
          description: getActionDescription(actionType, school.name as string),
          timestamp: (school.updatedAt || school.createdAt) as string,
          type: actionType,
        };
      });

      setActivities(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity');
    } finally {
      setLoading(false);
    }
  }, [timeFilter]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  useEffect(() => {
    const unsubscribe = SupabaseRealtime.subscribe(
      { table: 'School', event: '*' },
      fetchActivities,
    );
    return unsubscribe;
  }, [fetchActivities]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>School Activity</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track changes and events across all schools
            </p>
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
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-destructive/10 p-4">
                <Loader2 className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">Something went wrong</h3>
              <p className="mb-6 text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={fetchActivities}>Try Again</Button>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-semibold">No activity yet</h3>
              <p className="text-sm text-muted-foreground">School activity will appear here as changes are made</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((entry, index) => {
                const Icon = ACTION_ICONS[entry.type] || Activity;
                const colorClass = ACTION_COLORS[entry.type] || 'text-muted-foreground bg-muted';
                return (
                  <motion.div
                    key={`${entry.id}-${index}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{entry.schoolName}</p>
                      <p className="text-sm text-muted-foreground truncate">{entry.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(entry.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getActionDescription(type: string, schoolName: string): string {
  switch (type) {
    case 'created': return `${schoolName} was registered on the platform`;
    case 'activated': return `${schoolName} was activated`;
    case 'suspended': return `${schoolName} was suspended`;
    case 'deleted': return `${schoolName} was moved to recycle bin`;
    case 'restored': return `${schoolName} was restored from recycle bin`;
    case 'updated': return `${schoolName} details were updated`;
    default: return `Changes were made to ${schoolName}`;
  }
}

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
