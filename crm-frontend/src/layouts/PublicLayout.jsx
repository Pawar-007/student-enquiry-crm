import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../components/crm/Logo';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/courses', label: 'Courses' },
  { to: '/enquiry', label: 'Enquire' },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = role === 'ADMIN' ? '/admin/dashboard' : '/counsellor/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <header className="sticky top-0 z-40 bg-[var(--color-paper)]/90 backdrop-blur border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-[var(--color-cobalt)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button size="sm" variant="secondary" onClick={() => navigate(dashboardPath)}>
                Go to Dashboard
              </Button>
            ) : (
              <Button size="sm" variant="secondary" as={Link} to="/login">
                Staff Login
              </Button>
            )}
            <Button size="sm" variant="primary" as={Link} to="/enquiry">
              Enquire Now
            </Button>
          </div>
          <button
            className="md:hidden p-2 text-[var(--color-ink)]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] px-5 py-4 flex flex-col gap-4 bg-[var(--color-paper)]">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-[var(--color-cobalt)]' : 'text-[var(--color-ink-soft)]'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)]">
              {isAuthenticated ? (
                <Button size="sm" variant="secondary" onClick={() => navigate(dashboardPath)}>
                  Go to Dashboard
                </Button>
              ) : (
                <Button size="sm" variant="secondary" as={Link} to="/login">
                  Staff Login
                </Button>
              )}
              <Button size="sm" variant="primary" as={Link} to="/enquiry">
                Enquire Now
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-border)] mt-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-[var(--color-muted)]">
            Helping students find the right course and the right guidance, from first enquiry to enrollment.
          </p>
          <div className="flex gap-6 text-sm text-[var(--color-ink-soft)]">
            <Link to="/courses" className="hover:text-[var(--color-cobalt)]">Courses</Link>
            <Link to="/enquiry" className="hover:text-[var(--color-cobalt)]">Enquiry</Link>
            <Link to="/login" className="hover:text-[var(--color-cobalt)]">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
