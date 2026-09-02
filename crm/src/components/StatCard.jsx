import clsx from 'clsx'

export default function StatCard({ label, value, sub, tone = 'default' }) {
  const toneStyles = {
    default: 'text-ink',
    primary: 'text-primary-600',
    accent: 'text-accent-600',
  }
  return (
    <div className="rounded-lg border border-border-soft bg-surface p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      <p className={clsx('num mt-2 text-2xl font-semibold', toneStyles[tone])}>{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-faint">{sub}</p>}
    </div>
  )
}
