'use client';

import { ChartContainer } from './chart-container';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { AttendanceTrendData } from '../../types';

const defaultData: AttendanceTrendData[] = [
  { name: 'Mon', present: 450, absent: 30, late: 15, value: 0 },
  { name: 'Tue', present: 460, absent: 25, late: 12, value: 0 },
  { name: 'Wed', present: 440, absent: 35, late: 18, value: 0 },
  { name: 'Thu', present: 470, absent: 20, late: 8, value: 0 },
  { name: 'Fri', present: 455, absent: 28, late: 14, value: 0 },
];

interface AttendanceTrendChartProps {
  data?: AttendanceTrendData[];
  isLoading?: boolean;
  error?: string;
}

export function AttendanceTrendChart({ data, isLoading, error }: AttendanceTrendChartProps) {
  const chartData = data ?? defaultData;

  return (
    <ChartContainer
      title="Attendance Trend"
      description="This week's attendance summary"
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
            <Bar dataKey="present" name="Present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" name="Absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" name="Late" fill="hsl(var(--warning, 38 92% 50%))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
