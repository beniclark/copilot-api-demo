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
- **API Documentation:** `swagger-jsdoc` (spec generation from JSDoc) + `swagger-ui-express` (Swagger UI at `/api/docs`)
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

## OpenAPI 3.0 Documentation

This project uses **OpenAPI 3.0** to document every endpoint.

- The spec is generated automatically by `swagger-jsdoc` from `@openapi` JSDoc blocks in route and controller files.
- Swagger UI is served at `GET /api/docs`; the raw JSON spec is at `GET /api/docs.json`.
- Shared schemas and reusable error responses live in `src/config/openapi.ts`.

**Every new or modified endpoint MUST include an `@openapi` JSDoc block.** See `.github/instructions/openapi.instructions.md` for the full template and checklist.

### File naming
- OpenAPI config / shared components: `src/config/openapi.ts`

### Endpoint documentation checklist
1. Add `@openapi` block above the route or controller handler with tags, summary, all parameters, request body (if any), and all response codes.
2. Add any new response body shape to `src/config/openapi.ts` under `components.schemas`.
3. Always reference the shared error responses (`$ref: '#/components/responses/BadRequest'`, `TooManyRequests`, `InternalServerError`) — never inline them.
4. Verify the new operation appears in Swagger UI at `http://localhost:3000/api/docs` before considering the work done.

## External API Integration

When integrating an external API:
1. Create a dedicated repository file for each external service.
2. Centralize the base URL and API key in `src/config/`.
3. Always cache responses with a sensible TTL (default: 5 minutes for economic data).
4. Handle rate limits and retries gracefully — never let an external API error crash the server.
