import { Link, useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Companies', to: '/organization/companies' },
  { label: 'Branches', to: '/organization/branches' },
  { label: 'Departments', to: '/organization/departments' },
  { label: 'Cost Centers', to: '/organization/cost-centers' },
];

export function AppShell({ children }: AppShellProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Open ERP</h1>
          <p className="text-xs text-slate-500 mt-0.5">Enterprise Management</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            General
          </div>
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPath === '/'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Dashboard
          </Link>

          <div className="pt-4 px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Organization
          </div>
          {navItems.slice(1).map((item) => {
            const isActive = currentPath === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
          <span>v0.0.1</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6">
          <span className="text-sm font-medium text-slate-700">
            {navItems.find((item) => item.to === currentPath)?.label || 'Open ERP'}
          </span>
          <div className="text-xs text-slate-400">TASK-001 Organization</div>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}

