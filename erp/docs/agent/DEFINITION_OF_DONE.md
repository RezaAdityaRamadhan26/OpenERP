# Definition of Done

A task is complete only when every applicable item below is satisfied.

## Scope

- [ ] The implementation matches the assigned task and acceptance criteria.
- [ ] No unrelated ERP module, infrastructure, or refactor was introduced.
- [ ] Existing unrelated user changes were preserved.

## Quality

- [ ] Relevant format checks pass.
- [ ] Relevant lint checks pass.
- [ ] Relevant typechecks pass.
- [ ] Relevant tests pass.
- [ ] Relevant builds pass.
- [ ] Failed or skipped checks are reported truthfully.

## Architecture and Security

- [ ] The implementation follows `CLAUDE.md` and relevant architecture documentation.
- [ ] External input and environment configuration are validated where applicable.
- [ ] No secret values are committed.
- [ ] No documented business invariant or module boundary is violated.

## Documentation

- [ ] Setup, command, API, or behavior changes are documented where needed.
- [ ] The final report identifies completed work and known limitations.

## Git & Delivery

- [ ] Changes are committed using a meaningful Conventional Commit.
- [ ] The commit contains only task-related changes.
- [ ] The working tree was reviewed before commit.
- [ ] The task branch has been pushed to GitHub.
- [ ] Push completed successfully.
- [ ] The final report includes the branch name.
- [ ] The final report includes the commit hash.
- [ ] The final report includes the commit message.
- [ ] The final report includes the push result.

Detailed Git and GitHub rules are defined in `CLAUDE.md`.
