'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Webhook, Plus, CheckCircle2, XCircle, Clock, Trash2, RefreshCw } from 'lucide-react';

interface WebhookEntry {
  id: string;
  endpoint: string;
  events: string[];
  status: 'active' | 'inactive' | 'failing';
  lastDelivery: string;
  created: string;
}

const webhooks: WebhookEntry[] = [
  { id: '1', endpoint: 'https://api.example.com/hooks/school-created', events: ['school.created', 'school.updated'], status: 'active', lastDelivery: '2 min ago', created: '2026-01-15' },
  { id: '2', endpoint: 'https://hooks.company.com/student-enrollment', events: ['student.enrolled', 'student.withdrawn'], status: 'active', lastDelivery: '15 min ago', created: '2026-03-20' },
  { id: '3', endpoint: 'https://webhook.site/payments', events: ['payment.received', 'payment.failed'], status: 'failing', lastDelivery: '1 hour ago', created: '2026-02-10' },
  { id: '4', endpoint: 'https://api.partner.org/sync', events: ['user.created', 'user.updated', 'user.deleted'], status: 'active', lastDelivery: '5 min ago', created: '2026-04-05' },
  { id: '5', endpoint: 'https://old-system.com/webhook', events: ['school.created'], status: 'inactive', lastDelivery: '3 months ago', created: '2025-06-01' },
  { id: '6', endpoint: 'https://analytics.example.com/events', events: ['attendance.recorded', 'grade.submitted'], status: 'active', lastDelivery: '30 min ago', created: '2026-05-20' },
];

const statusBadge = (status: WebhookEntry['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'inactive': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    case 'failing': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
};

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Webhooks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage webhook endpoints</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Plus className="h-4 w-4" />
          Add Webhook
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" />
            Webhook Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Endpoint URL</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Events</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Status</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Last Delivery</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Created</th>
                  <th className="text-right font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((w) => (
                  <tr key={w.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4 max-w-[200px]">
                      <span className="font-mono text-xs truncate block" title={w.endpoint}>{w.endpoint}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {w.events.map((ev) => (
                          <span key={ev} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(w.status)}`}>
                        {w.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> :
                         w.status === 'failing' ? <XCircle className="h-3 w-3" /> :
                         <Clock className="h-3 w-3" />}
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground">{w.lastDelivery}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{w.created}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors" aria-label="Test webhook">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors" aria-label="Delete webhook">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
