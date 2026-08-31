# TASK-000 — Project Foundation

## Status

Ready

## Context

The repository currently defines the ERP architecture and rules but may not yet contain application code.

This task creates the minimum running foundation without implementing ERP business features.

## Objective

Create a lightweight Bun monorepo containing a working web application, API, PostgreSQL/Drizzle database package, shared configuration, and quality tooling.

## Requirements

### Root Workspace

Create a Bun workspace with:

- `apps/web`
- `apps/api`
- `packages/db`
- `packages/config`
- `packages/shared`

Do not create business module implementations yet.

### Web

Create `apps/web` using:

- React,
- Vite,
- TypeScript,
- TanStack Router,
- TanStack Query,
- Tailwind CSS.

Provide:

- base application shell,
- simple dashboard/home route,
- API health status example,
- accessible error/loading handling.

Do not build ERP feature pages.

### API

Create `apps/api` using:

- Bun,
- Hono,
- TypeScript,
- Zod.

Provide:

- `GET /api/v1/health`,
- centralized JSON error handling,
- request ID/correlation middleware,
- environment validation.

Health response should be stable and safe.

### Database

Create `packages/db` with:

- PostgreSQL connection setup,
- Drizzle configuration,
- migration tooling,
- one minimal infrastructure-level table only if required to verify migration setup.

Do not create ERP domain tables yet unless required by tooling.

### Config

Create typed environment configuration.

Provide `.env.example` with placeholders.

No secret values may be committed.

### Shared

Create only genuinely shared primitives needed by foundation.

Do not add speculative utility libraries.

### Tooling

Provide root commands for:

- development,
- build,
- typecheck,
- lint,
- format,
- tests.

Prefer the smallest practical dependency set.

### CI

Add a basic GitHub Actions workflow that runs the non-database quality checks practical for the foundation.

Do not introduce deployment automation yet.

## Non-Goals

Do not implement:

- authentication,
- companies,
- users,
- inventory,
- POS,
- accounting,
- payroll,
- Redis,
- BullMQ,
- Docker/Kubernetes unless needed solely for an optional local PostgreSQL convenience and kept minimal.

## Architecture Rules

Follow:

- `docs/ARCHITECTURE.md`
- `docs/CODING_RULES.md`
- `docs/DATABASE.md`

Do not collapse web/API/database code into one package.

## Security & Scope

- validate environment,
- do not expose stack traces in API responses,
- do not commit secrets.

No RBAC exists yet.

## Acceptance Criteria

- [ ] `bun install` succeeds.
- [ ] root dev scripts are documented.
- [ ] web app starts.
- [ ] API starts.
- [ ] `GET /api/v1/health` returns successful JSON.
- [ ] web can display API health without direct database access.
- [ ] database package can connect using configured PostgreSQL URL.
- [ ] migration tooling is configured.
- [ ] `.env.example` exists.
- [ ] typecheck passes.
- [ ] lint passes.
- [ ] tests that exist pass.
- [ ] build passes.
- [ ] README local setup is updated if implementation changes the documented commands.

## Testing Requirements

At minimum:

- API health route test,
- environment validation test where practical.

Do not add artificial tests for framework boilerplate.

## Validation

Run the actual project commands created for:

- format,
- lint,
- typecheck,
- tests,
- build.

Report each result truthfully.

## Git Delivery

Follow the repository Git workflow in `CLAUDE.md`:

- use a dedicated task branch
- create a validated commit for the completed foundation
- push the task branch successfully to `origin`

## References

- `CLAUDE.md`
- `docs/CONTEXT.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/CODING_RULES.md`
- `docs/TESTING.md`
- `docs/agent/DEFINITION_OF_DONE.md`
