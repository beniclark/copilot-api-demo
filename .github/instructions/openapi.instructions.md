---
applyTo: "src/routes/**/*.ts,src/controllers/**/*.ts"
---

# OpenAPI 3.0 Instructions

Every time a new endpoint is added or modified, the OpenAPI documentation **must** be updated in the same commit/PR. This project uses `swagger-jsdoc` to generate the spec automatically from `@openapi` JSDoc blocks placed directly in route and controller files.

## Required: Add an `@openapi` block for every endpoint

Place an `@openapi` JSDoc comment immediately above the route handler or controller method. The YAML path must be relative to the `/api` prefix (i.e. match what is registered in the Express router).

### Template

```typescript
/**
 * Short description of what the endpoint does.
 * @route METHOD /api/{resource}/{path}
 * @openapi
 * /{resource}/{path}:
 *   {method}:
 *     tags:
 *       - ResourceName
 *     summary: One-line summary (shown in Swagger UI list)
 *     description: Longer description of what this endpoint does. Optional.
 *     parameters:         # omit section if no parameters
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The resource ID.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *     requestBody:        # omit section for GET/DELETE
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResourceBody'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', resourceController.getById);
```

## Shared components

Reusable schemas are defined in `src/config/openapi.ts` under `components.schemas`. Reuse them with `$ref` rather than inlining the same shape in every endpoint.

Always reference these shared error responses — do **not** inline them:

| Ref | When to use |
|-----|------------|
| `#/components/responses/BadRequest` | Zod validation failed (400) |
| `#/components/responses/TooManyRequests` | Rate limit exceeded (429) |
| `#/components/responses/InternalServerError` | Unexpected error (500) |

## Adding a new response schema

If your endpoint returns a new shape that is not already a `$ref`, add the schema to `src/config/openapi.ts` under `components.schemas` and reference it by name. Keep the schema in sync with the corresponding Zod schema in `src/schemas/`.

```typescript
// src/config/openapi.ts — components.schemas
Pet: {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id:   { type: 'integer', example: 1 },
    name: { type: 'string',  example: 'Fido' },
    tag:  { type: 'string',  example: 'dog' },
  },
},
```

## Tag conventions

Use a single `PascalCase` tag per resource group. This maps to a section in the Swagger UI. Examples:

| Resource | Tag |
|----------|-----|
| Health / system | `System` |
| Economic indicators | `Indicators` |
| Pets | `Pets` |

## Verifying the spec

After adding or editing endpoints run the dev server and open `http://localhost:3000/api/docs` to confirm the new operation appears correctly in Swagger UI. The raw JSON spec is always available at `http://localhost:3000/api/docs.json`.

## Checklist for every new endpoint

- [ ] `@openapi` JSDoc block added directly above the route/controller handler
- [ ] All path, query, and body parameters documented
- [ ] All possible response codes covered (at minimum `200`, `400`, `429`, `500`)
- [ ] New response body shape added to `src/config/openapi.ts` components if not already present
- [ ] New tag added to the tag convention table above if it is a new resource
