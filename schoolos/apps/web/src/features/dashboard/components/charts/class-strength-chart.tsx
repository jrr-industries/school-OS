'use client';

import { ChartContainer } from './chart-container';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ClassStrengthData } from '../../types';

const defaultData: ClassStrengthData[] = [
  { name: 'Class 6', strength: 120, capacity: 150, value: 0 },
  { name: 'Class 7', strength: 135, capacity: 150, value: 0 },
  { name: 'Class 8', strength: 110, capacity: 150, value: 0 },
  { name: 'Class 9', strength: 145, capacity: 150, value: 0 },
  { name: 'Class 10', strength: 140, capacity: 150, value: 0 },
  { name: 'Class 11', strength: 95, capacity: 120, value: 0 },
  { name: 'Class 12', strength: 85, capacity: 120, value: 0 },
];

interface ClassStrengthChartProps {
  data?: ClassStrengthData[];
  isLoading?: boolean;
  error?: string;
}

export function ClassStrengthChart({ data, isLoading, error }: ClassStrengthChartProps) {
  const chartData = data ?? defaultData;

  return (
    <ChartContainer
      title="Class Strength"
      description="Current enrollment vs capacity"
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={0} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Bar dataKey="strength" name="Current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="capacity" name="Capacity" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.3} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
