'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Monitor, Users, XCircle, Smartphone, Laptop, Globe } from 'lucide-react';

interface Session {
  id: string;
  user: string;
  email: string;
  device: string;
  ip: string;
  lastActive: string;
  loginTime: string;
}

const sessions: Session[] = [
  { id: '1', user: 'John Smith', email: 'john.smith@schoolos.dev', device: 'Chrome / Windows', ip: '192.168.1.100', lastActive: '2 min ago', loginTime: '2026-07-18 08:30' },
  { id: '2', user: 'Sarah Johnson', email: 'sarah.j@schoolos.dev', device: 'Safari / macOS', ip: '10.0.0.45', lastActive: '15 min ago', loginTime: '2026-07-18 07:45' },
  { id: '3', user: 'Michael Chen', email: 'm.chen@schoolos.dev', device: 'Firefox / Linux', ip: '172.16.0.88', lastActive: '1 hour ago', loginTime: '2026-07-18 06:20' },
  { id: '4', user: 'Emily Davis', email: 'emily.d@schoolos.dev', device: 'Mobile App / iOS', ip: '203.0.113.50', lastActive: '5 min ago', loginTime: '2026-07-18 09:00' },
  { id: '5', user: 'Robert Wilson', email: 'r.wilson@schoolos.dev', device: 'Chrome / Android', ip: '198.51.100.25', lastActive: '30 min ago', loginTime: '2026-07-18 05:15' },
  { id: '6', user: 'Lisa Thompson', email: 'lisa.t@schoolos.dev', device: 'Edge / Windows', ip: '192.168.2.200', lastActive: '3 hours ago', loginTime: '2026-07-17 22:00' },
  { id: '7', user: 'David Martinez', email: 'd.martinez@schoolos.dev', device: 'Mobile App / Android', ip: '100.64.0.1', lastActive: '45 min ago', loginTime: '2026-07-18 08:00' },
];

const deviceIcon = (device: string) => {
  if (device.includes('Mobile')) return <Smartphone className="h-4 w-4" />;
  if (device.includes('macOS') || device.includes('Linux')) return <Monitor className="h-4 w-4" />;
  return <Laptop className="h-4 w-4" />;
};

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Active Sessions</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage all active user sessions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <Monitor className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">1,847</p>
            <p className="text-sm text-muted-foreground">Total Active Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">892</p>
            <p className="text-sm text-muted-foreground">Unique Users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Active User Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">User</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Email</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Device</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">IP Address</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Last Active</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Login Time</th>
                  <th className="text-right font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4 font-medium">{s.user}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{s.email}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        {deviceIcon(s.device)}
                        {s.device}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground font-mono">{s.ip}</td>
                    <td className="py-3 pr-4 text-xs">{s.lastActive}</td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground">{s.loginTime}</td>
                    <td className="py-3 text-right">
                      <button className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                        <XCircle className="h-3 w-3" />
                        Revoke
                      </button>
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
