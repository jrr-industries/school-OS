'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Calendar, Play, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

interface CronJob {
  command: string;
  schedule: string;
  status: 'active' | 'inactive';
  lastRun: string;
  nextRun: string;
  duration: string;
}

const initialJobs: CronJob[] = [
  { command: 'schedule:backup --daily', schedule: '0 3 * * *', status: 'active', lastRun: '2024-12-15 03:00', nextRun: '2024-12-16 03:00', duration: '14m 23s' },
  { command: 'schedule:sync-ldap', schedule: '0 * * * *', status: 'active', lastRun: '2024-12-15 14:00', nextRun: '2024-12-15 15:00', duration: '2m 45s' },
  { command: 'schedule:cleanup-logs', schedule: '0 4 * * *', status: 'active', lastRun: '2024-12-15 04:00', nextRun: '2024-12-16 04:00', duration: '1m 12s' },
  { command: 'schedule:generate-reports', schedule: '0 7 * * 1', status: 'inactive', lastRun: '2024-12-08 07:00', nextRun: '2024-12-15 07:00', duration: '5m 30s' },
  { command: 'schedule:send-digest', schedule: '0 8 * * 1-5', status: 'active', lastRun: '2024-12-15 08:00', nextRun: '2024-12-16 08:00', duration: '45s' },
  { command: 'schedule:index-search', schedule: '*/30 * * * *', status: 'active', lastRun: '2024-12-15 14:30', nextRun: '2024-12-15 15:00', duration: '3m 18s' },
  { command: 'schedule:purge-expired', schedule: '0 2 * * *', status: 'inactive', lastRun: '2024-12-14 02:00', nextRun: '2024-12-15 02:00', duration: '4m 05s' },
];

export default function CronJobsPage() {
  const [jobs, setJobs] = useState<CronJob[]>(initialJobs);
  const [runningJobs, setRunningJobs] = useState<Set<string>>(new Set());

  const toggleStatus = (command: string) => {
    setJobs((prev) => prev.map((j) => j.command === command ? { ...j, status: j.status === 'active' ? 'inactive' : 'active' } : j));
  };

  const handleRun = (command: string) => {
    setRunningJobs((prev) => new Set(prev).add(command));
    setTimeout(() => {
      setRunningJobs((prev) => {
        const next = new Set(prev);
        next.delete(command);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cron Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage scheduled cron jobs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Scheduled Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Command</th>
                  <th className="pb-3 font-medium text-muted-foreground">Schedule (Cron)</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Last Run</th>
                  <th className="pb-3 font-medium text-muted-foreground">Next Run</th>
                  <th className="pb-3 font-medium text-muted-foreground">Duration</th>
                  <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.command} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-mono text-xs font-medium">{job.command}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{job.schedule}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        job.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">{job.lastRun}</td>
                    <td className="py-3 text-xs">{job.nextRun}</td>
                    <td className="py-3 text-muted-foreground text-xs">{job.duration}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRun(job.command)}
                          disabled={runningJobs.has(job.command) || job.status === 'inactive'}
                          className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                          title="Run now"
                        >
                          {runningJobs.has(job.command) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleStatus(job.command)}
                          className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title={job.status === 'active' ? 'Disable' : 'Enable'}
                        >
                          {job.status === 'active' ? (
                            <ToggleRight className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                          )}
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
