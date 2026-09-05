import clsx from 'clsx';
import { findEnumMeta } from '../../constants/enums';

const TONE_CLASSES = {
  success: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  danger: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  info: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
  neutral: 'bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]',
};

const TONE_DOT = {
  success: 'bg-[var(--color-success)]',
  danger: 'bg-[var(--color-danger)]',
  warning: 'bg-[var(--color-warning)]',
  info: 'bg-[var(--color-info)]',
  neutral: 'bg-[var(--color-neutral)]',
};

// Renders a status/priority pill from a list of enum meta entries + a raw backend value,
// so status is never communicated by color alone (dot + label text together).
export default function StatusBadge({ list, value, className }) {
  const meta = findEnumMeta(list, value);
  const tone = meta.tone || 'neutral';
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        TONE_CLASSES[tone],
        className
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', TONE_DOT[tone])} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
