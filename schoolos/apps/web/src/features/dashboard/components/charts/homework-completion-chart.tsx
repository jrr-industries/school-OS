'use client';

import { ChartContainer } from './chart-container';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { HomeworkCompletionData } from '../../types';

const defaultData: HomeworkCompletionData[] = [
  { name: 'Class 6', completed: 85, pending: 15, value: 0 },
  { name: 'Class 7', completed: 78, pending: 22, value: 0 },
  { name: 'Class 8', completed: 82, pending: 18, value: 0 },
  { name: 'Class 9', completed: 72, pending: 28, value: 0 },
  { name: 'Class 10', completed: 90, pending: 10, value: 0 },
];

interface HomeworkCompletionChartProps {
  data?: HomeworkCompletionData[];
  isLoading?: boolean;
  error?: string;
}

export function HomeworkCompletionChart({ data, isLoading, error }: HomeworkCompletionChartProps) {
  const chartData = data ?? defaultData;

  return (
    <ChartContainer
      title="Homework Completion"
      description="Completion rate by class"
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={0} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
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
            <Bar dataKey="completed" name="Completed" stackId="a" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
