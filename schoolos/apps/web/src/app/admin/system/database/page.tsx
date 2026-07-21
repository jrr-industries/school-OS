'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@schoolos/ui';
import { Activity, Timer, AlertTriangle, HardDrive, Table2 } from 'lucide-react';

const stats = [
  { label: 'Total Size', value: '156.4 GB', icon: HardDrive, color: 'text-blue-600' },
  { label: 'Active Connections', value: '47', icon: Activity, color: 'text-emerald-600' },
  { label: 'Query Performance', value: '2.3ms avg', icon: Timer, color: 'text-violet-600' },
  { label: 'Slow Queries', value: '3', icon: AlertTriangle, color: 'text-amber-600' },
];

const tables = [
  { name: 'users', rows: '52,847', size: '12.3 GB', lastVacuum: '2024-12-15 03:00' },
  { name: 'schools', rows: '1,243', size: '8.7 GB', lastVacuum: '2024-12-15 02:00' },
  { name: 'students', rows: '48,230', size: '24.1 GB', lastVacuum: '2024-12-14 04:00' },
  { name: 'teachers', rows: '3,840', size: '6.2 GB', lastVacuum: '2024-12-15 01:00' },
  { name: 'attendance', rows: '1,234,567', size: '45.8 GB', lastVacuum: '2024-12-13 05:00' },
  { name: 'grades', rows: '892,340', size: '18.6 GB', lastVacuum: '2024-12-14 03:30' },
  { name: 'payments', rows: '156,789', size: '9.4 GB', lastVacuum: '2024-12-15 02:30' },
  { name: 'sessions', rows: '67,890', size: '4.2 GB', lastVacuum: '2024-12-15 03:15' },
  { name: 'logs', rows: '5,678,901', size: '27.1 GB', lastVacuum: '2024-12-12 06:00' },
];

export default function DatabasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Database</h1>
        <p className="text-sm text-muted-foreground mt-1">Database management and monitoring</p>
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
            <Table2 className="h-5 w-5 text-primary" />
            Database Tables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Table Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Row Count</th>
                  <th className="pb-3 font-medium text-muted-foreground">Size</th>
                  <th className="pb-3 font-medium text-muted-foreground">Last Vacuum</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.name} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{table.name}</td>
                    <td className="py-3 text-muted-foreground">{table.rows}</td>
                    <td className="py-3">{table.size}</td>
                    <td className="py-3 text-muted-foreground">{table.lastVacuum}</td>
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
