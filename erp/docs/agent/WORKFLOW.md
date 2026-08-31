# Agent Workflow

Follow this workflow for every repository task.

## Prepare

1. read `CLAUDE.md`
2. read the assigned task and relevant documentation
3. run `git status`
4. inspect the current branch and uncommitted changes
5. preserve unrelated user changes
6. create or use the dedicated task branch defined by `CLAUDE.md`
7. synchronize safely when appropriate

## Inspect

1. inspect the existing implementation before editing
2. identify affected modules and public boundaries
3. find existing patterns to reuse
4. select the smallest coherent change

## Implement

1. implement only the task scope
2. follow the required architecture and technology stack
3. avoid speculative abstractions and unrelated refactors
4. add or update meaningful tests
5. update documentation when setup, commands, APIs, or behavior change

## Validate and Self-Review

1. run all relevant existing checks: format, lint, typecheck, tests, and build
2. fix task-related failures whenever possible
3. review the acceptance criteria and `docs/agent/DEFINITION_OF_DONE.md`
4. review the final diff for scope, correctness, security, and accidental changes
5. report failed or skipped checks truthfully

## Commit

1. run `git status`
2. inspect `git diff`
3. verify only task-related changes are included
4. create a meaningful Conventional Commit

Do not knowingly commit broken code unless the user explicitly requests a WIP commit.

## Push

Push the current task branch to `origin` according to the Git workflow in `CLAUDE.md`.

The task is not considered delivered until push succeeds.

Do not force push, rewrite public history, merge into `main`, or delete remote branches unless explicitly instructed.

## Report

Include:

- implementation summary
- files created and modified
- dependencies or migrations added, when applicable
- validation commands and results
- known limitations or incomplete items
- branch name
- commit hash
- commit message
- push result

Stop after completing the assigned task. Do not continue to the next task automatically.
