'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@schoolos/ui';
import { Users, School, BookOpen, CreditCard } from 'lucide-react';

const stats = [
  {
    title: 'Total Students',
    value: '2,450',
    change: '+12%',
    icon: Users,
  },
  {
    title: 'Total Teachers',
    value: '128',
    change: '+4%',
    icon: School,
  },
  {
    title: 'Active Classes',
    value: '48',
    change: '+2%',
    icon: BookOpen,
  },
  {
    title: 'Revenue',
    value: '$48,250',
    change: '+8%',
    icon: CreditCard,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to SchoolOS
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
