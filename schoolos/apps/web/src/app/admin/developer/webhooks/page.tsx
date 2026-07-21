'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Webhook, Plus, Copy, CheckCircle2, XCircle, ExternalLink, Clock } from 'lucide-react';

const webhooks = [
  { id: '1', endpoint: 'https://hooks.example.com/schoolos', events: 'school.created, school.updated', secret: 'whsec_abc123', status: 'active', lastDelivery: '2024-12-15 12:30:22', lastStatus: 'success' },
  { id: '2', endpoint: 'https://api.partner.com/webhook', events: 'payment.completed, payment.failed', secret: 'whsec_def456', status: 'active', lastDelivery: '2024-12-15 11:15:08', lastStatus: 'success' },
  { id: '3', endpoint: 'https://monitor.example.com/alerts', events: 'system.alert, system.error', secret: 'whsec_ghi789', status: 'inactive', lastDelivery: '2024-12-14 08:45:00', lastStatus: 'failed' },
  { id: '4', endpoint: 'https://sync.data.com/hook', events: 'user.created, user.updated, user.deleted', secret: 'whsec_jkl012', status: 'active', lastDelivery: '2024-12-15 14:00:00', lastStatus: 'success' },
];

const deliveryLogs = [
  { timestamp: '2024-12-15 14:32:18', event: 'school.created', endpoint: 'https://hooks.example.com/schoolos', status: 'success', duration: '234ms' },
  { timestamp: '2024-12-15 14:30:05', event: 'payment.completed', endpoint: 'https://api.partner.com/webhook', status: 'success', duration: '187ms' },
  { timestamp: '2024-12-15 14:28:42', event: 'system.error', endpoint: 'https://monitor.example.com/alerts', status: 'failed', duration: '30s (timeout)' },
  { timestamp: '2024-12-15 14:25:10', event: 'user.created', endpoint: 'https://sync.data.com/hook', status: 'success', duration: '156ms' },
  { timestamp: '2024-12-15 14:20:33', event: 'school.updated', endpoint: 'https://hooks.example.com/schoolos', status: 'success', duration: '198ms' },
  { timestamp: '2024-12-15 14:15:00', event: 'payment.failed', endpoint: 'https://api.partner.com/webhook', status: 'success', duration: '212ms' },
];

export default function WebhooksPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Developer Webhooks</h1>
        <p className="text-sm text-muted-foreground mt-1">Webhook configuration for external integrations</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Webhook'}
        </button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Endpoint URL</label>
              <input type="text" placeholder="https://example.com/webhook" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Events (comma-separated)</label>
              <input type="text" placeholder="school.created, school.updated" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="flex justify-end">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Create Webhook</button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" />
            Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Endpoint</th>
                  <th className="pb-3 font-medium text-muted-foreground">Events Subscribed</th>
                  <th className="pb-3 font-medium text-muted-foreground">Secret</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Last Delivery</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((wh) => (
                  <tr key={wh.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-xs font-mono">{wh.endpoint}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{wh.events}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">{wh.secret}</span>
                        <Copy className="h-3 w-3 text-muted-foreground cursor-pointer" />
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        wh.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {wh.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">{wh.lastDelivery}</span>
                        {wh.lastStatus === 'success' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-500" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Delivery Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Timestamp</th>
                  <th className="pb-3 font-medium text-muted-foreground">Event</th>
                  <th className="pb-3 font-medium text-muted-foreground">Endpoint</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Duration</th>
                </tr>
              </thead>
              <tbody>
                {deliveryLogs.map((log, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-2.5 text-xs font-mono text-muted-foreground">{log.timestamp}</td>
                    <td className="py-2.5 text-xs">{log.event}</td>
                    <td className="py-2.5 text-xs font-mono text-muted-foreground">{log.endpoint}</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        log.status === 'success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {log.status === 'success' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground text-xs">{log.duration}</td>
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
