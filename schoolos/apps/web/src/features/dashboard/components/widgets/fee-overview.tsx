'use client';

import { WidgetCard } from '../shared/widget-card';


interface FeeOverviewProps {
  collected?: number;
  pending?: number;
  total?: number;
  isLoading?: boolean;
  error?: string;
}

export function FeeOverview({
  collected = 5300000,
  pending = 820000,
  total = 6120000,
  isLoading,
  error,
}: FeeOverviewProps) {
  const collectionRate = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <WidgetCard
      title="Fee Collection"
      description={`${collectionRate}% collected this year`}
      isLoading={isLoading}
      error={error}
      onRefresh={() => {}}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">₹{(collected / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground">of ₹{(total / 100000).toFixed(1)}L total</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Collected</p>
            <p className="text-xs text-muted-foreground">₹{(pending / 100000).toFixed(1)}L pending</p>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${collectionRate}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Collected</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ₹{(collected / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
              ₹{(pending / 100000).toFixed(1)}L
            </p>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
