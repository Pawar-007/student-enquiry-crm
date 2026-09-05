import { Settings as SettingsIcon } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { email, role } = useAuth();
  return (
    <div>
      <PageHeader title="Settings" description="Your account details." />
      <div className="max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex items-start gap-4">
        <div className="h-11 w-11 rounded-full bg-[var(--color-cobalt-soft)] text-[var(--color-cobalt)] flex items-center justify-center shrink-0">
          <SettingsIcon size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-ink)]">{email}</p>
          <p className="text-sm text-[var(--color-muted)] mt-0.5">Role: {role}</p>
          <p className="text-xs text-[var(--color-muted)] mt-4">
            Account management endpoints (password change, profile edit) aren't defined in the current API contract.
          </p>
        </div>
      </div>
    </div>
  );
}
