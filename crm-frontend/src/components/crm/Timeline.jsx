export default function Timeline({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">No timeline activity yet.</p>;
  }
  return (
    <ol className="relative border-l border-[var(--color-border)] ml-2">
      {items.map((item, idx) => (
        <li key={idx} className="mb-6 ml-5 last:mb-0">
          <span
            className="absolute -left-[7px] flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-[var(--color-paper)]"
            style={{ background: item.dotColor || 'var(--color-cobalt)' }}
            aria-hidden="true"
          />
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-[var(--color-ink)]">{item.title}</p>
            <time className="text-xs text-[var(--color-muted)] shrink-0">{item.time}</time>
          </div>
          {item.description && <p className="text-sm text-[var(--color-muted)] mt-0.5">{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}
