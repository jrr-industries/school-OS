'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContentContainer } from './content-container';

interface EmptyPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyPage({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyPageProps) {
  return (
    <ContentContainer className={cn('', className)}>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/5 ring-1 ring-primary/10">
          <Icon className="size-10 text-primary/50" />
        </div>
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} size="lg">
            {action.icon && <action.icon className="size-4" />}
            {action.label}
          </Button>
        )}
      </div>
    </ContentContainer>
  );
}
