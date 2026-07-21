'use client';

import { ChartContainer } from './chart-container';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import type { ExamPerformanceData } from '../../types';

const defaultData: ExamPerformanceData[] = [
  { name: 'Mathematics', average: 78, passRate: 85, value: 0 },
  { name: 'Science', average: 82, passRate: 90, value: 0 },
  { name: 'English', average: 75, passRate: 80, value: 0 },
  { name: 'History', average: 80, passRate: 88, value: 0 },
  { name: 'Geography', average: 72, passRate: 78, value: 0 },
  { name: 'Computer', average: 88, passRate: 95, value: 0 },
];

interface ExamPerformanceChartProps {
  data?: ExamPerformanceData[];
  isLoading?: boolean;
  error?: string;
}

export function ExamPerformanceChart({ data, isLoading, error }: ExamPerformanceChartProps) {
  const chartData = data ?? defaultData;

  return (
    <ChartContainer
      title="Exam Performance"
      description="Subject-wise average scores and pass rates"
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <PolarGrid className="stroke-muted" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} className="text-muted-foreground" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Radar name="Average Score" dataKey="average" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
            <Radar name="Pass Rate" dataKey="passRate" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
