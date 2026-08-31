import { createRootRouteWithContext, createRoute, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { AppShell } from '../components/app-shell.js';
import { DashboardPage } from '../pages/dashboard.js';
import {
  BranchesPage,
  CompaniesPage,
  CostCentersPage,
  DepartmentsPage,
} from '../features/organization/index.js';

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

const companiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/organization/companies',
  component: CompaniesPage,
});

const branchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/organization/branches',
  component: BranchesPage,
});

const departmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/organization/departments',
  component: DepartmentsPage,
});

const costCentersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/organization/cost-centers',
  component: CostCentersPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  companiesRoute,
  branchesRoute,
  departmentsRoute,
  costCentersRoute,
]);

