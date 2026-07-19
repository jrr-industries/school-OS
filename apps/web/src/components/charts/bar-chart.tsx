'use client';

import type { ReactNode } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  month: string;
  value: number;
}

interface BarChartComponentProps {
  data: DataPoint[];
  dataKey?: string;
  xKey?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  formatValue?: (value: number) => string;
  radius?: [number, number, number, number];
}

export function BarChartComponent({
  data,
  dataKey = 'value',
  xKey = 'month',
  color = '#2563EB',
  height = 300,
  showGrid = true,
  formatValue,
  radius = [4, 4, 0, 0],
}: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />
        )}
        <XAxis
          dataKey={xKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
          dx={-4}
          tickFormatter={formatValue}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            color: '#fff',
            fontSize: '13px',
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}
          formatter={(value) => [formatValue ? formatValue(value as number) : value] as ReactNode}
        />
        <Bar
          dataKey={dataKey}
          fill={color}
          radius={radius}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
