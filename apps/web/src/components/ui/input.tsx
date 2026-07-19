import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full min-w-0 rounded-[12px] border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-sm transition-all duration-100 ease-out file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary/20 selection:text-foreground',
        'focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:ring-offset-0',
        'hover:border-border/80',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
