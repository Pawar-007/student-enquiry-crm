import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, LogOut, Menu, X } from 'lucide-react';
import Logo from '../components/crm/Logo';
import { useAuth } from '../hooks/useAuth';
import { initials } from '../utils/format';

// sections: [{ title?, items: [{ to, label, icon, end? }] }]
export default function DashboardShell({ sections, roleLabel }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`flex items-center h-16 px-4 border-b border-[var(--color-border)] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <Logo />}
        <button
          className="hidden md:flex p-1.5 rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-border-soft)]"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
        <button className="md:hidden p-1.5 text-[var(--color-muted)]" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto thin-scroll py-4 px-2" aria-label="Primary">
        {sections.map((section, i) => (
          <div key={i} className="mb-5">
            {section.title && !collapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">{section.title}</p>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--color-cobalt-soft)] text-[var(--color-cobalt)]'
                          : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-border-soft)] hover:text-[var(--color-ink)]'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={`border-t border-[var(--color-border)] p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-danger)] px-2 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-danger-soft)] w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} />
          {!collapsed && 'Log out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--color-paper)]">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] sticky top-0 h-screen transition-all duration-200 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-[var(--color-ink)]/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full bg-[var(--color-surface)] shadow-xl">{SidebarContent}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-[var(--color-surface)]/90 backdrop-blur border-b border-[var(--color-border)] flex items-center justify-between px-4 sm:px-6">
          <button className="md:hidden p-2 -ml-2 text-[var(--color-ink)]" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <p className="hidden md:block text-sm text-[var(--color-muted)]">{roleLabel}</p>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[var(--color-ink)] leading-tight">{email}</p>
              <p className="text-xs text-[var(--color-muted)] leading-tight">{roleLabel}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-[var(--color-cobalt-soft)] text-[var(--color-cobalt)] flex items-center justify-center text-sm font-semibold">
              {initials(email)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
