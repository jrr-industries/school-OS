'use client';

import { ChartContainer } from './chart-container';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { StudentGrowthData } from '../../types';

const defaultData: StudentGrowthData[] = [
  { name: 'Apr', students: 1200, value: 1200 },
  { name: 'May', students: 1250, value: 1250 },
  { name: 'Jun', students: 1320, value: 1320 },
  { name: 'Jul', students: 1400, value: 1400 },
  { name: 'Aug', students: 1450, value: 1450 },
  { name: 'Sep', students: 1510, value: 1510 },
  { name: 'Oct', students: 1580, value: 1580 },
  { name: 'Nov', students: 1620, value: 1620 },
  { name: 'Dec', students: 1680, value: 1680 },
  { name: 'Jan', students: 1720, value: 1720 },
  { name: 'Feb', students: 1780, value: 1780 },
  { name: 'Mar', students: 1850, value: 1850 },
];

interface StudentGrowthChartProps {
  data?: StudentGrowthData[];
  isLoading?: boolean;
  error?: string;
}

export function StudentGrowthChart({ data, isLoading, error }: StudentGrowthChartProps) {
  const chartData = data ?? defaultData;

  return (
    <ChartContainer
      title="Student Growth"
      description="Monthly student enrollment trend"
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="students"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
