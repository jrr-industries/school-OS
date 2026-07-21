'use client';

import { useState } from 'react';
import { cn } from '@schoolos/ui';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, Download, Eye, EyeOff } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No data found',
  onRowClick,
  pageSize = 10,
  searchable = false,
  exportable = false,
  selectable = false,
  onSelectionChange,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter((c) => !c.hidden).map((c) => c.key)),
  );
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const filteredData = searchQuery
    ? data.filter((item) =>
        columns.some((col) => {
          const value = item[col.key];
          return value && String(value).toLowerCase().includes(searchQuery.toLowerCase());
        }),
      )
    : data;

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
        return sortAsc ? cmp : -cmp;
      })
    : filteredData;

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const pageData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const toggleRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelected).map((i) => pageData[i]));
    }
  };

  const toggleAll = () => {
    if (selectedRows.size === pageData.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const all = new Set(pageData.map((_, i) => i));
      setSelectedRows(all);
      if (onSelectionChange) onSelectionChange([...pageData]);
    }
  };

  const exportData = () => {
    const visibleCols = columns.filter((c) => visibleColumns.has(c.key));
    const headers = visibleCols.map((c) => c.header).join(',');
    const rows = filteredData.map((item) =>
      visibleCols.map((c) => {
        const val = item[c.key];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val ?? '');
      }).join(','),
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleCols = columns.filter((c) => visibleColumns.has(c.key));

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex gap-4 border-b pb-3">
          {visibleCols.map((col) => (
            <div key={col.key} className="h-4 flex-1 animate-pulse rounded bg-muted" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2">
            {visibleCols.map((col) => (
              <div key={col.key} className="h-4 flex-1 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {(searchable || exportable) && (
        <div className="flex items-center justify-between gap-2">
          {searchable && (
            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
                aria-label="Toggle columns"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              {showColumnMenu && (
                <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border bg-popover p-1 shadow-md">
                  {columns.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => {
                        const newVisible = new Set(visibleColumns);
                        if (newVisible.has(col.key)) {
                          newVisible.delete(col.key);
                        } else {
                          newVisible.add(col.key);
                        }
                        setVisibleColumns(newVisible);
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-accent"
                    >
                      {visibleColumns.has(col.key) ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                      )}
                      {col.header}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {exportable && (
              <button
                onClick={exportData}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
                aria-label="Export to CSV"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {pageData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {selectable && (
                    <th className="w-10 px-2 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === pageData.length && pageData.length > 0}
                        onChange={toggleAll}
                        className="rounded border-gray-300"
                        aria-label="Select all rows"
                      />
                    </th>
                  )}
                  {visibleCols.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'px-3 py-3 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider',
                        col.sortable && 'cursor-pointer select-none hover:text-foreground',
                        col.className,
                      )}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.header}
                        {col.sortable && sortKey === col.key && (
                          sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      'border-b transition-colors hover:bg-muted/50',
                      onRowClick && 'cursor-pointer',
                      selectedRows.has(rowIndex) && 'bg-primary/5',
                    )}
                    onClick={() => {
                      onRowClick?.(item);
                    }}
                  >
                    {selectable && (
                      <td className="w-10 px-2 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex)}
                          onChange={() => toggleRow(rowIndex)}
                          className="rounded border-gray-300"
                          aria-label={`Select row ${rowIndex + 1}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    {visibleCols.map((col) => (
                      <td key={col.key} className={cn('px-3 py-2.5 align-middle', col.className)}>
                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => (
                    <>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span key={`ellipsis-${p}`} className="px-1 text-xs text-muted-foreground">...</span>
                      )}
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors',
                          p === currentPage
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent',
                        )}
                      >
                        {p}
                      </button>
                    </>
                  ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
