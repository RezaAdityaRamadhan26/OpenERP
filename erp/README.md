# Open ERP

A lightweight, modular ERP foundation built as a portfolio-quality open-source project.

## Overview

Open ERP is a TypeScript modular monolith designed for maintainability, correctness, and simple local development. The project starts with a minimal foundation and will add ERP modules incrementally according to the [roadmap](docs/ROADMAP.md).

## Current Status

**Milestone 0 — Foundation**

Included:

- Bun monorepo workspace
- React + Vite web application
- TanStack Router and TanStack Query
- Hono API server
- PostgreSQL + Drizzle ORM setup
- Typed environment validation with Zod
- Health-check endpoint and frontend status display
- Biome linting/formatting, TypeScript checking, Bun tests
- GitHub Actions CI

ERP business modules are not implemented yet.

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Runtime / package manager:** Bun
- **Frontend:** React, Vite, TanStack Router, TanStack Query, Tailwind CSS
- **Backend:** Hono
- **Validation:** Zod
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Testing:** Bun test
- **Linting / formatting:** Biome
- **Architecture:** Modular Monolith

## Requirements

- [Bun](https://bun.sh/) 1.1 or newer
- PostgreSQL 15 or newer
- A modern browser

Redis and Docker are not required for the foundation.

## Local Development

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

Copy the example file:

```bash
cp .env.example .env
```

Update `DATABASE_URL` for your local PostgreSQL instance.

### 3. Create the database

```sql
CREATE DATABASE open_erp;
```

### 4. Generate and run migrations

```bash
bun run db:generate
bun run db:migrate
```

### 5. Start the applications

Start both web and API:

```bash
bun run dev
```

Or start them separately:

```bash
bun run dev:api
bun run dev:web
```

- Web: <http://localhost:5173>
- API: <http://localhost:3001>
- Health endpoint: <http://localhost:3001/api/v1/health>

The Vite development server proxies `/api` requests to the API server.

## Available Commands

| Command | Description |
| --- | --- |
| `bun run dev` | Start all development applications |
| `bun run dev:api` | Start API only |
| `bun run dev:web` | Start web only |
| `bun run build` | Build all applications |
| `bun run typecheck` | Run TypeScript checks |
| `bun run lint` | Run Biome linting |
| `bun run lint:fix` | Fix lint issues |
| `bun run format` | Format the repository |
| `bun run format:check` | Check formatting |
| `bun run test` | Run all tests |
| `bun run check` | Run format, lint, typecheck, and tests |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply database migrations |
| `bun run db:studio` | Open Drizzle Studio |

## Project Structure

```text
apps/
  api/          Hono API server
  web/          React + Vite application
packages/
  config/       Typed environment configuration
  db/           PostgreSQL/Drizzle connection and migrations
  shared/       Shared API contracts
modules/        ERP business modules (added in later milestones)
docs/           Product, architecture, and development documentation
```

## Documentation

- [Product Requirements](docs/PRD.md)
- [Project Context](docs/CONTEXT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database Guidelines](docs/DATABASE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [TASK-000 — Project Foundation](docs/TASK-000-project-foundation.md)

## Architecture

The project uses a modular monolith. Business modules follow this dependency direction when introduced:

```text
presentation
    ↓
application
    ↓
domain
    ↑
infrastructure
```

Foundation packages remain small. Business modules will be created only when their roadmap milestone begins.

## Contributing

Read [CLAUDE.md](CLAUDE.md) and the relevant documentation before making changes. Every task must remain within scope, include appropriate tests, and pass all validation commands.

## License

License selection is pending.
