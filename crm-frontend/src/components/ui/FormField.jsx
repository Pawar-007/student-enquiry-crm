import clsx from 'clsx';

const fieldBase =
  'w-full rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-cobalt)]/30';

function FieldWrapper({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--color-ink)]">
          {label}
          {required && <span className="text-[var(--color-danger)]"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-[var(--color-muted)]">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ label, id, error, hint, required, className, ...props }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={clsx(fieldBase, error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]', className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export function Textarea({ label, id, error, hint, required, className, rows = 4, ...props }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={clsx(fieldBase, 'resize-none', error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]', className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export function Select({ label, id, error, hint, required, options = [], placeholder = 'Select…', className, ...props }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={clsx(fieldBase, 'appearance-none bg-no-repeat', error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]', className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b6a63' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundPosition: 'right 0.75rem center',
          paddingRight: '2.25rem',
        }}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
