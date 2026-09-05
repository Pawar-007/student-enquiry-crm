import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/crm/Logo';
import { Input } from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { isRequired, isValidEmail, runValidators } from '../../utils/validators';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = runValidators(form, {
      email: [isRequired, isValidEmail],
      password: [isRequired],
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { role } = await login(form.email, form.password);

      if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'COUNSELLOR') {
        navigate('/counsellor/dashboard', { replace: true });
      } else {
        throw new Error(`Unknown user role: ${role}`);
      }
    } catch (err) {
      if (err.validationErrors) {
        setErrors(err.validationErrors);
      } else {
        setApiError(err.message || 'Invalid email or password.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)] px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-7 sm:p-8">
          <h1 className="font-display text-xl text-[var(--color-ink)] mb-1">Staff sign in</h1>
          <p className="text-sm text-[var(--color-muted)] mb-6">For Admin and Counsellor accounts only.</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {apiError && (
              <div role="alert" className="rounded-[var(--radius-sm)] bg-[var(--color-danger-soft)] text-[var(--color-danger)] text-sm px-4 py-3">
                {apiError}
              </div>
            )}
            <Input id="email" label="Email" type="email" required autoComplete="username" value={form.email} onChange={setField('email')} error={errors.email} placeholder="you@institute.com" />
            <Input id="password" label="Password" type="password" required autoComplete="current-password" value={form.password} onChange={setField('password')} error={errors.password} placeholder="••••••••" />
            <Button type="submit" size="lg" variant="primary" loading={submitting} className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
