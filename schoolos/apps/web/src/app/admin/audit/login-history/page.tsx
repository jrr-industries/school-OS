'use client';

import { KeyRound, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';

interface LoginRecord {
  id: string;
  user: string;
  email: string;
  timestamp: string;
  ip: string;
  device: string;
  location: string;
  status: 'success' | 'failure';
}

const loginHistory: LoginRecord[] = [
  { id: '1', user: 'John Smith', email: 'j.smith@lincoln.edu', timestamp: '2024-07-21 09:15:23', ip: '192.168.1.100', device: 'Chrome / Windows 11', location: 'New York, USA', status: 'success' },
  { id: '2', user: 'Sarah Johnson', email: 's.johnson@springfield.edu', timestamp: '2024-07-21 09:12:45', ip: '10.0.0.52', device: 'Safari / macOS', location: 'Los Angeles, USA', status: 'success' },
  { id: '3', user: 'Michael Davis', email: 'm.davis@riverside.org', timestamp: '2024-07-21 08:55:34', ip: '172.16.0.25', device: 'Firefox / Ubuntu', location: 'Chicago, USA', status: 'failure' },
  { id: '4', user: 'Emily Wilson', email: 'e.wilson@oakwood.edu', timestamp: '2024-07-21 08:42:18', ip: '203.0.113.45', device: 'Chrome / Android 14', location: 'London, UK', status: 'success' },
  { id: '5', user: 'Robert Brown', email: 'r.brown@mountainview.org', timestamp: '2024-07-21 08:30:00', ip: '192.168.2.88', device: 'Edge / Windows 11', location: 'Toronto, Canada', status: 'success' },
  { id: '6', user: 'Jennifer Lee', email: 'j.lee@lincoln.edu', timestamp: '2024-07-21 08:15:47', ip: '10.10.0.18', device: 'Chrome / iOS 17', location: 'San Francisco, USA', status: 'failure' },
  { id: '7', user: 'David Garcia', email: 'd.garcia@springfield.edu', timestamp: '2024-07-21 07:58:22', ip: '198.51.100.32', device: 'Safari / macOS', location: 'Miami, USA', status: 'success' },
  { id: '8', user: 'Lisa Anderson', email: 'l.anderson@riverside.org', timestamp: '2024-07-21 07:45:11', ip: '192.0.2.67', device: 'Chrome / Windows 10', location: 'Berlin, Germany', status: 'success' },
  { id: '9', user: 'James Taylor', email: 'j.taylor@oakwood.edu', timestamp: '2024-07-21 07:30:05', ip: '203.0.113.89', device: 'Firefox / Linux', location: 'Sydney, Australia', status: 'failure' },
  { id: '10', user: 'Maria Martinez', email: 'm.martinez@mountainview.org', timestamp: '2024-07-21 07:15:33', ip: '10.20.0.14', device: 'Chrome / Android 13', location: 'Mexico City, Mexico', status: 'success' },
];

export default function LoginHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Login History</h1>
        <p className="text-sm text-muted-foreground mt-1">User login activity across the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Login Attempts
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">User</th>
                  <th className="pb-3 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 font-medium text-muted-foreground">Timestamp</th>
                  <th className="pb-3 font-medium text-muted-foreground">IP Address</th>
                  <th className="pb-3 font-medium text-muted-foreground">Device</th>
                  <th className="pb-3 font-medium text-muted-foreground">Location</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((record) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 font-medium">{record.user}</td>
                    <td className="py-3 text-muted-foreground">{record.email}</td>
                    <td className="py-3 text-muted-foreground whitespace-nowrap">{record.timestamp}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{record.ip}</td>
                    <td className="py-3 text-muted-foreground text-xs">{record.device}</td>
                    <td className="py-3 text-muted-foreground">{record.location}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${record.status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {record.status === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
            <span>Showing {loginHistory.length} entries</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> {loginHistory.filter(r => r.status === 'success').length} successful
              </span>
              <span className="inline-flex items-center gap-1 text-red-600">
                <XCircle className="h-3 w-3" /> {loginHistory.filter(r => r.status === 'failure').length} failed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
