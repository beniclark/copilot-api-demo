import { z } from 'zod';

/** Path params for GET /api/indicators/:country */
export const GetIndicatorsByCountryParamsSchema = z.object({
  country: z.string().min(2).max(60).describe('Country name (e.g. "mexico")'),
});

export type GetIndicatorsByCountryParams = z.infer<typeof GetIndicatorsByCountryParamsSchema>;

/** Query params for GET /api/indicators/:country */
export const GetIndicatorsByCountryQuerySchema = z.object({
  group: z
    .enum([
      'health',
      'markets',
      'taxes',
      'gdp',
      'housing',
      'trade',
      'climate',
      'labour',
      'overview',
      'prices',
      'government',
      'consumer',
      'business',
      'money',
    ])
    .optional()
    .describe('Category group filter'),
});

export type GetIndicatorsByCountryQuery = z.infer<typeof GetIndicatorsByCountryQuerySchema>;

/** Path params for GET /api/indicators/:country/:indicator */
export const GetIndicatorByCountryAndIndicatorParamsSchema = z.object({
  country: z.string().min(2).max(60).describe('Country name (e.g. "mexico")'),
  indicator: z.string().min(2).max(100).describe('Indicator name (e.g. "gdp")'),
});

export type GetIndicatorByCountryAndIndicatorParams = z.infer<
  typeof GetIndicatorByCountryAndIndicatorParamsSchema
>;
