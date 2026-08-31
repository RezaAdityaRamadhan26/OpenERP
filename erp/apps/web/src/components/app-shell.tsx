import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-900">Open ERP</h1>
        </div>
        <nav className="flex-1 p-2">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100"
          >
            Dashboard
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200 text-xs text-slate-400">
          v0.0.1
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6">
          <span className="text-sm text-slate-500">Foundation</span>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
