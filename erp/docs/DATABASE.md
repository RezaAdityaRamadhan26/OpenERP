# Database Guidelines

## 1. Database

PostgreSQL is the primary transactional database.

Drizzle ORM is the preferred schema/query layer.

Raw SQL is allowed when it materially improves clarity or capability.

## 2. Naming

Use `snake_case` for:

- tables,
- columns,
- indexes,
- constraints.

Example:

```text
purchase_orders
purchase_order_lines
created_at
company_id
```

## 3. Primary Keys

Prefer UUID-style identifiers.

The implementation may use UUIDv7 if the selected library/runtime support is stable and documented.

Do not expose sequential IDs as a security boundary.

## 4. Standard Columns

Where relevant:

- `id`
- `company_id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

Do not mechanically add every column to every table. Immutable ledgers may not need `updated_at`.

## 5. Time

Use timezone-aware timestamps for actual events.

Use date-only values for business dates that are conceptually dates.

Examples:

- check-in instant -> timestamp with timezone,
- invoice date -> date,
- payroll period start -> date.

## 6. Money

Authoritative monetary values must use `NUMERIC/DECIMAL`.

Never use PostgreSQL floating point or JavaScript `number` for authoritative calculations.

API representation should normally use strings:

```json
{
  "amount": "1250000.50"
}
```

Rounding rules belong to the domain/module.

## 7. Quantities

Inventory quantities may require decimals.

Use an explicit precision suitable for the supported unit types.

Do not assume all inventory is integer-counted.

## 8. Foreign Keys

Use foreign keys for stable relational integrity.

Critical relationships should generally have FK constraints unless a documented architectural reason prevents it.

## 9. Unique Constraints

Use unique constraints for true business/database invariants.

Examples may include:

- SKU uniqueness within a company,
- permission key uniqueness,
- company code uniqueness within tenant.

Do not rely only on application pre-checks for uniqueness.

## 10. Check Constraints

Use check constraints where practical for local invariants.

Examples:

- debit >= 0,
- credit >= 0,
- quantity != 0 for posted stock movement,
- date ranges are valid.

Complex cross-row invariants belong in transactional application/domain logic.

## 11. Ledger Tables

### Accounting

Posted journal entries and lines are immutable.

Corrections use reversal entries.

### Inventory

Posted stock movements are immutable.

Corrections use reversal movements.

Do not rewrite history to "fix" a posted ledger.

## 12. Derived Balances

Balances may be:

- calculated from ledger,
- stored as a projection for performance.

If a projection is used, the ledger remains the audit source of truth.

Projection updates must be transactional with the posting operation.

## 13. Soft Delete

Do not default to soft-delete everywhere.

Use soft deletion only where business requirements require retention plus hiding.

Financial, inventory, approval, and audit records should generally use states/reversal rather than deletion.

## 14. Multi-Company Scope

Every company-owned transaction must have an unambiguous company scope.

Repository queries must avoid accidental cross-company access.

Where appropriate, include company scope in unique indexes.

## 15. Transactions

Use transactions for multi-write operations that represent one business action.

Transaction code must:

- remain short,
- avoid remote calls,
- propagate failure,
- not swallow database errors.

## 16. Isolation & Concurrency

Critical operations such as stock reservation/posting or sequence generation must consider concurrent requests.

Use:

- row locks,
- atomic updates,
- unique constraints,
- transaction isolation,

when justified.

Do not implement concurrency protection with in-memory process locks.

## 17. Migrations

Rules:

1. Every schema change is a migration.
2. Never edit an already-shared historical migration to alter current state.
3. Create a new migration.
4. Migration should be reviewable.
5. Destructive changes require explicit migration notes.
6. Data migrations should be deterministic.

## 18. Indexing

Add indexes based on query patterns.

Common candidates:

- foreign keys,
- company scope,
- dates used in reporting filters,
- document status,
- document number,
- product/warehouse lookups.

Do not blindly index every column.

## 19. Audit Log

Audit logs should be append-oriented.

Recommended fields:

- actor_user_id,
- company_id,
- action,
- entity_type,
- entity_id,
- occurred_at,
- request/correlation id where available,
- metadata.

Avoid storing secrets or full sensitive payloads in audit metadata.

## 20. Database Review Checklist

Before completing a schema task, verify:

- correct ownership/scope,
- appropriate data types,
- money precision,
- FKs,
- unique constraints,
- checks,
- indexes,
- migration safety,
- concurrency implications,
- auditability.
