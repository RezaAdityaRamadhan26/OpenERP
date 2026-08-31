# Claude Code Instructions

## Project Mission

This is an open-source modular ERP template focused on:
- maintainability
- correctness
- lightweight local development
- portfolio quality
- AI-assisted development
- clear domain boundaries

## Mandatory Reading

Before coding, read:

1. docs/PRD.md
2. docs/CONTEXT.md
3. docs/ARCHITECTURE.md
4. docs/DOMAIN_MODEL.md
5. docs/DATABASE.md
6. docs/API.md
7. docs/CODING_RULES.md
8. docs/TESTING.md
9. relevant docs/modules/*.md
10. assigned docs/tasks/*.md
11. docs/agent/WORKFLOW.md
12. docs/agent/DEFINITION_OF_DONE.md

For UI tasks also read:

docs/DESIGN_SYSTEM.md

For authentication, authorization, payroll, accounting, tax,
or other sensitive functionality also read:

docs/SECURITY_ARCHITECTURE.md

## Required Technology Stack

Language:
TypeScript

Runtime:
Bun

Backend:
Hono

Frontend:
React + Vite

Routing:
TanStack Router

Server state:
TanStack Query

Database:
PostgreSQL

ORM:
Drizzle ORM

Validation:
Zod

Architecture:
Modular Monolith

## Mandatory Stack Rules

PostgreSQL is mandatory.

Do NOT replace PostgreSQL with:
- MySQL
- MariaDB
- SQLite
- MongoDB
- another primary database

Do NOT replace:
- Bun
- Hono
- React
- Vite
- Drizzle ORM

unless explicitly requested through a documented architecture decision.

Do NOT introduce:
- microservices
- Kubernetes
- Kafka
- GraphQL
- additional databases
- Redis without a real requirement
- unnecessary infrastructure

## Architecture Rules

Use:

presentation
    ↓
application
    ↓
domain
    ↑
infrastructure

Rules:

- business logic must not live in route handlers
- business logic must not live in React components
- domain code must not depend on Hono
- domain code must not depend on Drizzle
- domain code must not depend on Redis
- modules must not access another module's private repository directly
- preserve modular monolith boundaries

## Database Rules

- PostgreSQL is the source of truth
- every schema change requires a migration
- never rewrite an old committed migration
- money uses NUMERIC / DECIMAL
- authoritative money calculation must not use JavaScript floating point
- use transactions for atomic ERP operations
- enforce company scope
- consider constraints, indexes, and concurrency

## ERP Integrity Rules

Accounting:
- posted journal entries are immutable
- correction uses reversal
- every posted journal must balance

Inventory:
- posted stock movements are immutable
- corrections use reversal movements
- authoritative stock must not exist only in product.stock
- stock must use a ledger or transactional projection

Payroll:
- calculations must be deterministic
- finalized payroll cannot silently change

Authorization:
- authorization is always enforced server-side
- frontend permission checks are UX only
- always consider company, branch, warehouse, and permission scope

## Coding Rules

- TypeScript strict mode
- avoid any
- never use @ts-ignore
- never use @ts-nocheck
- validate external input using Zod
- prefer explicit business names
- do not introduce speculative abstractions
- do not refactor unrelated code

## Task Discipline

For every task:

1. read CLAUDE.md
2. read the task
3. read relevant documentation
4. inspect existing implementation
5. identify affected modules
6. plan the smallest coherent change
7. implement only task scope
8. add/update tests
9. run validation
10. check Definition of Done
11. report what changed

## Validation

Before completion run relevant:

- format
- lint
- typecheck
- tests
- build

Never claim a command passed unless it actually ran.

# Git & GitHub Workflow

The canonical remote repository is:

https://github.com/RezaAdityaRamadhan26/OpenERP

## Delivery Rules

- every completed implementation task, feature, module, bug fix, or meaningful documentation change must be committed
- every completed task must be pushed to GitHub
- completed work must not remain only in the local working tree
- use one dedicated branch per task unless the user explicitly requests another workflow
- do not develop directly on `main` unless explicitly instructed
- do not merge a task branch into `main` automatically
- do not force push
- do not rewrite public history
- do not delete remote branches unless explicitly instructed
- do not discard unknown local changes

Before modifying files:

1. run `git status`
2. inspect the current branch
3. inspect uncommitted changes
4. preserve unrelated user changes
5. synchronize safely when appropriate

Do not use destructive commands such as:

- `git reset --hard`
- `git clean -fd`
- `git push --force`

unless explicitly instructed by the user.

## Branch Strategy

Use these branch conventions:

- feature task: `feat/task-XXX-short-name`
- bug fix: `fix/task-XXX-short-name`
- refactor: `refactor/task-XXX-short-name`
- documentation: `docs/task-XXX-short-name`

Examples:

- `feat/task-000-project-foundation`
- `feat/task-001-organization`
- `feat/task-002-iam-foundation`
- `feat/task-003-inventory-core`
- `fix/inventory-negative-stock`

A task should use one dedicated branch unless the user explicitly requests another workflow.

Do not merge the branch into `main` automatically.

## Commit Rules

Use Conventional Commits with a meaningful message.

Examples:

- `feat: initialize OpenERP project foundation`
- `feat(organization): add company and branch management`
- `feat(iam): implement role-based access control`
- `feat(inventory): implement stock movement ledger`
- `feat(accounting): implement double-entry journal posting`
- `fix(accounting): prevent posting unbalanced journals`
- `test(payroll): add payroll regression tests`
- `docs: update architecture documentation`

Do not use meaningless commit messages such as:

- `update`
- `changes`
- `done`
- `fix stuff`
- `work`

A commit should represent one coherent change. Do not create a separate commit for every file.

Before committing implementation code, run all relevant existing checks:

- format
- lint
- typecheck
- tests
- build

Do not claim a check passed if it was not executed. If a check fails, fix the task-related issue before committing whenever possible. Do not knowingly commit broken code unless explicitly instructed to create a WIP commit.

## Push Requirement

A task is not fully delivered until its branch has been pushed successfully to `origin`.

Typical first push:

```bash
git push -u origin <branch-name>
```

Later pushes:

```bash
git push
```

If push fails:

1. do not hide the failure
2. preserve local work
3. inspect the reason
4. do not force push automatically
5. report the issue clearly

If remote changes exist, use a safe synchronization strategy only after inspecting the current working tree.

The final task report must include:

- branch name
- commit hash
- commit message
- push result

## First Project Task

If no application code exists yet, start with:

docs/TASK-000-project-foundation.md

Do not automatically implement later ERP modules.
