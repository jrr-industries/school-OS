'use client';

import { Search, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
      <Input
        placeholder="Search anything..."
        className="h-11 w-full rounded-[12px] border-input bg-muted/40 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground/40 shadow-sm focus-visible:bg-background"
      />
      <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/50 lg:flex">
        <Command className="size-3" />
        <span>K</span>
      </div>
    </div>
  );
}
