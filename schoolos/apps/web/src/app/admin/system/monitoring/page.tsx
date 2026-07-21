'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Activity, Cpu, HardDrive, MemoryStick, BarChart3, ArrowUp, Layers } from 'lucide-react';

interface Timeframe {
  label: string;
  value: string;
}

const timeframes: Timeframe[] = [
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
];

interface TopConsumer {
  rank: number;
  name: string;
  type: 'process' | 'user' | 'school';
  cpu: number;
  memory: number;
}

const topConsumers: TopConsumer[] = [
  { rank: 1, name: 'Report Generation Worker', type: 'process', cpu: 45, memory: 512 },
  { rank: 2, name: 'Data Sync Service', type: 'process', cpu: 32, memory: 384 },
  { rank: 3, name: 'Lincoln High School', type: 'school', cpu: 18, memory: 256 },
  { rank: 4, name: 'Email Campaign Engine', type: 'process', cpu: 15, memory: 192 },
  { rank: 5, name: 'Springfield Elementary', type: 'school', cpu: 8, memory: 128 },
  { rank: 6, name: 'Bulk Import - Admin', type: 'user', cpu: 6, memory: 96 },
];

interface ActiveProcess {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'idle' | 'blocked';
  started: string;
}

const activeProcesses: ActiveProcess[] = [
  { pid: 2847, name: 'node server.js', cpu: 12.4, memory: 256, status: 'running', started: '2 days ago' },
  { pid: 3102, name: 'bull:queue-processor', cpu: 8.7, memory: 192, status: 'running', started: '5 days ago' },
  { pid: 1823, name: 'nginx: worker', cpu: 3.2, memory: 64, status: 'running', started: '14 days ago' },
  { pid: 4491, name: 'redis-server', cpu: 1.8, memory: 128, status: 'running', started: '30 days ago' },
  { pid: 5210, name: 'postgres: writer', cpu: 5.6, memory: 384, status: 'running', started: '30 days ago' },
  { pid: 6732, name: 'cron: backup-job', cpu: 0.5, memory: 32, status: 'idle', started: '7 days ago' },
];

export default function MonitoringPage() {
  const [activeTimeframe, setActiveTimeframe] = useState('1h');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">System performance monitoring</p>
        </div>
        <div className="inline-flex items-center rounded-lg border border-input bg-background p-0.5">
          {timeframes.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTimeframe(t.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTimeframe === t.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <span className="text-sm font-bold">62%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-3 rounded-full bg-orange-500" style={{ width: '62%' }} />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
              <span>8 cores</span>
              <span>Avg: 58%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <span className="text-sm font-bold">4.2 / 8 GB</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-3 rounded-full bg-primary" style={{ width: '52%' }} />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
              <span>8 GB total</span>
              <span>Peak: 6.1 GB</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Disk Usage</span>
              </div>
              <span className="text-sm font-bold">342 / 500 GB</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-3 rounded-full bg-yellow-500" style={{ width: '68%' }} />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
              <span>SSD</span>
              <span>68% used</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Consumers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topConsumers.map((c) => (
                <div key={c.rank} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-4">{c.rank}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.cpu}% CPU</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                        c.type === 'process' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        c.type === 'school' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        <Layers className="h-3 w-3 mr-0.5" />
                        {c.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{c.memory} MB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Active Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-medium text-muted-foreground pb-2 pr-3">PID</th>
                    <th className="text-left font-medium text-muted-foreground pb-2 pr-3">Name</th>
                    <th className="text-right font-medium text-muted-foreground pb-2 pr-3">CPU%</th>
                    <th className="text-right font-medium text-muted-foreground pb-2 pr-3">Memory</th>
                    <th className="text-left font-medium text-muted-foreground pb-2 pr-3">Status</th>
                    <th className="text-left font-medium text-muted-foreground pb-2">Started</th>
                  </tr>
                </thead>
                <tbody>
                  {activeProcesses.map((p) => (
                    <tr key={p.pid} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">{p.pid}</td>
                      <td className="py-2 pr-3 font-mono text-xs font-medium">{p.name}</td>
                      <td className="py-2 pr-3 text-right text-xs">{p.cpu.toFixed(1)}%</td>
                      <td className="py-2 pr-3 text-right text-xs">{p.memory} MB</td>
                      <td className="py-2 pr-3">
                        <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                          p.status === 'running' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          p.status === 'idle' ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">{p.started}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowUp className="h-5 w-5 text-primary" />
            System Load Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold">1.24</p>
              <p className="text-xs text-muted-foreground">1 min load</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0.98</p>
              <p className="text-xs text-muted-foreground">5 min load</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0.76</p>
              <p className="text-xs text-muted-foreground">15 min load</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
