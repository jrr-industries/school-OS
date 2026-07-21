'use client';

import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@schoolos/ui';

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FilterSectionProps {
  filters: FilterOption[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export function FilterSection({
  filters,
  values,
  onChange,
  onClear,
  hasActiveFilters,
  className,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const visibleFilters = showAdvanced ? filters : filters.slice(0, 4);
  const hasMoreFilters = filters.length > 4;

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </Button>
        )}

        {hasMoreFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-1"
            aria-expanded={showAdvanced}
          >
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
            {showAdvanced ? 'Fewer filters' : 'More filters'}
            {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        )}
      </div>

      {visibleFilters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {visibleFilters.map((filter) => (
            <FilterField
              key={filter.key}
              filter={filter}
              value={values[filter.key]}
              onChange={(val) => onChange(filter.key, val)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterField({ filter, value, onChange }: { filter: FilterOption; value: unknown; onChange: (val: unknown) => void }) {
  switch (filter.type) {
    case 'select':
      return (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={filter.label}
        >
          <option value="">{filter.placeholder || `All ${filter.label}`}</option>
          {filter.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'multiselect':
      return (
        <select
          multiple
          value={(value as string[]) || []}
          onChange={(e) => onChange(Array.from(e.target.selectedOptions, (o) => o.value))}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[90px]"
          aria-label={filter.label}
        >
          {filter.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'date':
      return (
        <input
          type="date"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={filter.label}
        />
      );

    case 'daterange':
      return (
        <div className="flex gap-2">
          <input
            type="date"
            value={(value as { from?: string; to?: string })?.from || ''}
            onChange={(e) => onChange({ ...(value as object), from: e.target.value })}
            className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="From"
            aria-label={`${filter.label} from`}
          />
          <input
            type="date"
            value={(value as { from?: string; to?: string })?.to || ''}
            onChange={(e) => onChange({ ...(value as object), to: e.target.value })}
            className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="To"
            aria-label={`${filter.label} to`}
          />
        </div>
      );

    case 'number':
      return (
        <input
          type="number"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={filter.placeholder}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={filter.label}
        />
      );

    default:
      return (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={filter.placeholder || `Filter by ${filter.label}`}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={filter.label}
        />
      );
  }
}

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}