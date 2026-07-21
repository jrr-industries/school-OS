'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Cpu, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const stats = [
  { label: 'Pending', value: '12', icon: Clock, color: 'text-amber-600' },
  { label: 'Running', value: '3', icon: Loader2, color: 'text-blue-600' },
  { label: 'Failed', value: '1', icon: XCircle, color: 'text-red-600' },
  { label: 'Completed (Today)', value: '1,847', icon: CheckCircle2, color: 'text-emerald-600' },
];

const jobs = [
  { name: 'Process Email Queue', queue: 'emails', status: 'running', attempts: '1/3', created: '2024-12-15 08:00', lastRun: '2024-12-15 08:30', schedule: 'Every 5 min' },
  { name: 'Generate Reports', queue: 'reports', status: 'pending', attempts: '0/3', created: '2024-12-15 07:00', lastRun: '2024-12-15 07:00', schedule: 'Daily 07:00' },
  { name: 'Send Notifications', queue: 'notifications', status: 'completed', attempts: '1/1', created: '2024-12-15 06:00', lastRun: '2024-12-15 06:00', schedule: 'Every 10 min' },
  { name: 'Backup Database', queue: 'backups', status: 'completed', attempts: '1/1', created: '2024-12-15 03:00', lastRun: '2024-12-15 03:00', schedule: 'Daily 03:00' },
  { name: 'Sync LDAP Users', queue: 'sync', status: 'failed', attempts: '2/3', created: '2024-12-14 22:00', lastRun: '2024-12-14 22:00', schedule: 'Hourly' },
  { name: 'Cleanup Temp Files', queue: 'maintenance', status: 'pending', attempts: '0/3', created: '2024-12-15 04:00', lastRun: '2024-12-15 04:00', schedule: 'Daily 04:00' },
  { name: 'Index Search Data', queue: 'search', status: 'running', attempts: '1/3', created: '2024-12-15 05:00', lastRun: '2024-12-15 05:00', schedule: 'Every 30 min' },
];

const statusStyles: Record<string, string> = {
  running: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Background Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor and manage background job queues</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg bg-opacity-10 p-2 ${stat.color.replace('text-', 'bg-')}/10`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Job Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Job Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Queue</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Attempts</th>
                  <th className="pb-3 font-medium text-muted-foreground">Created</th>
                  <th className="pb-3 font-medium text-muted-foreground">Last Run</th>
                  <th className="pb-3 font-medium text-muted-foreground">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.name} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{job.name}</td>
                    <td className="py-3 text-muted-foreground">{job.queue}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[job.status]}`}>
                        {job.status === 'running' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{job.attempts}</td>
                    <td className="py-3 text-muted-foreground">{job.created}</td>
                    <td className="py-3 text-muted-foreground">{job.lastRun}</td>
                    <td className="py-3">{job.schedule}</td>
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
