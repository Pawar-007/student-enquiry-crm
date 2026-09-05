export default function PageHeader({ title, description, actions, breadcrumb }) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      {breadcrumb && <div className="text-xs text-[var(--color-muted)]">{breadcrumb}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-ink)]">{title}</h1>
          {description && <p className="text-sm text-[var(--color-muted)] mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
