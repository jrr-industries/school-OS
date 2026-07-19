'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './empty-state';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  isLoading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  keyExtractor: (item: T) => string | number;
  containerClassName?: string;
  onRowClick?: (item: T) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (direction === 'asc') return <ChevronUp className="size-3.5" />;
  if (direction === 'desc') return <ChevronDown className="size-3.5" />;
  return <ChevronsUpDown className="size-3.5 text-muted-foreground/40" />;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  isLoading = false,
  loadingRows = 5,
  emptyMessage,
  emptyIcon,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  keyExtractor,
  containerClassName,
  onRowClick,
  sortKey: externalSortKey,
  sortDir: externalSortDir,
  onSort: externalOnSort,
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(0);
  const [internalSearch, setInternalSearch] = useState('');
  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<'asc' | 'desc'>('asc');

  const isControlled = searchValue !== undefined;
  const currentSearch = isControlled ? searchValue : internalSearch;
  const currentSortKey = externalSortKey !== undefined ? externalSortKey : internalSortKey;
  const currentSortDir = externalSortDir !== undefined ? externalSortDir : internalSortDir;

  const filteredData = useMemo(() => {
    if (!currentSearch) return data;
    const q = currentSearch.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = (item as Record<string, unknown>)[col.key];
        return val != null && String(val).toLowerCase().includes(q);
      }),
    );
  }, [data, currentSearch, columns]);

  const sortedData = useMemo(() => {
    if (!currentSortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[currentSortKey];
      const bVal = (b as Record<string, unknown>)[currentSortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return currentSortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return currentSortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, currentSortKey, currentSortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(internalPage, totalPages - 1);
  const paginatedData = sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleSearchChange = useCallback(
    (value: string) => {
      setInternalPage(0);
      if (onSearchChange) onSearchChange(value);
      else setInternalSearch(value);
    },
    [onSearchChange],
  );

  const handleSort = useCallback(
    (key: string) => {
      if (externalOnSort) {
        externalOnSort(key);
        return;
      }
      if (internalSortKey === key) {
        setInternalSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setInternalSortKey(key);
        setInternalSortDir('asc');
      }
    },
    [internalSortKey, externalOnSort],
  );

  if (isLoading) {
    return (
      <div className={cn('space-y-4', containerClassName)}>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border/60">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  {columns.map((col) => (
                    <th key={col.key} className={cn('px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground', col.headerClassName)}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: loadingRows }).map((_, i) => (
                  <tr key={i} className="border-b border-border/20">
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-4">
                        <Skeleton className="h-5 w-full max-w-[120px] rounded-md" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className={containerClassName}>
        {onSearchChange !== undefined ? (
          <div className="mb-4">
            <Input
              placeholder={searchPlaceholder}
              value={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-sm"
            />
          </div>
        ) : null}
        <EmptyState
          icon={emptyIcon}
          title={emptyMessage || 'No data found'}
          description="Try adjusting your search or filters."
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', containerClassName)}>
      <div className="flex items-center justify-between gap-4">
        {onSearchChange !== undefined && (
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              placeholder={searchPlaceholder}
              value={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {sortedData.length} result{sortedData.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-background">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                      col.sortable && 'cursor-pointer select-none hover:text-foreground',
                      col.headerClassName,
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <SortIcon
                          direction={currentSortKey === col.key ? currentSortDir : null}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => {
                const key = keyExtractor(item);
                return (
                  <tr
                    key={key}
                    className={cn(
                      'border-b border-border/20 transition-all duration-100 last:border-0',
                      onRowClick && 'cursor-pointer',
                      'hover:bg-background',
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-5 py-4 text-sm',
                          col.hideOnMobile && 'hidden sm:table-cell',
                          col.className,
                        )}
                      >
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInternalPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="h-8 rounded-lg px-3"
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage + 1 === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInternalPage(pageNum - 1)}
                  className="h-8 min-w-8 rounded-lg px-2"
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInternalPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="h-8 rounded-lg px-3"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ActionMenu({ onView, onEdit, onDelete }: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 size-3.5" />
            View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 size-3.5" />
            Edit
          </DropdownMenuItem>
        )}
        {onView && (onEdit || onDelete) && <DropdownMenuSeparator />}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 size-3.5" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
