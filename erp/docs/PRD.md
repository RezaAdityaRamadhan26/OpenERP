# Product Requirements Document

## 1. Product Overview

This project is an open-source, modular ERP template intended to serve as:

- a serious portfolio project,
- an educational reference,
- a reusable starter for internal business systems,
- a demonstration of disciplined AI-assisted development.

The system should provide a coherent foundation for common company operations without attempting to replicate every feature of large commercial ERP suites.

## 2. Product Vision

Create an ERP codebase that is easy to run locally, understandable by contributors, extensible by module, and strict enough to preserve critical business invariants.

The product should feel like a real business system rather than a collection of unrelated CRUD screens.

## 3. Target Users

Primary users:

- small and medium businesses,
- developers learning ERP architecture,
- open-source contributors,
- portfolio reviewers,
- teams needing an ERP starter.

Operational personas:

- owner / director,
- system administrator,
- finance staff,
- accountant,
- cashier,
- warehouse staff,
- purchasing staff,
- HR staff,
- payroll staff,
- manager / approver,
- employee.

## 4. Product Principles

1. Correctness before premature optimization.
2. Modular monolith before microservices.
3. PostgreSQL as source of truth.
4. Explicit business rules over implicit conventions.
5. Auditability for critical transactions.
6. Least-privilege access.
7. Configuration where companies legitimately differ.
8. Simple local development.
9. Reusable UI and API conventions.
10. AI-assisted implementation with human-readable architecture.

## 5. In-Scope Domains

### Platform

- Organization
- Identity & Access Management
- Workflow & Approval
- Audit Trail
- Notifications

### Operations

- Inventory
- Warehouse
- Procurement & Purchasing
- Sales
- POS
- Pricing & Promotions

### Finance

- Accounting
- Accounts Receivable / Payable
- Payments
- Tax
- Cost centers

### People

- HR
- Attendance
- Shift scheduling
- Payroll

### Assets

- Asset registry
- assignment
- depreciation
- maintenance
- disposal

## 6. Initial Non-Goals

The first major versions do not require:

- manufacturing/MRP,
- full CRM automation,
- project management,
- advanced fleet management,
- Kubernetes,
- microservices,
- Kafka,
- distributed SQL,
- multi-region active-active deployment,
- native mobile apps.

These may become future extensions.

## 7. Multi-Company Requirements

The architecture must be capable of representing:

`Tenant -> Company -> Branch -> Department / Warehouse / Employees`

At minimum:

- records that belong to a company must be company-scoped,
- access must not leak across companies,
- branch scope must be supported where business operations require it,
- accounting periods and ledgers must be company-specific,
- document numbering may vary by company/branch.

## 8. Core Functional Requirements

### Organization

The system must support:

- companies,
- branches,
- departments,
- cost centers,
- company settings,
- branch-specific operational context.

### IAM

The system must support:

- users,
- authentication,
- roles,
- permissions,
- scoped permissions,
- user status,
- audit of security-sensitive actions.

### Inventory

The system must support:

- products/items,
- variants where needed,
- units of measure,
- warehouses,
- stock movements,
- stock transfer,
- stock adjustment,
- stock opname,
- batch/lot/serial extension points.

### Purchasing

The system should support:

- suppliers,
- purchase requests,
- approval,
- purchase orders,
- pre-orders/backorders where applicable,
- goods receipts,
- supplier bills integration,
- purchase returns as a future extension point.

### Sales / POS

The system should support:

- customers,
- sales orders,
- POS transactions,
- payment methods,
- discounts/promotions,
- receipts,
- stock deduction,
- accounting posting hooks.

POS should be designed so offline capability can be added without redesigning the entire transaction model.

### Accounting

The system must support:

- chart of accounts,
- journal entries,
- journal lines,
- fiscal periods,
- receivables,
- payables,
- payments,
- posting from operational modules,
- reversal,
- balanced double-entry accounting.

### Tax

The tax architecture must:

- separate tax configuration from invoice logic,
- support multiple tax types/rates,
- support effective dates,
- record calculated tax details,
- avoid hard-coding jurisdiction rules throughout the application.

### HR

The system should support:

- employee records,
- employment status,
- department/position assignment,
- leave extension points,
- employee documents metadata.

### Attendance & Shift

The system should support:

- raw attendance events,
- normalized attendance records,
- shifts,
- schedules,
- late/early/overtime calculations,
- holiday calendars.

### Payroll

The system should support:

- payroll periods,
- salary structures,
- earnings,
- deductions,
- attendance inputs,
- formula/rule calculation,
- payroll runs,
- payslip data,
- accounting posting hooks.

### Assets

The system should support:

- asset categories,
- asset registry,
- assignment,
- location,
- depreciation schedules,
- maintenance history,
- disposal.

### Workflow & Approval

The system should support configurable approval definitions containing:

- target document type,
- conditions,
- ordered steps,
- approver resolution,
- decisions,
- rejection,
- cancellation,
- audit history.

### Notifications

The system should support:

- in-app notifications,
- provider abstraction for email and other channels,
- asynchronous dispatch where needed,
- templates,
- delivery status where practical.

## 9. Auditability Requirements

Critical actions should be attributable to:

- user,
- timestamp,
- entity,
- action,
- relevant before/after state or transaction reference.

At minimum, audit-critical areas include:

- authentication and permission changes,
- approvals,
- financial posting,
- inventory posting,
- payroll finalization,
- asset disposal,
- sensitive configuration changes.

## 10. UX Requirements

The UI should:

- prioritize desktop workflows,
- remain usable on common laptop screens,
- provide consistent table/filter/form patterns,
- expose useful empty and error states,
- support keyboard-friendly operations for repetitive business workflows where practical,
- avoid decorative complexity that reduces information clarity.

## 11. Performance Requirements

For the portfolio/open-source baseline:

- common list pages should use pagination,
- expensive reports should avoid blocking request threads,
- N+1 query patterns should be prevented,
- database indexes should support real access patterns,
- local startup should remain simple.

No artificial large-scale benchmark target is required until real usage justifies one.

## 12. Security Requirements

- server-side authorization for every protected use case,
- tenant/company isolation,
- secure password/session handling,
- CSRF strategy appropriate to chosen auth mechanism,
- XSS-resistant rendering practices,
- parameterized SQL,
- validation at every external boundary,
- secret management through environment configuration,
- no secrets committed to Git.

## 13. MVP Definition

A credible MVP contains:

1. project foundation,
2. organization,
3. IAM,
4. inventory,
5. purchasing,
6. sales/POS,
7. accounting core,
8. workflow approval,
9. HR/attendance/payroll baseline,
10. asset registry,
11. tax configuration,
12. notification baseline.

MVP does not mean every advanced edge case is complete.

## 14. Success Criteria

The project is successful when:

- a contributor can run it locally from documented steps,
- modules have clear boundaries,
- core business rules are tested,
- a demo company can complete representative procure-to-pay and order-to-cash flows,
- accounting postings are traceable,
- role/permission boundaries are demonstrable,
- the repository is understandable without private knowledge,
- coding agents can execute scoped tasks by reading repository documentation.
