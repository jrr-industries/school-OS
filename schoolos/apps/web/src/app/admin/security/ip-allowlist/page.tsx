'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Shield, Plus, Trash2 } from 'lucide-react';

interface IpEntry {
  id: string;
  ip: string;
  description: string;
  addedBy: string;
  addedDate: string;
}

const ipEntries: IpEntry[] = [
  { id: '1', ip: '192.168.1.0/24', description: 'Main Office Network', addedBy: 'Super Admin', addedDate: '2026-01-01' },
  { id: '2', ip: '10.0.0.0/8', description: 'Corporate VPN', addedBy: 'John Smith', addedDate: '2026-02-15' },
  { id: '3', ip: '203.0.113.45', description: 'Primary Admin Workstation', addedBy: 'Super Admin', addedDate: '2026-03-10' },
  { id: '4', ip: '198.51.100.0/24', description: 'Cloud Infrastructure', addedBy: 'Sarah Johnson', addedDate: '2026-04-20' },
  { id: '5', ip: '172.16.0.50', description: 'Backup Admin Access', addedBy: 'Michael Chen', addedDate: '2026-05-05' },
  { id: '6', ip: '192.168.2.100', description: 'Remote Office - Chicago', addedBy: 'Emily Davis', addedDate: '2026-06-12' },
];

export default function IpAllowlistPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">IP Allowlist</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage IP addresses allowed to access the admin panel</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
          <Plus className="h-4 w-4" />
          Add IP Address
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">6</p>
            <p className="text-sm text-muted-foreground">Allowed IPs / CIDRs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">4</p>
            <p className="text-sm text-muted-foreground">Active Ranges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Single Addresses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Allowed IP Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">IP Address / CIDR</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Description</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Added By</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pr-4">Added Date</th>
                  <th className="text-right font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ipEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs font-medium">{entry.ip}</span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{entry.description}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{entry.addedBy}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{entry.addedDate}</td>
                    <td className="py-3 text-right">
                      <button className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors" aria-label="Remove IP">
                        <Trash2 className="h-3.5 w-3.5" />
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
