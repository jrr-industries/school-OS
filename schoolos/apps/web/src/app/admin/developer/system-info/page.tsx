'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Server, Database, Puzzle, Gauge, HardDrive, Activity, Globe } from 'lucide-react';

const infoSections = [
  {
    title: 'Server Software',
    icon: Server,
    items: [
      { label: 'Web Server', value: 'Nginx 1.24.0' },
      { label: 'PHP Version', value: '8.2.18' },
      { label: 'OS', value: 'Ubuntu 22.04.4 LTS' },
      { label: 'Kernel', value: '5.15.0-105-generic' },
      { label: 'Architecture', value: 'x86_64' },
    ],
  },
  {
    title: 'Database',
    icon: Database,
    items: [
      { label: 'Database', value: 'PostgreSQL 16.2' },
      { label: 'Connection', value: '127.0.0.1:5432' },
      { label: 'Max Connections', value: '100' },
      { label: 'Uptime', value: '32d 14h 22m' },
    ],
  },
  {
    title: 'PHP Extensions',
    icon: Puzzle,
    items: [
      { label: 'PDO', value: 'Enabled' },
      { label: 'Redis', value: 'Enabled (6.0.2)' },
      { label: 'GD', value: 'Enabled' },
      { label: 'BCMath', value: 'Enabled' },
      { label: 'OpenSSL', value: 'Enabled' },
      { label: 'mbstring', value: 'Enabled' },
      { label: 'XML', value: 'Enabled' },
      { label: 'ZIP', value: 'Enabled' },
      { label: 'cURL', value: 'Enabled' },
      { label: 'FileInfo', value: 'Enabled' },
    ],
  },
  {
    title: 'Server Load',
    icon: Gauge,
    items: [
      { label: '1 min load', value: '0.42' },
      { label: '5 min load', value: '0.38' },
      { label: '15 min load', value: '0.35' },
      { label: 'Running processes', value: '234' },
    ],
  },
  {
    title: 'Memory',
    icon: HardDrive,
    items: [
      { label: 'Total RAM', value: '32 GB' },
      { label: 'Used RAM', value: '18.7 GB (58%)' },
      { label: 'Available RAM', value: '13.3 GB' },
      { label: 'Swap Total', value: '4 GB' },
      { label: 'Swap Used', value: '128 MB (3%)' },
    ],
  },
  {
    title: 'Disk',
    icon: Activity,
    items: [
      { label: 'Root (/)', value: '82% used (120 GB / 146 GB)' },
      { label: '/data', value: '65% used (780 GB / 1.2 TB)' },
      { label: '/backup', value: '42% used (420 GB / 1 TB)' },
      { label: '/tmp', value: '12% used (2.4 GB / 20 GB)' },
    ],
  },
  {
    title: 'Environment',
    icon: Globe,
    items: [
      { label: 'Timezone', value: 'UTC' },
      { label: 'Locale', value: 'en_US.UTF-8' },
      { label: 'Memory Limit', value: '256 MB' },
      { label: 'Max Upload Size', value: '64 MB' },
      { label: 'Max Execution Time', value: '300s' },
    ],
  },
];

export default function SystemInfoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">System Information</h1>
        <p className="text-sm text-muted-foreground mt-1">Technical system details for developers</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {infoSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SectionIcon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-right">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
