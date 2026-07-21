'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { DatabaseBackup, Download, Clock, CheckCircle2, XCircle, RefreshCw, Calendar, HardDrive } from 'lucide-react';

const lastBackup = {
  date: '2024-12-15 03:00:17',
  size: '2.4 GB',
  type: 'Full',
  status: 'completed',
  duration: '14m 23s',
};

const scheduleConfig = {
  frequency: 'Daily',
  time: '03:00 AM UTC',
  retention: '30 days',
  includeFiles: true,
  includeDatabase: true,
  compression: 'gzip',
};

const backups = [
  { date: '2024-12-15 03:00', size: '2.4 GB', type: 'Full', status: 'completed' },
  { date: '2024-12-14 03:00', size: '2.3 GB', type: 'Full', status: 'completed' },
  { date: '2024-12-13 03:00', size: '2.4 GB', type: 'Full', status: 'completed' },
  { date: '2024-12-12 03:00', size: '2.3 GB', type: 'Full', status: 'completed' },
  { date: '2024-12-11 03:00', size: '856 MB', type: 'Incremental', status: 'completed' },
  { date: '2024-12-10 03:00', size: '2.2 GB', type: 'Full', status: 'failed' },
  { date: '2024-12-09 03:00', size: '2.2 GB', type: 'Full', status: 'completed' },
];

const retentionOptions = [
  { label: 'Daily Backups', value: '30 days' },
  { label: 'Weekly Backups', value: '12 weeks' },
  { label: 'Monthly Backups', value: '12 months' },
  { label: 'Yearly Backups', value: '7 years' },
];

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function BackupPage() {
  const [running, setRunning] = useState(false);

  const handleManualBackup = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Backup Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure and manage system backups</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DatabaseBackup className="h-5 w-5 text-primary" />
              Last Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm font-medium">{lastBackup.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Size</span>
              <span className="text-sm font-medium">{lastBackup.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm font-medium">{lastBackup.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[lastBackup.status]}`}>
                {lastBackup.status === 'completed' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {lastBackup.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-medium">{lastBackup.duration}</span>
            </div>
            <button
              onClick={handleManualBackup}
              disabled={running}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {running ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {running ? 'Running Backup...' : 'Run Manual Backup'}
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Frequency</span>
              <span className="text-sm font-medium">{scheduleConfig.frequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="text-sm font-medium">{scheduleConfig.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Retention</span>
              <span className="text-sm font-medium">{scheduleConfig.retention}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Include Files</span>
              <span className="text-sm font-medium">{scheduleConfig.includeFiles ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Include Database</span>
              <span className="text-sm font-medium">{scheduleConfig.includeDatabase ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Compression</span>
              <span className="text-sm font-medium">{scheduleConfig.compression}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 font-medium text-muted-foreground">Size</th>
                  <th className="pb-3 font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.date} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{backup.date}</td>
                    <td className="py-3 text-muted-foreground">{backup.size}</td>
                    <td className="py-3">{backup.type}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[backup.status]}`}>
                        {backup.status === 'completed' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {backup.status}
                      </span>
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
            Retention Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {retentionOptions.map((option) => (
              <div key={option.label} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
