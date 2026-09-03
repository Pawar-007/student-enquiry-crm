import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { Menu, X, GraduationCap, Mail, Phone, MapPin } from 'lucide-react'
import clsx from 'clsx'
import Button from '../components/Button'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/courses', label: 'Courses' },
]

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border-soft bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-500 text-white">
              <GraduationCap size={18} />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-ink">Ledger Institute</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  clsx(
                    'text-sm font-semibold transition-colors',
                    isActive ? 'text-primary-600' : 'text-ink-soft hover:text-ink'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <Link to="/staff-login" className="text-xs font-medium text-ink-faint hover:text-ink-soft">
              Staff Login
            </Link>
            <Button as={Link} to="/apply" size="sm">Apply Now</Button>
          </div>

          <button className="md:hidden text-ink-soft" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 flex h-full w-64 flex-col bg-surface p-5 shadow-pop">
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold text-ink">Ledger Institute</span>
                <button onClick={() => setMobileOpen(false)} className="text-ink-faint"><X size={20} /></button>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'rounded-md px-3 py-2.5 text-sm font-semibold',
                        isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-soft hover:bg-paper'
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <Link
                  to="/staff-login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-md px-3 py-2.5 text-xs font-medium text-ink-faint hover:bg-paper"
                >
                  Staff Login
                </Link>
              </nav>
              <Button as={Link} to="/apply" className="mt-4" onClick={() => setMobileOpen(false)}>
                Apply Now
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-soft bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3 lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500 text-white">
                <GraduationCap size={16} />
              </div>
              <span className="font-display text-base font-semibold text-ink">Ledger Institute</span>
            </div>
            <p className="mt-3 text-sm text-ink-faint max-w-xs">
              Helping students find the right course and the right career, one enquiry at a time.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
              <li><Link to="/courses" className="hover:text-primary-600">Courses</Link></li>
              <li><Link to="/apply" className="hover:text-primary-600">Apply Now</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">Get in touch</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li className="flex items-center gap-2"><Phone size={14} className="text-ink-faint" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-ink-faint" /> admissions@ledger.edu</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-ink-faint" /> Pune, Maharashtra</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border-soft py-4 text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} Ledger Institute. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
