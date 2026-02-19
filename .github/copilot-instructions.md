# Copilot Instructions — copilot-api-demo

## Project Overview

This is a Node.js REST API built with **Express.js and TypeScript**. It demonstrates
best practices for API development, including integration with the Trading Economics
external API and a local Petstore-style resource.

## Technology Stack

- **Runtime:** Node.js 22+
- **Language:** TypeScript (strict mode)
- **Framework:** Express.js
- **Validation:** Zod schemas for all request/response bodies
- **Date handling:** `date-fns` (never use `moment.js` — it is deprecated and bloats the bundle)
- **Caching:** `node-cache` for in-memory caching of external API responses
- **Testing:** Vitest
- **Linting:** ESLint with `@typescript-eslint`

## Architecture

Follow a **three-layer architecture** for every resource:

1. **Controller** (`src/controllers/`) — Handles HTTP concerns only (parsing params, calling service, sending response). No business logic here.
2. **Service** (`src/services/`) — Contains business logic, orchestrates data access, applies transformations.
3. **Repository** (`src/repositories/`) — Handles all data access (database calls, external API calls). No other layer should make data calls directly.

## API Response Format

All successful responses must follow this shape:

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

All error responses must follow this shape:

```typescript
interface ApiError {
  error: string;
  code: number;
  details?: unknown;
}
```

## Validation Rules

- Every endpoint that accepts a request body **must** define a Zod schema in `src/schemas/`.
- Every endpoint that accepts query parameters **must** validate them with Zod.
- Parse with `schema.safeParse()` and return a 400 with the Zod error details on failure.

## Middleware Requirements

- **Rate limiting:** Every route group must use `express-rate-limit`. Default: 100 requests per 15 minutes.
- **Error handling:** Use the centralized error handler in `src/middleware/errorHandler.ts`. Never send raw error objects to the client.
- **Request logging:** Log method, path, status code, and duration for every request.

## Coding Conventions

- Use `camelCase` for variables and functions, `PascalCase` for types/interfaces/classes.
- Prefer `const` over `let`. Never use `var`.
- Use named exports, not default exports.
- Every public function must have a JSDoc comment.
- Prefer `async/await` over raw Promises or callbacks.
- Use `unknown` instead of `any` — narrow the type explicitly.

## File Naming

- Controllers: `{resource}.controller.ts`
- Services: `{resource}.service.ts`
- Repositories: `{resource}.repository.ts`
- Schemas: `{resource}.schema.ts`
- Types: `{resource}.types.ts`
- Tests: `{resource}.test.ts` (colocated next to the source file)

## External API Integration

When integrating an external API:
1. Create a dedicated repository file for each external service.
2. Centralize the base URL and API key in `src/config/`.
3. Always cache responses with a sensible TTL (default: 5 minutes for economic data).
4. Handle rate limits and retries gracefully — never let an external API error crash the server.
