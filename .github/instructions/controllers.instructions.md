---
name: 'Controller Conventions'
description: 'Rules for API controller files — HTTP concerns only, no business logic'
applyTo: '**/controllers/**/*.ts'
---

# Controller Rules

- Each controller file handles **one resource** (e.g., `indicators.controller.ts` handles `/api/indicators`).
- Each exported function maps to exactly **one HTTP verb + path** combination.
- Controllers must **never** contain business logic — delegate to the corresponding service.
- Controllers must **never** access data sources directly — that's the repository's job.
- Always extract path params, query params, and body using destructuring at the top of each handler.
- Always call the service method, then send the response with the standard `ApiResponse<T>` shape.
- Use `try/catch` and forward errors to `next()` for the centralized error handler.

## JSDoc Format

Every handler must include JSDoc with these tags:

```typescript
/**
 * Get economic indicators for a specific country.
 * @route GET /api/indicators/:country
 * @param req - Express request with `country` path param
 * @returns ApiResponse<Indicator[]>
 */
```

## Example Pattern

```typescript
import { Request, Response, NextFunction } from 'express';
import { indicatorsService } from '../services/indicators.service';
import { ApiResponse } from '../types/api.types';
import { Indicator } from '../types/indicators.types';

/**
 * Get indicators by country.
 * @route GET /api/indicators/:country
 */
export const getByCountry = async (
  req: Request,
  res: Response<ApiResponse<Indicator[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { country } = req.params;
    const data = await indicatorsService.getByCountry(country);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
```
