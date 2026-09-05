import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[var(--color-paper)]">
      <p className="font-display text-6xl text-[var(--color-cobalt)]/30 mb-4">404</p>
      <h1 className="font-display text-2xl text-[var(--color-ink)] mb-2">Page not found</h1>
      <p className="text-[var(--color-muted)] mb-6">The page you're looking for doesn't exist or has moved.</p>
      <Button as={Link} to="/" variant="primary">Back to home</Button>
    </div>
  );
}
