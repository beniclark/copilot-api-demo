import { z } from 'zod';

// ── Shared sub-schemas ──────────────────────────────────────────

const CategorySchema = z.object({
  id: z.number().int().describe('Category ID'),
  name: z.string().min(1).max(100).describe('Category name'),
});

const TagSchema = z.object({
  id: z.number().int().describe('Tag ID'),
  name: z.string().min(1).max(100).describe('Tag name'),
});

const PetStatusSchema = z
  .enum(['available', 'pending', 'sold'])
  .describe('Pet status in the store');

// ── Request schemas ─────────────────────────────────────────────

/**
 * Schema for creating a new pet.
 */
export const CreatePetBodySchema = z.object({
  name: z.string().min(1).max(200).describe('Name of the pet'),
  photoUrls: z
    .array(z.string().url().max(2048))
    .min(1)
    .describe('List of photo URLs'),
  category: CategorySchema.optional().describe('Pet category'),
  tags: z.array(TagSchema).optional().describe('Pet tags'),
  status: PetStatusSchema.optional(),
});

export type CreatePetBody = z.infer<typeof CreatePetBodySchema>;

/**
 * Schema for updating an existing pet (id required).
 */
export const UpdatePetBodySchema = z.object({
  id: z.number().int().positive().describe('Pet ID'),
  name: z.string().min(1).max(200).describe('Name of the pet'),
  photoUrls: z
    .array(z.string().url().max(2048))
    .min(1)
    .describe('List of photo URLs'),
  category: CategorySchema.optional().describe('Pet category'),
  tags: z.array(TagSchema).optional().describe('Pet tags'),
  status: PetStatusSchema.optional(),
});

export type UpdatePetBody = z.infer<typeof UpdatePetBodySchema>;

/**
 * Schema for the `petId` path parameter.
 */
export const GetPetParamsSchema = z.object({
  petId: z
    .string()
    .regex(/^\d+$/, 'petId must be a positive integer')
    .transform(Number)
    .describe('ID of the pet'),
});

export type GetPetParams = z.infer<typeof GetPetParamsSchema>;

/**
 * Schema for the findByStatus query parameter.
 */
export const FindPetsByStatusQuerySchema = z.object({
  status: PetStatusSchema.default('available'),
});

export type FindPetsByStatusQuery = z.infer<typeof FindPetsByStatusQuerySchema>;
