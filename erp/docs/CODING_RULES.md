# Coding Rules

## Code-Level Error Guidance

- typed domain/application errors
- do not swallow exceptions
- unexpected errors use centralized handling
- expected database conflicts should be translated when appropriate

## Logging Rules

- do not log secrets
- structured request/error logging
- request/correlation IDs
- audit log is different from application log
