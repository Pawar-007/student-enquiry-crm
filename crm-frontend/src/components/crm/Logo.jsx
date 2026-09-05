import { Link } from 'react-router-dom';

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 font-display text-lg text-[var(--color-ink)] ${className}`}>
      <span className="h-7 w-7 rounded-[6px] bg-[var(--color-cobalt)] text-white flex items-center justify-center text-sm font-semibold font-sans">
        L
      </span>
      Ledger
    </Link>
  );
}
