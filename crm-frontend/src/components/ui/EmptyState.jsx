import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-[var(--color-border-soft)] flex items-center justify-center mb-4 text-[var(--color-muted)]">
          <Icon size={22} />
        </div>
      )}
      <h3 className="font-display text-lg text-[var(--color-ink)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--color-muted)] max-w-sm mb-5">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
