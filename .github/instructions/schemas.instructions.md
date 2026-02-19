---
name: 'Schema Conventions'
description: 'Rules for Zod validation schemas'
applyTo: '**/schemas/**/*.ts'
---

# Schema Rules

- Define one Zod schema file per resource (e.g., `indicators.schema.ts`).
- Export both the schema and the inferred TypeScript type:

```typescript
import { z } from 'zod';

export const GetIndicatorsParamsSchema = z.object({
  country: z.string().min(2).max(60),
});

export type GetIndicatorsParams = z.infer<typeof GetIndicatorsParamsSchema>;
```

- Name schemas with the pattern: `{Verb}{Resource}{Part}Schema` (e.g., `GetIndicatorsParamsSchema`, `CreatePetBodySchema`).
- Name inferred types by dropping the `Schema` suffix.
- Always use `.min()`, `.max()`, or `.regex()` for strings — don't allow unbounded input.
- Use `.default()` for optional query params with sensible defaults (e.g., `page` defaults to 1).
- Add `.describe()` to each field for auto-documentation potential.
