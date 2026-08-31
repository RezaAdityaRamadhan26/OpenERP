# Roadmap

The roadmap controls implementation order. It is not a promise of release dates.

## Milestone 0 — Foundation

- Bun workspace
- `apps/web`
- `apps/api`
- shared TypeScript config
- environment validation
- PostgreSQL + Drizzle
- health endpoint
- base React shell
- lint/format/typecheck/test scripts
- CI baseline
- `.env.example`

Primary task:

`TASK-000-project-foundation.md`

## Milestone 1 — Organization

- company
- branch
- department
- cost center
- company settings baseline

## Milestone 2 — IAM & Audit

- user
- authentication
- roles
- permissions
- scopes
- audit log baseline

## Milestone 3 — Product & Inventory

- product
- UOM
- warehouse
- stock movement ledger
- stock balance projection
- adjustments
- transfers
- stock opname baseline

## Milestone 4 — Purchasing

- supplier
- purchase request
- purchase order
- workflow approval integration
- goods receipt
- stock posting

## Milestone 5 — Sales & Pricing

- customer
- sales order
- price list
- promotion rules
- sales posting baseline

## Milestone 6 — POS

- POS register/session
- sale
- payments
- receipt
- stock integration
- offline-sync design boundary

## Milestone 7 — Accounting Core

- chart of accounts
- journal entry
- posting
- fiscal period
- AP/AR baseline
- operational posting interfaces
- reversal

## Milestone 8 — Workflow & Approval

- definitions
- conditions
- workflow instances
- approver resolution
- decisions
- audit history

This may be partially introduced earlier for purchasing, but generalized here.

## Milestone 9 — HR

- employee
- employment
- department/position linkage
- status

## Milestone 10 — Attendance & Shift

- shift definitions
- assignment
- raw attendance events
- normalization
- lateness/overtime inputs

## Milestone 11 — Payroll

- components
- structures
- periods
- payroll run
- payslip
- attendance integration
- accounting integration

## Milestone 12 — Assets

- registry
- assignment
- depreciation
- maintenance
- disposal

## Milestone 13 — Tax

- tax definitions
- rates/effective dates
- calculation contracts
- tax lines
- reporting extension points

## Milestone 14 — Notifications

- in-app notification
- templates
- async delivery abstraction
- email provider adapter
- delivery status

## Milestone 15 — Hardening

- end-to-end demo flows
- performance review
- security review
- documentation review
- sample/demo data
- release packaging

## Future

Possible future modules:

- returns,
- budgeting,
- expenses/reimbursements,
- document management,
- CRM,
- manufacturing/MRP,
- project management,
- advanced WMS.
