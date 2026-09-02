import clsx from 'clsx'

export function Table({ children, className }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-soft bg-surface shadow-card">
      <table className={clsx('w-full text-sm', className)}>{children}</table>
    </div>
  )
}

export function THead({ children }) {
  return (
    <thead>
      <tr className="border-b border-border-soft bg-paper/60">{children}</tr>
    </thead>
  )
}

export function Th({ children, className }) {
  return (
    <th className={clsx('px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint', className)}>
      {children}
    </th>
  )
}

export function Td({ children, className }) {
  return <td className={clsx('px-4 py-3 text-ink', className)}>{children}</td>
}

export function Tr({ children, onClick, className }) {
  return (
    <tr
      onClick={onClick}
      className={clsx(
        'border-b border-border-soft last:border-0',
        onClick && 'cursor-pointer hover:bg-paper/70 transition-colors',
        className
      )}
    >
      {children}
    </tr>
  )
}
