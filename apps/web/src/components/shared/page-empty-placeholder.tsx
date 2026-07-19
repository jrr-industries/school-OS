'use client';

import { cn } from '@/lib/utils';
import { ContentContainer } from './content-container';

interface PageEmptyPlaceholderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageEmptyPlaceholder({
  title,
  description,
  className,
}: PageEmptyPlaceholderProps) {
  return (
    <ContentContainer className={cn('', className)}>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {description && (
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </ContentContainer>
  );
}
