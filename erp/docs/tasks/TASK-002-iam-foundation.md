# TASK-002 — IAM Foundation

## Status

Ready

## Context

TASK-000 established the application foundation and TASK-001 established explicit Company scope. Organization endpoints are temporarily unauthenticated. TASK-002 adds the minimum secure Identity and Access Management foundation needed to authenticate users and enforce permission plus Company/optional Branch scope on current resources.

The approved security decisions are authoritative:

- CSRF: trusted-Origin validation plus SameSite cookies.
- Initial administrator: one-time environment-driven Bun CLI.
- Role assignment scope: required `companyId` plus optional `branchId`; null means Company-wide.

## Objective

Implement password authentication, opaque server-managed sessions, Company/optional Branch-scoped RBAC, protected Organization APIs, an append-oriented IAM audit baseline, a safe administrator bootstrap command, a minimal IAM frontend, and real PostgreSQL security/integration tests.

## Requirements

### Domain

Implement clear IAM types and errors for:

- User
- Session
- Role
- Permission
- RolePermission
- UserRole
- authenticated Identity
- Company/Branch authorization scope
- IAM audit event

User and future HR Employee remain separate concepts. Public User/session contracts must never expose password hashes, session token digests, or raw credentials.

### Users and passwords

- Minimum User fields: UUID id, normalized unique email, display name, password hash, active/disabled state, timestamps.
- Normalize email deterministically before lookup and persistence.
- Hash passwords before persistence using Bun's trusted password API and Argon2id; do not implement custom cryptography.
- Compare passwords using the trusted verification primitive.
- Unknown email and wrong password return the same safe invalid-credentials response.
- Disabled users cannot log in or continue using sessions.
- Password hashes never appear in normal API responses, audit metadata, or logs.

### Sessions

- Use an opaque cryptographically random session identifier.
- Persist only a SHA-256 digest of the raw token.
- Transport the token only in an `HttpOnly` cookie.
- Cookie requirements: `SameSite=Lax`, `Path=/`, expiry/Max-Age, and `Secure` in production.
- Enforce session expiration and revocation.
- Logout revokes the server-side session and clears the cookie.
- Do not use localStorage or JWTs for authoritative authentication.

### CSRF

- State-changing cookie-authenticated requests validate the request `Origin` against the configured trusted origin.
- Apply the same trusted-Origin policy to login and logout.
- Reject missing or untrusted origins with a stable CSRF error.
- Document the same-origin deployment assumption.
- Login rate limiting is a documented production limitation unless a lightweight requirement emerges; do not add Redis solely for this task.

### RBAC and scope

- Permission keys use `<domain>.<resource>.<action>`.
- Authorization evaluates identity + permission + scope; role names are never the authorization primitive.
- Role assignments require `companyId`.
- `branchId` is optional:
  - null means the role applies Company-wide;
  - non-null means Branch-scoped;
  - the Branch must belong to the same Company.
- Cross-Company role/Branch assignment is rejected.
- Frontend permission checks are UX only; APIs enforce authorization server-side.

### Baseline permissions

Seed only current permissions deterministically and idempotently:

- `organization.company.read`
- `organization.company.manage`
- `organization.branch.read`
- `organization.branch.manage`
- `organization.department.read`
- `organization.department.manage`
- `organization.cost-center.read`
- `organization.cost-center.manage`
- `iam.user.read`
- `iam.user.manage`
- `iam.role.read`
- `iam.role.manage`
- `iam.permission.read`

Do not seed speculative future-module permissions.

### Organization integration

- Validate Company and Branch scope through the Organization public/application boundary or stable relational constraints consistent with module ownership.
- Do not import Organization private infrastructure.
- Protect existing Organization endpoints:
  - get/list operations require the corresponding `.read` permission;
  - create/update/activate/deactivate require the corresponding `.manage` permission.
- Company scope must be derived explicitly from request context/resource scope.
- ID swapping or cross-Company access must return denial/not-found without data leakage.

### Application use cases

Authentication:

- login
- logout/revoke session
- get current user/session

Users:

- create user
- list users within accessible Company context
- update safe User fields
- enable/disable user

Roles and permissions:

- create/list/update Role
- list Permission
- assign/remove Permission on Role
- assign/remove Role on User within Company/optional Branch scope

Authorization:

- evaluate Permission
- evaluate Company scope
- evaluate optional Branch scope

Avoid a generic CRUD or policy scripting engine.

### Audit

Append an audit event for at least:

- User enable/disable
- Role create/update
- UserRole assignment/removal
- RolePermission assignment/removal
- Session revocation where useful
- Administrator bootstrap

Audit fields include actor User where available, optional Company, stable action, entity type/id, occurred timestamp, request/correlation id where available, and safe metadata. Never record passwords, hashes, or raw session tokens.

### Bootstrap administrator

Provide a one-time Bun CLI command driven by environment variables:

- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`
- `BOOTSTRAP_ADMIN_DISPLAY_NAME`
- `BOOTSTRAP_ADMIN_COMPANY_ID`

Requirements:

- no built-in/default production credentials;
- validate Company through the safe Organization boundary;
- refuse unsafe duplicate privileged bootstrap;
- create User, Company-scoped bootstrap Role, baseline grants, assignment, and audit event transactionally;
- never print secrets;
- document removing bootstrap variables after successful use;
- deterministic and testable behavior.

### API

Use Zod at all external boundaries and the existing response/error conventions.

Authentication:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Users:

- `GET /api/v1/users`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id`

Roles and permissions:

- `GET /api/v1/roles`
- `POST /api/v1/roles`
- `PATCH /api/v1/roles/:id`
- `GET /api/v1/permissions`
- explicit RolePermission assignment/removal actions
- explicit Company/optional-Branch UserRole assignment/removal actions

Use stable errors including invalid credentials, expired/revoked session, disabled User, permission denied, missing Role, cross-Company scope, and CSRF rejection. Do not expose password hashes or session secrets.

### Frontend

Implement only the minimum usable IAM UI:

- Login screen
- current User/session loading
- authenticated shell behavior
- Users management
- Roles management
- Permission assignment
- Company/optional Branch role assignment where required for administration

Required states: loading, empty, validation, unauthorized (401), forbidden (403), server error, success, and duplicate-submit prevention. API calls include credentials. Do not store session tokens locally. Do not add profile, MFA, SSO, OAuth, or HR screens.

## Database Requirements

Use PostgreSQL and Drizzle ORM. Create a new migration; do not edit TASK-001 migration history.

Likely tables:

- `users`
- `sessions`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `audit_events`

Add appropriate UUID keys, foreign keys, normalized email uniqueness, Permission key uniqueness, Company-scoped Role uniqueness, duplicate-assignment prevention, Branch/Company consistency, session digest uniqueness, expiration/revocation indexes, and timestamps. Multi-write IAM actions requiring audit records use transactions.

## Security & Scope

- Server-side authentication establishes identity/session context.
- Application authorization policy evaluates Permission plus Company/Branch scope.
- No hard-coded role-name or hidden super-admin bypass.
- No plaintext password, password hash, raw token, or sensitive payload logging.
- Secure cookie behavior depends explicitly on environment.
- Disabled User and revoked/expired session bypasses are prohibited.
- Protect Organization APIs; frontend gates alone never authorize.

## Testing Requirements

Authentication/security tests:

- successful login
- wrong password
- unknown account with indistinguishable failure
- disabled User
- logout and revoked session
- expired session
- secure cookie attributes
- Origin/CSRF rejection
- password hash and raw session token are never returned

Authorization tests:

- absent/invalid session returns 401
- missing Permission returns 403
- permitted action succeeds
- cross-Company scope rejected
- optional Branch scope works and rejects a Branch from another Company
- Organization endpoints are protected server-side
- role names do not grant implicit authority

IAM behavior tests:

- normalized unique email
- Role/Permission persistence and uniqueness
- assignment/removal use cases
- audit events for sensitive changes
- bootstrap safety and idempotency/refusal

PostgreSQL integration tests using `TEST_DATABASE_URL`:

- migration application
- User/Permission/Role unique constraints
- FKs and Company/Branch assignment integrity
- session digest/expiry/revocation persistence
- Permission evaluation data access
- append-oriented audit persistence

Unit tests may use deterministic doubles for application logic. Database behavior must use PostgreSQL; do not substitute SQLite.

## CI Requirements

Reuse the existing PostgreSQL service. CI must:

- install with the frozen Bun lockfile;
- apply migrations once;
- run format, lint, typecheck, unit/API/frontend tests;
- run IAM and Organization PostgreSQL integration tests once without duplicate discovery;
- build API and web;
- use only test credentials and no unnecessary services.

## Non-Goals

Do not implement:

- OAuth, social login, SSO, MFA, passwordless authentication, LDAP, or SCIM
- JWT architecture or localStorage tokens
- generic policy scripting or field-level permission builders
- Inventory, Warehouse, Purchasing, Sales, POS, Pricing, Accounting, Tax, HR/Employee, Attendance, Payroll, Assets, Workflow, or Notifications
- database tables or UI for later modules

## Acceptance Criteria

- [ ] User passwords are Argon2id-hashed before persistence and never exposed.
- [ ] Opaque server sessions use digested persistence and secure HttpOnly cookie transport.
- [ ] Trusted-Origin plus SameSite=Lax CSRF strategy is enforced and documented.
- [ ] Login/logout/current-session behavior works for active, disabled, expired, and revoked states.
- [ ] Roles grant unique Permission keys; authorization never relies on role names.
- [ ] UserRole requires Company scope and supports optional same-Company Branch scope.
- [ ] Baseline current-module Permissions seed deterministically.
- [ ] Administrator bootstrap uses environment-driven one-time CLI with no defaults/secrets output.
- [ ] IAM-sensitive changes append safe audit events.
- [ ] IAM APIs use Zod, stable errors, and never expose secret fields.
- [ ] Organization endpoints enforce server-side read/manage Permission and scope checks.
- [ ] Minimal login, Users, Roles, and Permission assignment UI handles required states.
- [ ] Security, application, API, frontend, and PostgreSQL integration tests pass.
- [ ] PostgreSQL migration/constraints/indexes are reviewable and validated in CI.
- [ ] Format, lint, typecheck, tests, integration tests, and builds pass.
- [ ] No TASK-003 or later-module code/tables were introduced.
- [ ] Branch is committed and pushed successfully; required CI is green.

## Validation

- `bun install`
- inspect `bun run`
- migration generate/check and apply against test PostgreSQL
- format check
- lint
- typecheck
- unit/API/frontend tests
- PostgreSQL integration tests
- API and web builds
- runtime authentication/authorization smoke tests
- security self-review

## Git Delivery

- use `feat/task-002-iam-foundation`
- review status/diff and preserve unrelated changes
- commit coherent TASK-002 documentation/implementation
- push normally to `origin`
- report branch, hashes, messages, push, validation, and CI
- do not merge automatically or start TASK-003

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
- `docs/modules/iam.md`
- `docs/modules/organization.md`
- `docs/tasks/README.md`
- `docs/agent/WORKFLOW.md`
- `docs/agent/DEFINITION_OF_DONE.md`
- `docs/agent/REVIEW_CHECKLIST.md`
