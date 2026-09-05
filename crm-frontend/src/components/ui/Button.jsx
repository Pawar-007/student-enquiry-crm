import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const VARIANTS = {
  primary: 'bg-[var(--color-cobalt)] text-white hover:bg-[var(--color-cobalt-dark)] disabled:opacity-50',
  amber: 'bg-[var(--color-amber)] text-white hover:bg-[var(--color-amber-dark)] disabled:opacity-50',
  secondary: 'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-border-soft)]',
  ghost: 'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-border-soft)]',
  danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 disabled:opacity-50',
  link: 'bg-transparent text-[var(--color-cobalt)] hover:underline px-0',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-[15px] px-5 py-3 gap-2',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-[var(--radius-sm)] transition-colors duration-150 whitespace-nowrap',
        VARIANTS[variant],
        variant !== 'link' && SIZES[size],
        disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </Component>
  );
}
