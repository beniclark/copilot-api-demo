import { z } from 'zod';

/**
 * Zod schema for validating path parameters when fetching all indicators for a country.
 */
export const GetIndicatorsByCountryParamsSchema = z.object({
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(60, 'Country must not exceed 60 characters')
    .describe('The country name or ISO code (e.g., "Mexico", "US")'),
});

/**
 * Zod schema for validating path parameters when fetching a specific indicator for a country.
 */
export const GetIndicatorByNameParamsSchema = z.object({
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(60, 'Country must not exceed 60 characters')
    .describe('The country name or ISO code (e.g., "Mexico", "US")'),
  indicator: z
    .string()
    .min(2, 'Indicator name must be at least 2 characters')
    .max(100, 'Indicator name must not exceed 100 characters')
    .describe('The indicator name (e.g., "GDP", "Inflation Rate")'),
});

/**
 * Inferred TypeScript type for GetIndicatorsByCountryParams.
 */
export type GetIndicatorsByCountryParams = z.infer<
  typeof GetIndicatorsByCountryParamsSchema
>;

/**
 * Inferred TypeScript type for GetIndicatorByNameParams.
 */
export type GetIndicatorByNameParams = z.infer<
  typeof GetIndicatorByNameParamsSchema
>;
