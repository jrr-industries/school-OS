'use client';

import { useState, ReactNode } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Popover, PopoverContent, PopoverTrigger, Checkbox } from '@schoolos/ui';

export interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  filters?: FilterConfig[];
  filterValues?: Record<string, unknown>;
  onFilterChange?: (key: string, value: unknown) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  onSearch,
  placeholder = 'Search...',
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  hasActiveFilters = false,
  className,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className || ''}`}>
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search"
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        {filters.length > 0 && (
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant={hasActiveFilters ? 'secondary' : 'outline'}
                className="gap-2"
                aria-label="Filters"
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="Active filters" />
                )}
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" side="bottom" align="end">
              <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
                {filters.map((filter) => (
                  <FilterField
                    key={filter.key}
                    filter={filter}
                    value={filterValues[filter.key]}
                    onChange={(value) => onFilterChange?.(filter.key, value)}
                  />
                ))}
                {hasActiveFilters && onClearFilters && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 dark:text-red-400"
                    onClick={() => {
                      onClearFilters();
                      setShowFilters(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" aria-hidden="true" />
                    Clear all filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}

function FilterField({ filter, value, onChange }: { filter: FilterConfig; value: unknown; onChange: (value: unknown) => void }) {
  switch (filter.type) {
    case 'select':
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{filter.label}</label>
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'multiselect':
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{filter.label}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-auto py-2">
                <span className="text-sm">
                  {Array.isArray(value) && value.length > 0
                    ? `${value.length} selected`
                    : filter.placeholder || `Select ${filter.label}`}
                </span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" side="bottom" align="start">
              <div className="p-2 max-h-60 overflow-y-auto">
                {filter.options?.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded cursor-pointer">
                    <Checkbox
                      checked={Array.isArray(value) && value.includes(opt.value)}
                      onCheckedChange={(checked) => {
                        const current = (Array.isArray(value) ? value : []) as string[];
                        onChange(checked ? [...current, opt.value] : current.filter((v) => v !== opt.value));
                      }}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );

    case 'date':
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{filter.label}</label>
          <Input
            type="date"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={filter.placeholder}
            className="w-full"
          />
        </div>
      );

    case 'daterange':
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{filter.label}</label>
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="From"
              value={(value as { from?: string; to?: string })?.from || ''}
              onChange={(e) => onChange({ ...(value as object), from: e.target.value })}
              className="flex-1"
            />
            <Input
              type="date"
              placeholder="To"
              value={(value as { from?: string; to?: string })?.to || ''}
              onChange={(e) => onChange({ ...(value as object), to: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      );

    case 'text':
    case 'number':
    default:
      return (
        <div className="space-y-1">
          <label className="text-sm font-medium">{filter.label}</label>
          <Input
            type={filter.type}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={filter.placeholder}
            className="w-full"
          />
        </div>
      );
  }
}