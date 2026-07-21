'use client';

import { ChartContainer } from './chart-container';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { GenderDistributionData } from '../../types';

const defaultData: GenderDistributionData[] = [
  { name: 'Boys', value: 1020, color: '#3b82f6' },
  { name: 'Girls', value: 830, color: '#ec4899' },
  { name: 'Other', value: 50, color: '#8b5cf6' },
];

interface GenderDistributionChartProps {
  data?: GenderDistributionData[];
  isLoading?: boolean;
  error?: string;
}

export function GenderDistributionChart({ data, isLoading, error }: GenderDistributionChartProps) {
  const chartData = data ?? defaultData;
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartContainer
      title="Gender Distribution"
      description={`${total.toLocaleString()} total students`}
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [`${Number(value)} (${((Number(value) / total) * 100).toFixed(1)}%)`, 'Students']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
