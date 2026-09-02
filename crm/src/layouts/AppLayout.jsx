import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutGrid, Users, Inbox, ListChecks, CalendarCheck2, PlusCircle,
  BookOpen, Settings2, GraduationCap, Menu, X, LogOut, ChevronDown,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import clsx from 'clsx'

const ADMIN_NAV = [
  { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/portal/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/portal/counsellors', label: 'Counsellors', icon: Users },
  { to: '/portal/courses/manage', label: 'Manage Courses', icon: Settings2 },
  { to: '/portal/teachers', label: 'Teachers', icon: GraduationCap },
  { to: '/portal/courses', label: 'Course Catalog', icon: BookOpen },
]

const COUNSELLOR_NAV = [
  { to: '/portal/my-enquiries', label: 'My Enquiries', icon: ListChecks },
  { to: '/portal/today', label: "Today's Follow-ups", icon: CalendarCheck2 },
  { to: '/portal/enquiries/new', label: 'New Enquiry', icon: PlusCircle },
  { to: '/portal/courses', label: 'Course Catalog', icon: BookOpen },
]

function SidebarContent({ nav, onNavigate }) {
  return (
    <nav className="flex-1 space-y-0.5 px-3 py-4">
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-ink-soft hover:bg-paper hover:text-ink'
            )
          }
        >
          <Icon size={17} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = user?.role === 'Admin' ? ADMIN_NAV : COUNSELLOR_NAV

  function handleLogout() {
    logout()
    navigate('/staff-login')
  }

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border-soft bg-surface">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500 text-white font-bold text-sm">L</div>
          <span className="text-[15px] font-bold tracking-tight text-ink">Ledger</span>
        </div>
        <SidebarContent nav={nav} />
        <div className="border-t border-border-soft p-3">
          <div className="rounded-md bg-paper px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-ink">{user?.email}</p>
            <p className="text-xs text-ink-faint">{user?.role}</p>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-surface shadow-pop">
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500 text-white font-bold text-sm">L</div>
                <span className="text-[15px] font-bold tracking-tight text-ink">Ledger</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-ink-faint">
                <X size={20} />
              </button>
            </div>
            <SidebarContent nav={nav} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-border-soft bg-surface px-4 lg:px-6">
          <button className="lg:hidden text-ink-soft" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-ink-soft hover:bg-paper"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-50 text-accent-600 text-xs font-bold">
                {user?.email?.[0]?.toUpperCase()}
              </span>
              <span className="hidden sm:inline">{user?.email}</span>
              <ChevronDown size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 rounded-md border border-border-soft bg-surface py-1 shadow-pop">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-soft hover:bg-paper hover:text-danger"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
