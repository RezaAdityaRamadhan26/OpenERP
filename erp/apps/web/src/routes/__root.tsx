import { createRootRouteWithContext, createRoute, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { AppShell } from '../components/app-shell.js';
import { DashboardPage } from '../pages/dashboard.js';

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

export const routeTree = rootRoute.addChildren([indexRoute]);
