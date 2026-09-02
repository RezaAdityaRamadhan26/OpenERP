# TASK-001 — Organization Foundation

## Status

Completed

## Context

TASK-000 established the Bun workspace, Hono API, React/Vite web app, and PostgreSQL/Drizzle foundation. The first ERP module must now establish explicit company scope before IAM and operational modules are introduced.

The task prompt is the authoritative specification. TASK-001 includes a minimal Organization UI and real PostgreSQL integration tests using `TEST_DATABASE_URL`, with a PostgreSQL service in CI.

## Objective

Implement the Organization foundation for Company, Branch, Department, and Cost Center with explicit company-scoped application and repository APIs, PostgreSQL constraints and migrations, validated REST endpoints, a minimal management UI, deterministic tests, and CI-backed PostgreSQL validation.

## Requirements

- Use the existing TypeScript, Bun, Hono, React, TanStack Router, TanStack Query, Zod, PostgreSQL, and Drizzle stack.
- Add only the Organization module under `modules/organization/`.
- Use domain, application, infrastructure, and presentation layers only where they contain real behavior.
- Preserve inactive records. Do not add destructive deletion endpoints.
- Do not implement IAM or any later ERP module.

## Non-Goals

- Authentication, users, sessions, roles, or permissions.
- Inventory, warehouse, purchasing, sales, POS, pricing, accounting, tax, HR, attendance, payroll, assets, workflow, or notifications.
- Tenant-specific schemas, microservices, Redis, queues, or deployment automation.
- Speculative Organization fields not required by the current domain: addresses, tax identifiers, currencies, reporting hierarchies, or contact details.

## Affected Areas

- `modules/organization/` — domain rules, use cases, repositories, HTTP presentation, tests.
- `packages/db/` — Organization tables, indexes, constraints, migration, schema tests.
- `apps/api/` — route composition and API tests.
- `apps/web/` — Organization routes, query hooks, forms, tables, and UI validation tests.
- `packages/config/`, `.env.example` — `TEST_DATABASE_URL` documentation and validation.
- `.github/workflows/ci.yml` — PostgreSQL service and integration test execution.
- `README.md` — local setup, commands, endpoint/UI scope, temporary no-auth warning.

## Business Rules

1. A Branch belongs to exactly one Company.
2. A Department belongs to exactly one Company.
3. A Cost Center belongs to exactly one Company.
4. Child records cannot reference a missing Company.
5. Child get, list, and update operations require an explicit `companyId`; a record from another company must appear not found.
6. Company code is unique in the current tenant-less baseline.
7. Branch, Department, and Cost Center codes are unique within a Company.
8. Codes are normalized to uppercase; names are trimmed.
9. New child records cannot be created under an inactive Company.
10. Inactive Organization records remain retrievable and may be included in lists for historical references.
11. Activation and deactivation use updates; no destructive deletion is provided.
12. The implementation must not assume a single-company deployment.

## Security & Scope

- Company scope must be explicit in child repository and application methods.
- Cross-company get/update access must be rejected without revealing that the target exists in another Company.
- Zod validates request bodies, query parameters, and identifiers at HTTP boundaries.
- Client responses use stable machine-readable error codes and never expose stack traces.
- Organization endpoints are temporarily unauthenticated until TASK-002. They must not be exposed publicly before server-side IAM enforcement is added.
- Frontend scope checks are UX only and must not replace backend scoping.

## Database Requirements

Use PostgreSQL and Drizzle ORM.

Tables:

- `companies`: UUID `id`, unique `code`, `name`, `is_active`, timezone-aware `created_at`, timezone-aware `updated_at`.
- `branches`: UUID `id`, non-null `company_id` FK, `code`, `name`, `is_active`, timestamps, unique `(company_id, code)`.
- `departments`: UUID `id`, non-null `company_id` FK, `code`, `name`, `is_active`, timestamps, unique `(company_id, code)`.
- `cost_centers`: UUID `id`, non-null `company_id` FK, `code`, `name`, `is_active`, timestamps, unique `(company_id, code)`.

Requirements:

- Foreign keys use restrictive deletion.
- Index each `company_id` used for scoped access.
- Add indexes supporting active/list queries where justified.
- Preserve the TASK-000 `_migrations_check` table.
- Add a new reviewable PostgreSQL migration. Do not rewrite shared migration history.
- Do not create tables for later modules.

## API Requirements

Expose under `/api/v1`:

- Companies: `GET /companies`, `GET /companies/:id`, `POST /companies`, `PATCH /companies/:id`.
- Branches: `GET/POST /companies/:companyId/branches`, `GET/PATCH /companies/:companyId/branches/:id`.
- Departments: `GET/POST /companies/:companyId/departments`, `GET/PATCH /companies/:companyId/departments/:id`.
- Cost Centers: `GET/POST /companies/:companyId/cost-centers`, `GET/PATCH /companies/:companyId/cost-centers/:id`.

Child resource requests carry explicit `companyId` in the route. Frontend and backend must use these routes consistently.

- No `DELETE` endpoints.
- Routes parse/map HTTP concerns only; business rules remain in the application/domain layers.
- Use stable Organization error codes for validation, duplicate code, missing records, invalid Company, and cross-company access.
- Preserve the existing health endpoint and request ID middleware.

## Frontend Requirements

Provide minimal usable screens for:

- Companies
- Branches
- Departments
- Cost Centers

Each screen supports list, create, edit, and activate/deactivate. Child screens require an explicit Company selector. Include loading, empty, server-error, validation-error, success, and duplicate-submission states. Reuse the existing shell, TanStack Router, TanStack Query, and Tailwind setup. Do not add role-based UI or unrelated dashboard work.

Frontend types and payloads must match backend camelCase contracts (`companyId`, `isActive`, `createdAt`, `updatedAt`). Do not expose speculative fields absent from the database/domain model.

## Testing Requirements

Add deterministic tests for:

- Company create, get, list, update, activate, and deactivate.
- Company code normalization and uniqueness.
- Branch, Department, and Cost Center create/get/list/update/activate/deactivate.
- Same child code allowed across different Companies but rejected within one Company.
- Cross-company get/update rejection for every child type.
- Inactive record retrieval and active/inactive list behavior.
- API happy paths, Zod validation, stable errors, and scoped access.
- Database foreign keys, unique constraints, scoped repository queries, and migration-applied behavior against real PostgreSQL.
- Frontend form validation and API contract behavior where practical without speculative test infrastructure.

Unit tests may use deterministic repository doubles for application behavior. Database claims must use PostgreSQL; do not substitute SQLite or an in-memory database.

## CI Requirements

- Add a PostgreSQL service using a stable pinned image.
- Configure test database, user, password, port, and `pg_isready` health check.
- Set `DATABASE_URL` and `TEST_DATABASE_URL` to CI-only credentials.
- Install with the frozen Bun lockfile.
- Apply migrations before integration tests.
- Run format, lint, typecheck, unit/API tests, PostgreSQL integration tests, and builds.
- CI must run for task branches or their pull requests, not only after merge to `main`.

## Acceptance Criteria

- [ ] The detailed task specification exists and matches the approved prompt decisions.
- [ ] `companies`, `branches`, `departments`, and `cost_centers` are exported by `@open-erp/db`.
- [ ] PostgreSQL migration, foreign keys, scoped unique constraints, and indexes exist.
- [ ] Organization domain/application/infrastructure/presentation boundaries are real and reviewable.
- [ ] Child repository/application APIs require explicit Company scope.
- [ ] Company and all child use cases support create/get/list/update/activate/deactivate without deletion.
- [ ] REST endpoints use Zod and stable safe JSON errors.
- [ ] Minimal Organization UI supports the required workflows and states.
- [ ] Frontend and backend contracts/routes are consistent.
- [ ] Unit, API, UI validation, and PostgreSQL integration tests exist and pass in their required environments.
- [ ] CI provisions PostgreSQL, applies migrations, and runs integration tests.
- [ ] `.env.example` and README document `TEST_DATABASE_URL` and the temporary no-auth limitation.
- [ ] Format, lint, typecheck, tests, integration tests, and builds pass.
- [ ] No TASK-002 or later-module code/tables were introduced.
- [ ] The task branch is committed and pushed successfully.

## Git Delivery

- Use `feat/task-001-organization`.
- Review status and diff before committing.
- Commit only TASK-001 changes with meaningful Conventional Commits.
- Push successfully to `origin` without force-pushing or merging into `main`.
- Report branch, commit hashes/messages, validation, CI result, and limitations.

## References

- `CLAUDE.md`
- `docs/PRD.md`
- `docs/CONTEXT.md`
- `docs/ARCHITECTURE.md`
- `docs/DOMAIN_MODEL.md`
- `docs/DATABASE.md`
- `docs/API.md`
- `docs/CODING_RULES.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/SECURITY_ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/modules/organization.md`
- `docs/agent/WORKFLOW.md`
- `docs/agent/DEFINITION_OF_DONE.md`
- `docs/agent/REVIEW_CHECKLIST.md`
