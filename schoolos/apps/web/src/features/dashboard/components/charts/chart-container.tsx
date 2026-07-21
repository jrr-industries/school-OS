'use client';

import { useState, useCallback, useRef } from 'react';
import { WidgetCard } from '../shared/widget-card';
import { cn } from '@schoolos/ui';
import { Minimize2 } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  filters?: React.ReactNode;
}

const timeRanges = ['7D', '30D', '90D', '1Y', 'All'];

export function ChartContainer({
  title,
  description,
  children,
  className,
  isLoading,
  error,
  onRefresh,
  onExport,
  timeRange: externalTimeRange,
  onTimeRangeChange,
  filters,
}: ChartContainerProps) {
  const [internalTimeRange, setInternalTimeRange] = useState('30D');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const timeRange = externalTimeRange ?? internalTimeRange;
  const handleTimeRangeChange = onTimeRangeChange ?? setInternalTimeRange;

  const handleExport = useCallback(() => {
    if (onExport) {
      onExport();
      return;
    }
    if (chartRef.current) {
      const canvas = chartRef.current.querySelector('svg');
      if (canvas) {
        const svgData = new XMLSerializer().serializeToString(canvas);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }, [onExport, title]);

  const content = (
    <div ref={chartRef}>
      {children}
    </div>
  );

  const headerAction = (
    <div className="flex items-center gap-1">
      {filters}
      {timeRanges.map((range) => (
        <button
          key={range}
          onClick={() => handleTimeRangeChange(range)}
          className={cn(
            'rounded-md px-2 py-1 text-[10px] font-medium transition-colors',
            timeRange === range
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {range}
        </button>
      ))}
    </div>
  );

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <button
            onClick={() => setIsFullScreen(false)}
            className="rounded-md p-2 hover:bg-accent"
            aria-label="Exit full screen"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {content}
        </div>
      </div>
    );
  }

  return (
    <WidgetCard
      title={title}
      description={description}
      isLoading={isLoading}
      error={error}
      onRefresh={onRefresh}
      onExport={handleExport}
      onFullScreen={() => setIsFullScreen(true)}
      headerAction={headerAction}
      className={className}
    >
      {content}
    </WidgetCard>
  );
}
