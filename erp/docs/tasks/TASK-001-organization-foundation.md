# TASK-001 — Organization Foundation

## Status

Ready

## Context

Following project foundation setup (TASK-000), Milestone 1 requires establishing the Organization domain module and database schema. All business operations in the ERP require scoped tenancy and hierarchy (Company -> Branch -> Department / Cost Center).

## Objective

Implement the backend organization foundation: PostgreSQL Drizzle database schema, organization domain/application/infrastructure/presentation module, REST API endpoints via Hono, unit/application tests, and database integration tests gated by `TEST_DATABASE_URL`.

## Requirements

### 1. Database Schema (`packages/db`)
- Create tables with PostgreSQL Drizzle ORM:
  - `companies`: `id` (UUID PK), `code` (varchar, unique), `name` (varchar), `is_active` (boolean default true), `created_at`, `updated_at`.
  - `branches`: `id` (UUID PK), `company_id` (UUID FK -> `companies.id` ON DELETE RESTRICT/CASCADE), `code` (varchar), `name` (varchar), `is_active` (boolean default true), `created_at`, `updated_at`. Unique constraint on `(company_id, code)`.
  - `departments`: `id` (UUID PK), `company_id` (UUID FK -> `companies.id` ON DELETE RESTRICT/CASCADE), `code` (varchar), `name` (varchar), `is_active` (boolean default true), `created_at`, `updated_at`. Unique constraint on `(company_id, code)`.
  - `cost_centers`: `id` (UUID PK), `company_id` (UUID FK -> `companies.id` ON DELETE RESTRICT/CASCADE), `code` (varchar), `name` (varchar), `is_active` (boolean default true), `created_at`, `updated_at`. Unique constraint on `(company_id, code)`.
- Scoped indexes for foreign keys and queries.
- Preserve existing `_migrations_check` table.
- Generate Drizzle migration files if possible.

### 2. Organization Module (`modules/organization`)
- **Domain (`modules/organization/domain`)**:
  - Entity types / value interfaces: `Company`, `Branch`, `Department`, `CostCenter`.
  - Domain error types: `OrganizationNotFoundError`, `DuplicateCodeError`, `OrganizationValidationError`, `InvalidParentError`.
  - Repository interfaces: `OrganizationRepository` with scoped methods (find by ID, find by code, list by company, create, update, delete/deactivate).
- **Application (`modules/organization/application`)**:
  - Use cases / services for Company (create, get, list, update).
  - Use cases / services for Branch (create, get, list by company, update).
  - Use cases / services for Department (create, get, list by company, update).
  - Use cases / services for CostCenter (create, get, list by company, update).
- **Infrastructure (`modules/organization/infrastructure`)**:
  - Drizzle-based implementation of `OrganizationRepository` mapping Drizzle queries to domain entities.
- **Presentation (`modules/organization/presentation`)**:
  - Thin Hono router with Zod schema validation for input payloads and query parameters.
  - Safe error mapping (400 for validation, 404 for not found, 409 for duplicate code, 500 for internal error).
- **Public API (`modules/organization/index.ts`)**:
  - Export public use cases, types, and route factory.

### 3. API Integration (`apps/api`)
- Mount organization routes under `/api/v1`, using `/companies` and explicit company-scoped child resources such as `/companies/:companyId/branches`.
- Maintain `/api/v1/health` and centralized error handling.
- Endpoints are temporarily unauthenticated until IAM is implemented in TASK-002; they must not be exposed publicly before server-side authorization exists.

### 4. Minimal Web UI (`apps/web`)
- Provide focused management screens for Companies, Branches, Departments, and Cost Centers.
- Include loading, empty, error, validation, success, and duplicate-submission states.
- Require explicit company selection for child resources.
- Do not implement role-based UI before TASK-002.

### 5. Testing
- Deterministic unit/application tests for use cases and repository contracts (using mock or in-memory repository).
- API route tests testing validation, error mapping, and happy paths with mocked application/repository layer.
- PostgreSQL integration tests running against real database only when `TEST_DATABASE_URL` is set, gracefully skipped otherwise.

## Non-Goals

- Frontend UI implementations for organization.
- IAM user/permission binding (handled in Milestone 2 / TASK-002).
- Advanced multi-tenant custom schema isolation.

## Acceptance Criteria

- [ ] Drizzle schema exported in `@open-erp/db` for `companies`, `branches`, `departments`, `cost_centers`.
- [ ] Unique constraints and FK relationships strictly enforced in schema.
- [ ] Organization domain and application logic implemented with clear boundaries.
- [ ] REST API endpoints implemented with Zod validation and structured JSON responses.
- [ ] Unit and route tests pass deterministically.
- [ ] Database integration tests execute if `TEST_DATABASE_URL` provided, skip cleanly if not.
- [ ] `typecheck`, `lint`, `format:check`, and `test` pass.

## Testing Requirements

- Unit tests for all use cases (validation, duplicate handling, company-scoping).
- Presentation route tests for all endpoints.
- Integration tests against PostgreSQL when `TEST_DATABASE_URL` is present.

## Validation

- `bun run format:check`
- `bun run lint`
- `bun run typecheck`
- `bun run test`

## Git Delivery

- use a dedicated task branch
- commit completed work
- push the branch to `origin`
- report commit hash and push result

## References

- `CLAUDE.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/CODING_RULES.md`
- `docs/TESTING.md`
- `docs/agent/DEFINITION_OF_DONE.md`
