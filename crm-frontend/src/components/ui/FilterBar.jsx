import { Search, X } from 'lucide-react';
import { Select } from './FormField';
import Button from './Button';

// filters: [{ key, label, options }]
// values: { [key]: value }, search: string
export default function FilterBar({ search, onSearchChange, searchPlaceholder = 'Search…', filters = [], values = {}, onChange, onClear }) {
  const hasActiveFilters = Object.values(values).some(Boolean) || Boolean(search);

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {onSearchChange && (
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search"
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cobalt)]/30"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {filters.map((f) => (
            <div key={f.key} className="w-40">
              <Select
                aria-label={f.label}
                placeholder={f.label}
                value={values[f.key] || ''}
                onChange={(e) => onChange(f.key, e.target.value)}
                options={f.options}
              />
            </div>
          ))}
          {hasActiveFilters && onClear && (
            <Button variant="ghost" size="md" icon={X} onClick={onClear}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
