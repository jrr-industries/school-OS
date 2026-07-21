'use client';

import { WidgetCard } from '../shared/widget-card';


interface AttendanceSummaryProps {
  present?: number;
  absent?: number;
  late?: number;
  total?: number;
  rate?: number;
  isLoading?: boolean;
  error?: string;
}

export function AttendanceSummary({
  present = 460,
  absent = 28,
  late = 12,
  total = 500,
  rate = 92,
  isLoading,
  error,
}: AttendanceSummaryProps) {
  return (
    <WidgetCard
      title="Attendance Summary"
      description={`${rate}% average attendance`}
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Today's Attendance</span>
          <span className="text-2xl font-bold">{present}</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(present / total) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-emerald-50 p-2.5 text-center dark:bg-emerald-950/50">
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{present}</p>
            <p className="text-[10px] text-muted-foreground">Present</p>
          </div>
          <div className="rounded-lg bg-red-50 p-2.5 text-center dark:bg-red-950/50">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{absent}</p>
            <p className="text-[10px] text-muted-foreground">Absent</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-2.5 text-center dark:bg-amber-950/50">
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{late}</p>
            <p className="text-[10px] text-muted-foreground">Late</p>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
