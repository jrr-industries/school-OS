'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@schoolos/ui';
import { cn } from '@schoolos/ui';
import { Skeleton } from '@schoolos/ui';
import { Maximize2, RefreshCw, Download } from 'lucide-react';
import { useState } from 'react';

interface WidgetCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  onFullScreen?: () => void;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

export function WidgetCard({
  title,
  description,
  children,
  className,
  isLoading,
  error,
  onRefresh,
  onExport,
  onFullScreen,
  headerAction,
  noPadding,
}: WidgetCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
        </div>
        <div className="flex items-center gap-1">
          {headerAction}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Export"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
          {onFullScreen && (
            <button
              onClick={onFullScreen}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label="Full screen"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn(noPadding && 'p-0 pt-0')}>
        {isLoading ? (
          <div className="space-y-3 p-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-destructive">{error}</p>
            {onRefresh && (
              <button
                onClick={handleRefresh}
                className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
              >
                Try again
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
