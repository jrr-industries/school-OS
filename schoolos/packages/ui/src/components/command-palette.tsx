'use client';

import { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function CommandPalette({
  items,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  placeholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    },
    [open, onOpenChange],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <button
        onClick={() => onOpenChange(true)}
        className="inline-flex h-9 w-full max-w-sm items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm hover:bg-accent"
      >
        <Search className="h-4 w-4" />
        <span>{placeholder}</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => onOpenChange(false)}
        >
          <div
            className={cn(
              'fixed left-1/2 top-[15%] z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border bg-popover text-popover-foreground shadow-lg',
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="rounded-lg">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder={placeholder}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto p-1">
                <Command.Empty className="py-6 text-center text-sm">
                  {emptyMessage}
                </Command.Empty>
                <Command.Group>
                  {items.map((item) => (
                    <Command.Item
                      key={item.id}
                      onSelect={() => {
                        item.onSelect();
                        onOpenChange(false);
                      }}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                    >
                      {item.icon && (
                        <span className="mr-2">{item.icon}</span>
                      )}
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="ml-auto rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                          {item.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
