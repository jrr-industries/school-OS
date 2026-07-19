'use client';

import type { ReactNode } from 'react';
import {
  AreaChart,
  Area,
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

interface AreaChartComponentProps {
  data: DataPoint[];
  dataKey?: string;
  xKey?: string;
  color?: string;
  gradientId?: string;
  height?: number;
  showGrid?: boolean;
  formatValue?: (value: number) => string;
}

export function AreaChartComponent({
  data,
  dataKey = 'value',
  xKey = 'month',
  color = '#2563EB',
  gradientId = 'colorPrimary',
  height = 300,
  showGrid = true,
  formatValue,
}: AreaChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: 'rgba(15,23,42,0.95)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
