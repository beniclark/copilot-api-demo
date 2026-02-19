---
name: 'Test Conventions'
description: 'Rules for Vitest test files'
applyTo: '**/*.test.ts'
---

# Test Rules

- Use **Vitest** (`describe`, `it`, `expect`) — never use Jest globals.
- Colocate test files next to their source: `indicators.service.ts` → `indicators.service.test.ts`.
- Structure tests with `describe` blocks per function, `it` blocks per scenario.
- Test the happy path first, then error cases, then edge cases.
- Mock external dependencies (repositories, HTTP calls) — never hit real APIs in tests.
- Use descriptive test names: `it('returns cached data when cache is warm')` not `it('works')`.
- Aim for at least one test per public function covering: valid input, invalid input, error propagation.
