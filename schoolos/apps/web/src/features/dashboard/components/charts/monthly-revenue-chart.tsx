'use client';

import { ChartContainer } from './chart-container';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueData } from '../../types';

const defaultData: RevenueData[] = [
  { name: 'Apr', revenue: 850000, value: 0 },
  { name: 'May', revenue: 920000, value: 0 },
  { name: 'Jun', revenue: 780000, value: 0 },
  { name: 'Jul', revenue: 950000, value: 0 },
  { name: 'Aug', revenue: 890000, value: 0 },
  { name: 'Sep', revenue: 910000, value: 0 },
];

interface MonthlyRevenueChartProps {
  data?: RevenueData[];
  isLoading?: boolean;
  error?: string;
}

export function MonthlyRevenueChart({ data, isLoading, error }: MonthlyRevenueChartProps) {
  const chartData = data ?? defaultData;
  const total = chartData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <ChartContainer
      title="Monthly Revenue"
      description={`Total: \u20B9${total.toLocaleString()}`}
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
