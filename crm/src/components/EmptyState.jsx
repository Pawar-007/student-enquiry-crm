export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 px-6 text-center">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description && <p className="mt-1 text-sm text-ink-faint max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}
