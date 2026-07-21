'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button, Checkbox } from '@schoolos/ui';
import { Column } from './SearchFilter';

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  searchKey?: string;
  onSearch?: (query: string) => void;
  sortable?: boolean;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  rowActions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  emptyAction?: { label: string; onClick: () => void };
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  className?: string;
  rowClassName?: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchKey,
  sortable = true,
  defaultSortKey,
  defaultSortDirection = 'asc',
  onSort,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  rowActions,
  emptyMessage = 'No data available',
  emptyAction,
  loading = false,
  pagination,
  className,
  rowClassName,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const searchQuery = '';

  const handleSort = (key: string) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    onSort?.(key, sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSelectAll = () => {
    const currentPageKeys = new Set(data.map(keyExtractor));
    if (selectedKeys.size === data.length && [...selectedKeys].every((k) => currentPageKeys.has(k))) {
      onSelectionChange?.(new Set());
    } else {
      onSelectionChange?.(new Set([...selectedKeys, ...currentPageKeys]));
    }
  };

  const handleSelectRow = (key: string) => {
    const newSelection = new Set(selectedKeys);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    onSelectionChange?.(newSelection);
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const col = columns.find((c) => c.key === sortKey);
      if (!col) return 0;
      const aVal = col.accessor(a);
      const bVal = col.accessor(b);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [data, sortKey, sortDirection, columns]);

  const filteredData = searchKey
    ? sortedData.filter((row) => {
        const col = columns.find((c) => c.key === searchKey);
        if (!col) return true;
        const value = col.accessor(row);
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    : sortedData;

  const allSelected = filteredData.length > 0 && filteredData.every((row) => selectedKeys.has(keyExtractor(row)));
  const someSelected = filteredData.some((row) => selectedKeys.has(keyExtractor(row)));

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Loading" />
        </div>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-medium">{emptyMessage}</h3>
        {emptyAction && (
          <Button variant="outline" onClick={emptyAction.onClick} className="mt-4 gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {emptyAction.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className || ''}`}>
      <div className="overflow-x-auto">
        <table className="w-full" role="grid">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left" scope="col">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''} ${column.sortable && sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800' : ''} ${column.width || ''}`}
                  scope="col"
                  style={{ width: column.width }}
                  onClick={() => column.sortable && sortable && handleSort(column.key)}
                  aria-sort={sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortable && sortKey === column.key && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredData.map((row) => {
              const rowKey = keyExtractor(row);
              const selected = selectedKeys.has(rowKey);
              return (
                <tr
                  key={rowKey}
                  className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selected ? 'bg-primary/5' : ''} ${rowClassName ? rowClassName(row) : ''}`}
                  onClick={(e) => selectable && e.target instanceof HTMLButtonElement === false && e.target instanceof HTMLInputElement === false && handleSelectRow(rowKey)}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected}
                        onChange={() => handleSelectRow(rowKey)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select row ${rowKey}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={`px-4 py-3 text-sm ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}>
                      {column.render ? column.render(column.accessor(row), row) : column.accessor(row)}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3 text-right">
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pagination.pageSize}
              onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Rows per page"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
}

function ChevronRight({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
}

function FileText({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;
}

function Plus({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>;
}