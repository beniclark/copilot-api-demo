---
name: 'Service Layer Conventions'
description: 'Rules for service files — business logic and orchestration'
applyTo: '**/services/**/*.ts'
---

# Service Rules

- Each service file handles business logic for **one resource**.
- Services call repositories for data access — they never make HTTP or DB calls directly.
- Services are responsible for:
  - Data transformation and mapping
  - Business validation (beyond schema validation)
  - Caching decisions (check cache before calling repository)
  - Combining data from multiple repositories if needed
- Export services as singleton objects, not classes, unless state management requires it.
- Every public method must have a JSDoc comment describing what it does and what it returns.
