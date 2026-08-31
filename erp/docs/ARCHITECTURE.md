# Architecture

## 1. Architecture Style

The application uses a **modular monolith**.

A small number of deployable applications contain clearly separated business modules.

```text
Browser
  |
  v
apps/web
  |
  | HTTPS / JSON
  v
apps/api
  |
  +------------------+
  |                  |
  v                  v
PostgreSQL       Redis (optional)
                     |
                     v
                apps/worker
```

## 2. Repository Shape

Target structure:

```text
apps/
  web/
  api/
  worker/

packages/
  db/
  config/
  shared/
  validation/
  ui/
  auth/

modules/
  organization/
  iam/
  inventory/
  warehouse/
  purchasing/
  sales/
  pos/
  pricing/
  accounting/
  tax/
  hr/
  attendance/
  payroll/
  assets/
  workflow/
  notification/
```

Do not create all folders before they are needed unless the bootstrap task explicitly calls for placeholders.

## 3. Backend Module Structure

Preferred structure:

```text
modules/inventory/
  domain/
  application/
  infrastructure/
  presentation/
  index.ts
```

### domain

Contains:

- entities,
- value objects,
- domain policies,
- domain services,
- domain errors,
- repository interfaces when they are truly domain-facing.

Must not import:

- Hono,
- Drizzle,
- Redis,
- React,
- Node/Bun-specific infrastructure except standard language primitives.

### application

Contains:

- use cases,
- commands/queries,
- orchestration,
- authorization-aware application policies,
- transaction boundaries through abstractions.

### infrastructure

Contains:

- Drizzle repositories,
- database mapping,
- external providers,
- queue adapters,
- email adapters.

### presentation

Contains:

- HTTP routes,
- request parsing,
- response mapping,
- middleware composition.

Routes should be thin.

## 4. Frontend Architecture

Preferred feature organization:

```text
apps/web/src/
  app/
  routes/
  features/
  components/
  lib/
```

A feature may contain:

- query hooks,
- mutation hooks,
- schemas,
- forms,
- tables,
- feature-specific components.

Shared visual primitives belong in `packages/ui` only after reuse is demonstrated.

## 5. Module Boundaries

A module owns its:

- business rules,
- tables unless explicitly shared,
- application services,
- integration events.

Other modules must not import private infrastructure paths.

Allowed cross-module access should happen through a documented public API.

Example:

`purchasing -> inventory.receiveGoods()`

is acceptable through a public application interface.

`purchasing -> inventory/infrastructure/stockRepository`

is forbidden.

## 6. Shared Platform Capabilities

The following capabilities may be shared across modules:

- identity context,
- authorization,
- audit log writer,
- document numbering,
- transaction context,
- notification dispatch,
- clock/date abstraction where deterministic tests benefit,
- configuration access.

Shared packages must not become a dumping ground for unrelated business logic.

## 7. Database Ownership

A module should conceptually own its tables.

Cross-module foreign keys are allowed when the relationship is core and stable, but avoid arbitrary coupling.

Examples of acceptable shared references:

- `company_id`,
- `branch_id`,
- `user_id`,
- `employee_id` where business ownership is explicit.

## 8. Transactions

Use database transactions for operations that must succeed or fail atomically.

Examples:

- post journal + journal lines,
- goods receipt + stock movement,
- POS sale + stock posting + payment record,
- payroll finalization + accounting posting request.

Avoid holding transactions open while calling slow external services.

## 9. Integration Events

Use in-process integration events for decoupling when useful.

Examples:

- `PurchaseOrderApproved`
- `GoodsReceived`
- `SalePosted`
- `PayrollFinalized`

An event is not a substitute for a direct synchronous invariant.

If inventory posting must succeed for a sale to be considered posted, keep it in the same application transaction rather than relying on eventual delivery.

## 10. Background Work

Use the worker for slow/non-interactive operations such as:

- bulk imports,
- report generation,
- notification delivery,
- PDF generation,
- scheduled depreciation,
- scheduled reminders.

Redis/BullMQ should be introduced only when such a requirement exists.

## 11. Authentication & Authorization

Authentication establishes identity.

Authorization is enforced in application/backend code.

Suggested permission notation:

`<domain>.<resource>.<action>`

Examples:

- `inventory.product.read`
- `inventory.stock.adjust`
- `purchasing.order.approve`
- `accounting.journal.post`

Scopes may include:

- tenant,
- company,
- branch,
- warehouse.

## 12. Configuration

Company-specific behavior should use explicit configuration rather than source-code forks.

Examples:

- negative stock policy,
- document numbering,
- approval thresholds,
- fiscal settings,
- working schedules.

## 13. Architectural Anti-Patterns

Do not:

- create generic "utils" containing business rules,
- expose database rows directly as API contracts everywhere,
- use global mutable state for request context,
- couple modules via hidden table access,
- rely on frontend checks for security,
- introduce event-driven complexity for simple synchronous workflows,
- create an abstraction before a real use case requires it.

## 14. Architecture Changes

Any significant change requires an ADR containing:

- context,
- decision,
- alternatives,
- consequences.
