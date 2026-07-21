'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Clock, Loader2, CheckCircle2, TrendingUp, Activity } from 'lucide-react';

const queues = [
  { name: 'emails', pending: 47, processing: 3, failed: 2, throughput: '142/hr' },
  { name: 'notifications', pending: 23, processing: 1, failed: 0, throughput: '890/hr' },
  { name: 'reports', pending: 5, processing: 1, failed: 0, throughput: '12/hr' },
  { name: 'webhooks', pending: 89, processing: 2, failed: 5, throughput: '234/hr' },
  { name: 'backups', pending: 0, processing: 1, failed: 0, throughput: '2/hr' },
];

const totalStats = {
  pending: queues.reduce((s, q) => s + q.pending, 0),
  processing: queues.reduce((s, q) => s + q.processing, 0),
  failed: queues.reduce((s, q) => s + q.failed, 0),
};

export default function QueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Queue Monitor</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time queue monitoring dashboard</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100/10 p-2">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100/10 p-2">
                <Loader2 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStats.processing}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100/10 p-2">
                <CheckCircle2 className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStats.failed}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Queue Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queues.map((queue) => (
              <div key={queue.name} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{queue.name}</h3>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    {queue.throughput}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold text-amber-600">{queue.pending}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Processing</p>
                    <p className="text-lg font-bold text-blue-600">{queue.processing}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Failed</p>
                    <p className="text-lg font-bold text-red-600">{queue.failed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
