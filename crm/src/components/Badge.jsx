import clsx from 'clsx'

// Status colors, kept consistent across the whole app.
const STATUS_STYLES = {
  New: 'bg-accent-50 text-accent-600',
  Interested: 'bg-primary-50 text-primary-600',
  'Demo Scheduled': 'bg-cold-bg text-cold',
  'Admission Done': 'bg-primary-500 text-white',
  'Not Interested': 'bg-ink/5 text-ink-faint',
}

const PRIORITY_STYLES = {
  Hot: 'bg-hot-bg text-hot',
  Warm: 'bg-warm-bg text-warm',
  Cold: 'bg-cold-bg text-cold',
}

const FOLLOWUP_STYLES = {
  Scheduled: 'bg-accent-50 text-accent-600',
  Completed: 'bg-primary-50 text-primary-600',
  Missed: 'bg-hot-bg text-hot',
  Cancelled: 'bg-ink/5 text-ink-faint',
}

function Pill({ className, children }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return <Pill className={STATUS_STYLES[status] || 'bg-ink/5 text-ink-soft'}>{status}</Pill>
}

export function PriorityBadge({ priority }) {
  return <Pill className={PRIORITY_STYLES[priority] || 'bg-ink/5 text-ink-soft'}>{priority}</Pill>
}

export function FollowupStatusBadge({ status }) {
  return <Pill className={FOLLOWUP_STYLES[status] || 'bg-ink/5 text-ink-soft'}>{status}</Pill>
}

export default Pill
