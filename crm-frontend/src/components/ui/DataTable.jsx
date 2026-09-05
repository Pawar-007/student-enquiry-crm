import { SkeletonTable } from './Skeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { Inbox } from 'lucide-react';

// Generic table: desktop shows a real <table>, mobile collapses each row into
// a stacked card so nothing overflows the viewport horizontally.
export default function DataTable({ columns, rows, keyField = 'id', loading, error, onRetry, emptyTitle = 'No records found', emptyDescription, rowActions }) {
  if (loading) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <SkeletonTable cols={columns.length} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <ErrorState message={error.message} onRetry={onRetry} />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Desktop / tablet table */}
      <div className="table-scroll hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-paper)]">
              {columns.map((col) => (
                <th key={col.key} className="text-left font-medium text-[var(--color-muted)] px-4 py-3 whitespace-nowrap text-xs uppercase tracking-wide">
                  {col.header}
                </th>
              ))}
              {rowActions && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[keyField]} className="border-b border-[var(--color-border-soft)] last:border-0 hover:bg-[var(--color-paper)] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 align-middle text-[var(--color-ink)] whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {rowActions && <td className="px-4 py-3.5 text-right whitespace-nowrap">{rowActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden divide-y divide-[var(--color-border-soft)]">
        {rows.map((row) => (
          <div key={row[keyField]} className="p-4 flex flex-col gap-2">
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--color-muted)] text-xs uppercase tracking-wide">{col.header}</span>
                <span className="text-[var(--color-ink)] text-right">{col.render ? col.render(row) : row[col.key]}</span>
              </div>
            ))}
            {rowActions && <div className="pt-2 flex justify-end gap-2">{rowActions(row)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
