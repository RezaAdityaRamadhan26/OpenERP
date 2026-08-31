# Project Context

## Why This Project Exists

This repository is intentionally both a software project and a learning artifact.

It should demonstrate that AI-assisted development can still produce:

- coherent architecture,
- explicit domain rules,
- reviewable commits,
- tests,
- documentation,
- sensible scope control.

The project is not an experiment in generating the maximum amount of code.

## Portfolio Goal

A reviewer should be able to see evidence of:

- product thinking,
- domain modeling,
- modular architecture,
- database design,
- security thinking,
- testing discipline,
- frontend consistency,
- open-source maintainability,
- AI development governance.

## Local-First Constraint

The developer experience should remain light.

Initial local dependencies:

- Bun,
- PostgreSQL.

Optional when required:

- Redis.

Avoid infrastructure that exists only to imitate large enterprises.

## Technology Decisions

### Bun

Chosen to provide:

- TypeScript-friendly runtime,
- package management,
- test support,
- fast local tooling,
- a compact developer toolchain.

### Hono

Chosen because:

- lightweight,
- TypeScript-first,
- explicit routing/middleware,
- compatible with Bun,
- does not force a heavy architectural framework.

Because Hono is intentionally small, architecture discipline is provided by repository rules rather than framework ceremony.

### React + Vite

Chosen because the ERP is primarily an authenticated, interactive application rather than an SEO-first content website.

### PostgreSQL

Chosen because ERP data is relational and transaction-heavy.

Important workloads include:

- joins,
- constraints,
- transactions,
- aggregation,
- accounting,
- ledger-based inventory,
- reporting.

### Drizzle ORM

Chosen to retain TypeScript type safety while staying close to SQL.

Raw SQL is allowed when it is clearer or more capable, but it must remain parameterized, tested, and documented where non-obvious.

## Architecture Philosophy

Start with a modular monolith.

The design should make module boundaries real without introducing distributed-system complexity.

A module should be separable conceptually before it is ever separable operationally.

## AI Development Philosophy

Humans define:

- product intent,
- architecture,
- invariants,
- constraints,
- review standards.

Coding agents may perform:

- implementation,
- test generation,
- documentation updates,
- refactoring within task scope,
- code review assistance.

Agents should not invent major architecture changes merely to finish a local task.

## Deliberate Simplicity

The project intentionally avoids premature use of:

- microservices,
- Kubernetes,
- Kafka,
- Elasticsearch,
- CQRS everywhere,
- event sourcing everywhere,
- distributed caches,
- multiple databases.

A capability may be introduced later when a real requirement justifies it.

## Quality Bar

"Works on my machine" is insufficient for critical ERP logic.

Critical domains require:

- explicit invariants,
- deterministic tests,
- transactions,
- auditability,
- authorization,
- correction/reversal paths.
