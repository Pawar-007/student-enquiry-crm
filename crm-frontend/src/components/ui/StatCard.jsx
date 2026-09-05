import clsx from 'clsx';

export default function StatCard({ label, value, icon: Icon, tone = 'neutral', hint }) {
  const toneClasses = {
    neutral: 'text-[var(--color-ink)] bg-[var(--color-border-soft)]',
    cobalt: 'text-[var(--color-cobalt)] bg-[var(--color-cobalt-soft)]',
    amber: 'text-[var(--color-amber-dark)] bg-[var(--color-amber-soft)]',
    success: 'text-[var(--color-success)] bg-[var(--color-success-soft)]',
    danger: 'text-[var(--color-danger)] bg-[var(--color-danger-soft)]',
  };
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">{label}</p>
        <p className="font-display text-2xl text-[var(--color-ink)] mt-1.5">{value}</p>
        {hint && <p className="text-xs text-[var(--color-muted)] mt-1">{hint}</p>}
      </div>
      {Icon && (
        <div className={clsx('shrink-0 h-9 w-9 rounded-[var(--radius-sm)] flex items-center justify-center', toneClasses[tone])}>
          <Icon size={18} />
        </div>
      )}
    </div>
  );
}
