import { AppError } from '../middleware/errorHandler';
import * as petsRepo from '../repositories/pets.repository';
import { Pet } from '../types/pets.types';
import { CreatePetBody, UpdatePetBody, ListPetsQuery } from '../schemas/pets.schema';

export interface PetListResult {
  pets: Pet[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Returns a paginated list of pets, optionally filtered by status.
 * @param query - Validated query parameters (status, page, limit)
 */
export const listPets = (query: ListPetsQuery): PetListResult => {
  const { status, page, limit } = query;
  const all = petsRepo.findAll(status);
  const start = (page - 1) * limit;
  const pets = all.slice(start, start + limit);

  return { pets, total: all.length, page, limit };
};

/**
 * Retrieves a single pet by ID.
 * @param id - Pet identifier
 * @throws AppError 404 if the pet does not exist
 */
export const getPetById = (id: string): Pet => {
  const pet = petsRepo.findById(id);
  if (!pet) {
    throw new AppError(`Pet with id '${id}' not found`, 404);
  }
  return pet;
};

/**
 * Creates a new pet.
 * @param body - Validated create payload
 * @returns The newly created pet
 */
export const createPet = (body: CreatePetBody): Pet => {
  return petsRepo.create(body);
};

/**
 * Applies a partial update to an existing pet.
 * @param id - Pet identifier
 * @param body - Validated update payload
 * @throws AppError 404 if the pet does not exist
 */
export const updatePet = (id: string, body: UpdatePetBody): Pet => {
  const pet = petsRepo.update(id, body);
  if (!pet) {
    throw new AppError(`Pet with id '${id}' not found`, 404);
  }
  return pet;
};

/**
 * Deletes a pet by ID.
 * @param id - Pet identifier
 * @throws AppError 404 if the pet does not exist
 */
export const deletePet = (id: string): void => {
  const deleted = petsRepo.remove(id);
  if (!deleted) {
    throw new AppError(`Pet with id '${id}' not found`, 404);
  }
};
