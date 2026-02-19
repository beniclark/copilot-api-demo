import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Creates Express middleware that validates the specified request property
 * against a Zod schema. Returns 400 with Zod error details on failure.
 *
 * @param schema - The Zod schema to validate against
 * @param source - Which part of the request to validate ('body' | 'params' | 'query')
 */
export const validate = (
  schema: ZodSchema,
  source: 'body' | 'params' | 'query' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const zodError = result.error as ZodError;
      res.status(400).json({
        error: 'Validation failed',
        code: 400,
        details: zodError.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    // Replace the raw input with the parsed (and potentially transformed) data
    req[source] = result.data;
    next();
  };
};
