# Design System

## 1. UX Direction

The ERP UI should be:

- professional,
- restrained,
- information-dense,
- readable,
- predictable,
- keyboard-friendly where practical.

Avoid marketing-site aesthetics inside operational screens.

## 2. Application Shell

Desktop-first shell:

```text
+---------------------------------------------------+
| Sidebar | Header                                  |
|         +-----------------------------------------+
|         | Page title              Primary action |
|         | Description / context                   |
|         +-----------------------------------------+
|         | Filters / toolbar                       |
|         +-----------------------------------------+
|         | Main content                            |
+---------------------------------------------------+
```

## 3. Page Anatomy

Standard page should consider:

1. breadcrumb when useful,
2. title,
3. short contextual description,
4. primary action,
5. filters/search,
6. content,
7. pagination,
8. loading/empty/error state.

## 4. Tables

ERP tables are a core interaction.

Required considerations:

- column labels,
- alignment,
- sorting where useful,
- filters,
- pagination,
- row actions,
- bulk selection only when a real bulk action exists,
- responsive overflow rather than silently hiding critical data.

Money should align consistently.

Dates should use a consistent display format.

## 5. Forms

Forms should:

- group related fields,
- clearly mark required fields,
- show validation near the field,
- preserve user input after recoverable errors,
- disable duplicate submission,
- explain destructive/irreversible actions.

## 6. Buttons

Use semantic roles:

- primary — main page action,
- secondary — alternate action,
- destructive — delete/cancel/reverse when destructive,
- ghost — low emphasis.

Avoid multiple equally prominent primary actions.

## 7. Dialogs and Drawers

Use dialogs for:

- confirmation,
- focused small edits,
- destructive actions.

Use drawers/sheets for contextual workflows only when they improve continuity.

Complex multi-section documents should usually get a full page.

## 8. Feedback States

Every asynchronous screen should consider:

- initial loading,
- background refresh,
- empty data,
- validation error,
- authorization error,
- server error,
- success feedback.

## 9. Status

Use shared semantic status presentation.

Examples:

- draft,
- pending approval,
- approved,
- posted,
- rejected,
- cancelled,
- paid,
- overdue.

Do not create different visual conventions per module for the same lifecycle meaning.

## 10. Accessibility

At minimum:

- visible focus state,
- keyboard navigability,
- form labels,
- correct button semantics,
- meaningful error messages,
- sufficient contrast,
- no information conveyed by color alone.

## 11. Responsive Behavior

Primary target:

- desktop/laptop operational use.

Tablet/mobile:

- core viewing should remain usable,
- complex data tables may use horizontal scrolling,
- do not destroy information hierarchy simply to fit mobile.

## 12. Shared Components

Reuse shared components when they already solve the problem.

Candidates after real reuse emerges:

- `DataTable`
- `PageHeader`
- `MoneyInput`
- `DatePicker`
- `StatusBadge`
- `EmptyState`
- `ConfirmDialog`
- `PermissionGate` for UX only
- `FormField`

Do not create a universal abstraction before real use cases exist.

## 13. Design Tokens

Use semantic tokens rather than hard-coded page-specific visual values.

Examples:

- background
- foreground
- muted
- border
- primary
- destructive
- success
- warning

The concrete palette may be chosen during implementation, but semantic usage must stay consistent.

## 14. ERP-Specific Rules

- IDs/document numbers should be easily copyable.
- Important amounts should be scannable.
- Posted/finalized state should be visually obvious.
- Destructive correction actions should explain consequences.
- Approval history should be easy to inspect.
- Audit/history links should be discoverable for critical documents.
