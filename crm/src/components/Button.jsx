import clsx from 'clsx'

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-surface text-ink border border-border hover:bg-paper',
  accent: 'bg-accent-500 text-white hover:bg-accent-600',
  ghost: 'text-ink-soft hover:bg-paper hover:text-ink',
  danger: 'bg-danger text-white hover:opacity-90',
}
const sizes = {
  sm: 'text-sm px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-3.5 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  as: Comp = 'button',
  loading,
  disabled,
  children,
  ...props
}) {
  return (
    <Comp
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Working…' : children}
    </Comp>
  )
}
