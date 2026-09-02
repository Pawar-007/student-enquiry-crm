import clsx from 'clsx'
import { forwardRef } from 'react';

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-ink-soft">
      {children}
    </label>
  )
}

// export function Input({ error, className, ...props }) {
//   return (
//     <input
//       className={clsx(
//         'w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors',
//         error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary-500',
//         className
//       )}
//       {...props}
//     />
//   )
// }

export const Input = forwardRef(function Input(
  { error, className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors',
        error
          ? 'border-danger focus:border-danger'
          : 'border-border focus:border-primary-500',
        className
      )}
      {...props}
    />
  )
})


export function Select({ error, className, children, ...props }) {
  return (
    <select
      className={clsx(
        'w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors',
        error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary-500',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ error, className, ...props }) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors',
        error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary-500',
        className
      )}
      {...props}
    />
  )
}

export function FieldError({ children }) {
  if (!children) return null
  return <p className="mt-1 text-xs font-medium text-danger">{children}</p>
}
