export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-4 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="skeleton h-8 w-24 mt-2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3.5 border-b border-[var(--color-border-soft)]">
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="skeleton h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3">
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-7 w-1/3" />
    </div>
  );
}
