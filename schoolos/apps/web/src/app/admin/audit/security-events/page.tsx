'use client';

import { ShieldAlert, AlertTriangle, AlertCircle, Info, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface SecurityEvent {
  id: string;
  event: string;
  severity: Severity;
  source: string;
  timestamp: string;
  status: 'resolved' | 'investigating' | 'open' | 'dismissed';
}

const events: SecurityEvent[] = [
  { id: '1', event: 'Multiple failed login attempts detected', severity: 'critical', source: 'IP 203.0.113.45', timestamp: '2024-07-21 09:15:23', status: 'investigating' },
  { id: '2', event: 'Suspicious API key usage pattern', severity: 'high', source: 'API Key #789 - Springfield', timestamp: '2024-07-21 08:55:34', status: 'open' },
  { id: '3', event: 'Permission escalation attempt blocked', severity: 'critical', source: 'User: j.doe@external.com', timestamp: '2024-07-21 08:30:00', status: 'resolved' },
  { id: '4', event: 'New device login from unknown location', severity: 'medium', source: 'User: m.davis@riverside.org', timestamp: '2024-07-21 08:15:47', status: 'investigating' },
  { id: '5', event: 'Role permission change by super admin', severity: 'low', source: 'Super Admin - Dashboard', timestamp: '2024-07-21 07:58:22', status: 'resolved' },
  { id: '6', event: 'Brute force attack detected on admin panel', severity: 'critical', source: 'IP Range 185.220.100.0/24', timestamp: '2024-07-21 07:30:05', status: 'open' },
  { id: '7', event: 'SSL certificate expiring in 7 days', severity: 'medium', source: 'System - Auto Renewal', timestamp: '2024-07-21 06:45:11', status: 'open' },
  { id: '8', event: 'Unusual data export by school admin', severity: 'high', source: 'User: a.williams@oakwood.edu', timestamp: '2024-07-21 06:12:18', status: 'investigating' },
  { id: '9', event: 'Firewall configuration change detected', severity: 'low', source: 'System - Security Policy', timestamp: '2024-07-20 23:30:00', status: 'resolved' },
  { id: '10', event: 'Suspicious file upload - potential malware', severity: 'high', source: 'School: Lincoln High - User: j.smith', timestamp: '2024-07-20 22:15:45', status: 'dismissed' },
  { id: '11', event: 'Session token reused across IPs', severity: 'medium', source: 'User: e.wilson@oakwood.edu', timestamp: '2024-07-20 21:00:33', status: 'resolved' },
  { id: '12', event: 'Database connection pool exhausted', severity: 'high', source: 'System - Database Cluster', timestamp: '2024-07-20 20:30:00', status: 'resolved' },
];

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

const statusIcon = {
  resolved: CheckCircle2,
  investigating: Clock,
  open: AlertCircle,
  dismissed: XCircle,
};

const statusColor = {
  resolved: 'text-emerald-600',
  investigating: 'text-amber-600',
  open: 'text-red-600',
  dismissed: 'text-slate-400',
};

export default function SecurityEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Security Events</h1>
        <p className="text-sm text-muted-foreground mt-1">Security-related events requiring attention</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {(['critical', 'high', 'medium', 'low'] as Severity[]).map((sev) => {
          const count = events.filter(e => e.severity === sev && e.status !== 'dismissed').length;
          const total = events.filter(e => e.severity === sev).length;
          return (
            <Card key={sev}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${severityDot[sev]}`} />
                  <span className="text-sm font-medium capitalize">{sev}</span>
                </div>
                <p className="mt-2 text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{total} total events</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Security Event Log
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Event</th>
                  <th className="pb-3 font-medium text-muted-foreground">Severity</th>
                  <th className="pb-3 font-medium text-muted-foreground">Source</th>
                  <th className="pb-3 font-medium text-muted-foreground">Timestamp</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const SevIcon = severityIcon[event.severity];
                  const StatusIcon = statusIcon[event.status];
                  return (
                    <tr key={event.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-3 font-medium">{event.event}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${severityColor[event.severity]}`}>
                          <SevIcon className="h-3 w-3" />
                          {event.severity}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{event.source}</td>
                      <td className="py-3 text-muted-foreground whitespace-nowrap">{event.timestamp}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${statusColor[event.status]}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
