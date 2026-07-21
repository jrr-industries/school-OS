'use client';

import { ChartContainer } from './chart-container';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { FeeCollectionData } from '../../types';

const defaultData: FeeCollectionData[] = [
  { name: 'Apr', collected: 850000, pending: 150000, value: 0 },
  { name: 'May', collected: 920000, pending: 120000, value: 0 },
  { name: 'Jun', collected: 780000, pending: 200000, value: 0 },
  { name: 'Jul', collected: 950000, pending: 100000, value: 0 },
  { name: 'Aug', collected: 890000, pending: 140000, value: 0 },
  { name: 'Sep', collected: 910000, pending: 110000, value: 0 },
];

const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

interface FeeCollectionChartProps {
  data?: FeeCollectionData[];
  isLoading?: boolean;
  error?: string;
}

export function FeeCollectionChart({ data, isLoading, error }: FeeCollectionChartProps) {
  const chartData = data ?? defaultData;

  return (
    <ChartContainer
      title="Fee Collection"
      description="Monthly fee collection vs pending"
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={0} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Bar dataKey="collected" name="Collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
