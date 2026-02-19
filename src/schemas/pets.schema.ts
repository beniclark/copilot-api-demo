import { z } from 'zod';

const petStatusValues = ['available', 'pending', 'sold'] as const;

/** Schema for validating GET /pets query parameters. */
export const ListPetsQuerySchema = z.object({
  status: z
    .enum(petStatusValues)
    .optional()
    .describe('Filter pets by status'),
  page: z
    .string()
    .regex(/^\d+$/, 'Must be a positive integer')
    .transform(Number)
    .default('1')
    .describe('Page number (1-based)'),
  limit: z
    .string()
    .regex(/^\d+$/, 'Must be a positive integer')
    .transform(Number)
    .default('20')
    .describe('Number of results per page (max 100)'),
});

export type ListPetsQuery = z.infer<typeof ListPetsQuerySchema>;

/** Schema for validating GET /pets/:id path parameters. */
export const GetPetParamsSchema = z.object({
  id: z.string().min(1).max(36).describe('Pet identifier'),
});

export type GetPetParams = z.infer<typeof GetPetParamsSchema>;

/** Schema for validating POST /pets request body. */
export const CreatePetBodySchema = z.object({
  name: z.string().min(1).max(100).describe('Display name of the pet'),
  species: z.string().min(1).max(60).describe('Species of the pet (e.g. "Dog", "Cat")'),
  age: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Age of the pet in years'),
  status: z
    .enum(petStatusValues)
    .default('available')
    .describe('Availability status'),
});

export type CreatePetBody = z.infer<typeof CreatePetBodySchema>;

/** Schema for validating PUT /pets/:id request body. */
export const UpdatePetBodySchema = z
  .object({
    name: z.string().min(1).max(100).optional().describe('Display name of the pet'),
    species: z.string().min(1).max(60).optional().describe('Species of the pet'),
    age: z.number().int().min(0).max(100).optional().describe('Age in years'),
    status: z.enum(petStatusValues).optional().describe('Availability status'),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdatePetBody = z.infer<typeof UpdatePetBodySchema>;

/** Schema for validating DELETE /pets/:id path parameters (reuses GetPetParams). */
export const DeletePetParamsSchema = GetPetParamsSchema;
export type DeletePetParams = GetPetParams;
