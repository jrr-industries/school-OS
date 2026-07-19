'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AppBreadcrumb } from './app-breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="hidden sm:block">
        <AppBreadcrumb pathname={pathname} />
      </div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-[32px] font-bold tracking-tight text-foreground lg:text-[36px]">
            {title}
          </h1>
          {description && (
            <p className="text-[15px] text-muted-foreground">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
