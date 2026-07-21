'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search, ChevronDown, ChevronUp,
  Plus, Pencil, Trash2, LogIn, LogOut, Ban, CheckCircle,
  Monitor, CalendarDays, Filter, X, ListEnd, AlertCircle
} from 'lucide-react';
import {
  Button, Input, Card, CardContent, CardHeader, CardTitle, Select, cn
} from '@schoolos/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/features/school-admin/components/page-header';
import { useFirebaseAuth } from '@/features/firebase/hooks/use-firebase-auth';
import { RealtimeService } from '@/features/firebase/services/realtime.service';
import type { AuditLogEntry } from '@/features/firebase/types';

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  login: LogIn,
  logout: LogOut,
  suspend: Ban,
  activate: CheckCircle,
};

const ACTION_COLORS: Record<string, string> = {
  create: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
  update: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
  delete: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  login: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
  logout: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
  suspend: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400',
  activate: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
};

const ACTION_LABELS: Record<string, string> = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  login: 'Login',
  logout: 'Logout',
  suspend: 'Suspend',
  activate: 'Activate',
};

const ITEMS_PER_PAGE = 15;

function AuditLogSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

export default function AuditLogsPage() {
  const { schoolId } = useFirebaseAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [performedByFilter, setPerformedByFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    const unsub = RealtimeService.subscribeList<AuditLogEntry>(
      `schools/${schoolId}/auditLogs`,
      (items) => {
        setLogs(items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setLoading(false);
      },
    );
    return unsub;
  }, [schoolId]);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          log.action.toLowerCase().includes(q) ||
          (log.performedBy || '').toLowerCase().includes(q) ||
          (log.target || '').toLowerCase().includes(q) ||
          (log.details || '').toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (performedByFilter) {
        const p = performedByFilter.toLowerCase();
        if (!(log.performedBy || '').toLowerCase().includes(p)) return false;
      }
      return true;
    });
  }, [logs, actionFilter, search, performedByFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, actionFilter, performedByFilter]);

  function formatTimestamp(ts: string) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all administrative actions in your school"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Audit Logs' },
        ]}
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ListEnd className="h-4 w-4" />
            <span>{filtered.length} entries</span>
          </div>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Activity Log</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-56 sm:w-64"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && 'bg-muted')}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Action Type</p>
                    <Select value={actionFilter} onValueChange={(v) => setActionFilter(v)}>
                      {[{ value: 'all', label: 'All Actions' }, ...Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label }))].map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Performed By</p>
                    <Input
                      placeholder="Filter by name..."
                      value={performedByFilter}
                      onChange={(e) => setPerformedByFilter(e.target.value)}
                      className="w-44"
                    />
                  </div>
                  {(actionFilter !== 'all' || performedByFilter) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setActionFilter('all'); setPerformedByFilter(''); }}
                      className="mt-4"
                    >
                      <X className="mr-1 h-3 w-3" /> Clear filters
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <AuditLogSkeleton />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Search className="h-12 w-12 mb-3" />
              <p className="text-sm font-medium">No audit logs found</p>
              <p className="text-xs mt-1">
                {search || actionFilter !== 'all' || performedByFilter
                  ? 'Try adjusting your search filters'
                  : 'Audit logs will appear here as actions are performed'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-3 font-medium w-10" />
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Performed By</th>
                    <th className="px-4 py-3 font-medium">Target</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">IP Address</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((log) => {
                    const ActionIcon = ACTION_ICONS[log.action] || AlertCircle;
                    const isExpanded = expandedId === log.id;
                    return (
                      <tr
                        key={log.id}
                        className={cn(
                          'border-b last:border-0 transition-colors cursor-pointer',
                          isExpanded ? 'bg-muted/50' : 'hover:bg-muted/30',
                        )}
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      >
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : log.id); }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm whitespace-nowrap" title={new Date(log.timestamp).toLocaleString()}>
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'flex h-7 w-7 items-center justify-center rounded-full',
                              ACTION_COLORS[log.action] || 'bg-muted text-muted-foreground',
                            )}>
                              <ActionIcon className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm capitalize font-medium">
                              {ACTION_LABELS[log.action] || log.action.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{log.performedBy || '-'}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-[160px] truncate">
                          {log.target || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                          <span className="font-mono text-xs">{log.ipAddress || '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell max-w-[160px] truncate">
                          {log.device ? (
                            <span className="flex items-center gap-1">
                              <Monitor className="h-3 w-3 shrink-0" />
                              <span className="truncate">{log.device}</span>
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length > 0 && (
                <AnimatePresence>
                  {paginated
                    .filter((log) => expandedId === log.id)
                    .map((log) => (
                      <motion.tr
                        key={`detail-${log.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b bg-muted/30"
                      >
                        <td colSpan={7} className="px-4 py-3">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-lg border bg-background p-3">
                              <p className="text-xs text-muted-foreground">Action</p>
                              <p className="text-sm font-medium capitalize mt-0.5">
                                {ACTION_LABELS[log.action] || log.action.replace(/_/g, ' ')}
                              </p>
                            </div>
                            <div className="rounded-lg border bg-background p-3">
                              <p className="text-xs text-muted-foreground">Target</p>
                              <p className="text-sm font-medium mt-0.5">{log.target || '-'}</p>
                            </div>
                            <div className="rounded-lg border bg-background p-3">
                              <p className="text-xs text-muted-foreground">Performed By</p>
                              <p className="text-sm font-medium mt-0.5">{log.performedBy || '-'}</p>
                            </div>
                            <div className="rounded-lg border bg-background p-3">
                              <p className="text-xs text-muted-foreground">IP Address</p>
                              <p className="text-sm font-mono mt-0.5">{log.ipAddress || '-'}</p>
                            </div>
                            <div className="rounded-lg border bg-background p-3">
                              <p className="text-xs text-muted-foreground">Device</p>
                              <p className="text-sm font-medium mt-0.5 truncate">{log.device || '-'}</p>
                            </div>
                            <div className="rounded-lg border bg-background p-3">
                              <p className="text-xs text-muted-foreground">Timestamp</p>
                              <p className="text-sm font-medium mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                            {log.details && (
                              <div className="rounded-lg border bg-background p-3 sm:col-span-3">
                                <p className="text-xs text-muted-foreground">Details</p>
                                <p className="text-sm mt-0.5 whitespace-pre-wrap">{log.details}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                </AnimatePresence>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
