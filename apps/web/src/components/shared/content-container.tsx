import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: boolean;
}

export function ContentContainer({
  children,
  className,
  maxWidth = true,
}: ContentContainerProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card p-6 shadow-card lg:p-8',
        maxWidth && 'mx-auto w-full',
        className,
      )}
    >
      {children}
    </div>
  );
}
