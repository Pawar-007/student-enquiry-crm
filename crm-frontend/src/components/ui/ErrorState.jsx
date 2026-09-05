import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong while loading this data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-12 w-12 rounded-full bg-[var(--color-danger-soft)] flex items-center justify-center mb-4 text-[var(--color-danger)]">
        <AlertCircle size={22} />
      </div>
      <h3 className="font-display text-lg text-[var(--color-ink)] mb-1">Couldn't load this</h3>
      <p className="text-sm text-[var(--color-muted)] max-w-sm mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
