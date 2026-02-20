import NodeCache from 'node-cache';
import { config } from '../config';
import { petRepository } from '../repositories/pet.repository';
import { Pet, PetStatus, CreatePetBody, UpdatePetBody } from '../types/pet.types';
import { AppError } from '../middleware/errorHandler';

const cache = new NodeCache({ stdTTL: config.cacheTtl });

/**
 * Get pets by status, with caching.
 * @param status - Pet status to filter by
 * @returns Array of matching pets
 */
const getByStatus = async (status: PetStatus): Promise<Pet[]> => {
  const cacheKey = `pet-status:${status}`;
  const cached = cache.get<Pet[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const pets = await petRepository.findByStatus(status);
  cache.set(cacheKey, pets);
  return pets;
};

/**
 * Get a single pet by its numeric ID, with caching.
 * Throws a 404 AppError if the upstream API returns a non-2xx response.
 * @param petId - The pet's ID
 * @returns The pet object
 */
const getById = async (petId: number): Promise<Pet> => {
  const cacheKey = `pet:${petId}`;
  const cached = cache.get<Pet>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const pet = await petRepository.getById(petId);
    cache.set(cacheKey, pet);
    return pet;
  } catch {
    throw new AppError(`Pet with ID ${petId} not found`, 404);
  }
};

/**
 * Add a new pet to the store. Invalidates the status cache for the new pet's status.
 * @param body - Create pet payload
 * @returns The created pet with a server-assigned ID
 */
const create = async (body: CreatePetBody): Promise<Pet> => {
  const pet = await petRepository.addPet(body);
  // Invalidate list caches so the new pet appears
  if (body.status) {
    cache.del(`pet-status:${body.status}`);
  }
  return pet;
};

/**
 * Update an existing pet. Invalidates related caches.
 * @param body - Full pet object including its ID
 * @returns The updated pet
 */
const update = async (body: UpdatePetBody): Promise<Pet> => {
  const pet = await petRepository.updatePet(body);
  cache.del(`pet:${body.id}`);
  if (body.status) {
    cache.del(`pet-status:${body.status}`);
  }
  return pet;
};

/**
 * Delete a pet by ID. Invalidates its cache entry.
 * @param petId - The pet's numeric ID
 */
const remove = async (petId: number): Promise<void> => {
  await petRepository.deletePet(petId);
  cache.del(`pet:${petId}`);
};

/**
 * Flush all cached pet data. Useful for test isolation.
 */
const clearCache = (): void => {
  cache.flushAll();
};

export const petService = {
  getByStatus,
  getById,
  create,
  update,
  remove,
  clearCache,
};
