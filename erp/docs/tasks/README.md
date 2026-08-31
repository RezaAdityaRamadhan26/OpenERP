# Task Specifications

Task files define one scoped, reviewable unit of work. Detailed repository, validation, Git, and GitHub rules remain authoritative in `CLAUDE.md`.

## Task Template

```markdown
# TASK-XXX — Short Name

## Status

Ready

## Context

Explain why this task exists and the current state it changes.

## Objective

State the smallest coherent outcome.

## Requirements

List required behavior and technical constraints.

## Non-Goals

List adjacent work that must not be implemented.

## Acceptance Criteria

- [ ] Add measurable completion criteria.

## Testing Requirements

List meaningful tests required for this task.

## Validation

List relevant existing checks to execute.

## Git Delivery

- use a dedicated task branch
- commit completed work
- push the branch to `origin`
- report commit hash and push result

## References

Link `CLAUDE.md` and relevant project documentation.
```

## Git Delivery

Every task must include the concise Git Delivery section above. Follow the detailed branch, commit, validation, push, and reporting rules in `CLAUDE.md`; do not duplicate those rules in individual task files.
