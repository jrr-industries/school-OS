'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, AlertCircle, Info,
  CheckCircle2, XCircle, Clock,
} from 'lucide-react';
import { PageHeader, DataTable } from '@/features/super-admin/components';
import type { Column } from '@/features/super-admin/components/SearchFilter';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
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

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface SecurityEvent extends AuditLog {
  severity: Severity;
  eventStatus: 'resolved' | 'investigating' | 'open' | 'dismissed';
}

const severityIcon: Record<Severity, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: AlertCircle,
  medium: Info,
  low: Info,
};

const severityColor: Record<Severity, string> = {
  critical: 'text-red-600 bg-red-50 dark:bg-red-950/20',
  high: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20',
  medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
  low: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
};

const severityDot: Record<Severity, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
};

const statusIcon: Record<string, typeof CheckCircle2> = {
  resolved: CheckCircle2,
  investigating: Clock,
  open: AlertCircle,
  dismissed: XCircle,
};

const statusColor: Record<string, string> = {
  resolved: 'text-emerald-600',
  investigating: 'text-amber-600',
  open: 'text-red-600',
  dismissed: 'text-slate-400',
};

function classifySeverity(log: AuditLog): Severity {
  const desc = (log.description || '').toLowerCase();
  const action = log.action.toLowerCase();

  if (
    desc.includes('brute') || desc.includes('malware') ||
    desc.includes('exploit') || desc.includes('breach') ||
    desc.includes('escalation')
  ) return 'critical';

  if (
    desc.includes('suspicious') || desc.includes('unauthorized') ||
    desc.includes('failed') || desc.includes('blocked') ||
    action === 'delete'
  ) return 'high';

  if (
    desc.includes('expir') || desc.includes('change') ||
    desc.includes('warning') || desc.includes('limit')
  ) return 'medium';

  return 'low';
}

function classifyStatus(log: AuditLog): SecurityEvent['eventStatus'] {
  const desc = (log.description || '').toLowerCase();
  if (desc.includes('resolved') || desc.includes('completed')) return 'resolved';
  if (desc.includes('dismiss') || desc.includes('ignored')) return 'dismissed';
  if (desc.includes('investigat') || desc.includes('review')) return 'investigating';
  return 'open';
}

function isSecurityRelated(log: AuditLog): boolean {
  const desc = (log.description || '').toLowerCase();
  const action = log.action.toLowerCase();
  const entity = log.entity.toLowerCase();

  const securityActions = ['login', 'logout', 'permission'];
  const securityEntities = ['security', 'permission', 'role', 'api_key', 'session', 'mfa'];
  const securityKeywords = [
    'fail', 'denied', 'blocked', 'suspicious', 'unauthorized',
    'brute', 'malware', 'attack', 'exploit', 'breach',
    'escalation', 'expir', 'certificate', 'firewall',
  ];

  if (securityActions.includes(action) && entity !== 'school') return true;
  if (securityEntities.includes(entity)) return true;
  if (securityKeywords.some((kw) => desc.includes(kw))) return true;

  return false;
}

export default function SecurityEventsPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/audit/logs?limit=100');
      const json: AuditLogsResponse = await res.json();

      if (!json.success) {
        setError('Failed to load security events');
        setEvents([]);
        return;
      }

      const allLogs = json.data ?? [];
      const securityLogs = allLogs.filter(isSecurityRelated);

      const securityEvents: SecurityEvent[] = securityLogs.map((log) => ({
        ...log,
        severity: classifySeverity(log),
        eventStatus: classifyStatus(log),
      }));

      securityEvents.sort((a, b) => {
        const sevOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        const diff = sevOrder[a.severity] - sevOrder[b.severity];
        if (diff !== 0) return diff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setEvents(securityEvents);
    } catch {
      setError('Network error. Please try again.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const severityCounts = (['critical', 'high', 'medium', 'low'] as Severity[]).map((sev) => ({
    severity: sev,
    active: events.filter((e) => e.severity === sev && e.eventStatus !== 'dismissed').length,
    total: events.filter((e) => e.severity === sev).length,
  }));

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  };

  const columns: Column<SecurityEvent>[] = [
    {
      key: 'description',
      header: 'Event',
      accessor: (row) => (
        <div>
          <div className="font-medium text-sm">{row.description || `${row.action} ${row.entity}`}</div>
          <div className="text-xs text-muted-foreground">{row.userEmail || row.userName || 'System'}</div>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${severityColor[row.severity]}`}>
          {severityIcon[row.severity]({ className: 'h-3 w-3' }) as any}
          {row.severity}
        </span>
      ),
    },
    {
      key: 'ipAddress',
      header: 'Source',
      accessor: (row) => (
        <span className="text-xs text-muted-foreground">{row.ipAddress || '-'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Timestamp',
      accessor: (row) => (
        <span className="text-muted-foreground whitespace-nowrap text-xs">
          {formatDate(row.createdAt)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'eventStatus',
      header: 'Status',
      accessor: (row) => {
        const StatIcon = statusIcon[row.eventStatus];
        return (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${statusColor[row.eventStatus]}`}>
            <StatIcon className="h-3.5 w-3.5" />
            {row.eventStatus}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Events"
        description="Security-related events requiring attention"
      />

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-4">
          {severityCounts.map(({ severity, active, total }) => (
            <div key={severity} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${severityDot[severity]}`} />
                <span className="text-sm font-medium capitalize">{severity}</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{active}</p>
              <p className="text-xs text-muted-foreground">{total} total events</p>
            </div>
          ))}
        </div>
      )}

      <DataTable
        columns={columns}
        data={events}
        keyExtractor={(row) => row.id}
        loading={loading}
        emptyMessage="No security events found."
      />
    </div>
  );
}
