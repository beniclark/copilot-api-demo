import { randomUUID } from 'crypto';
import { Pet, CreatePetBody, UpdatePetBody } from '../types/pets.types';

/** In-memory store seeded with sample pets. */
const store = new Map<string, Pet>();

const seedPets: Pet[] = [
  {
    id: randomUUID(),
    name: 'Buddy',
    species: 'Dog',
    age: 3,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Whiskers',
    species: 'Cat',
    age: 5,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    name: 'Nemo',
    species: 'Fish',
    age: 1,
    status: 'sold',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
seedPets.forEach((p) => store.set(p.id, p));

/**
 * Returns all pets, optionally filtered by status.
 * @param status - Optional status filter
 */
export const findAll = (status?: string): Pet[] => {
  const all = Array.from(store.values());
  return status ? all.filter((p) => p.status === status) : all;
};

/**
 * Finds a single pet by its ID.
 * @param id - Pet identifier
 * @returns The pet, or undefined if not found
 */
export const findById = (id: string): Pet | undefined => store.get(id);

/**
 * Creates a new pet and persists it in the store.
 * @param body - Validated create payload
 * @returns The newly created pet
 */
export const create = (body: CreatePetBody): Pet => {
  const now = new Date().toISOString();
  const pet: Pet = {
    id: randomUUID(),
    name: body.name,
    species: body.species,
    age: body.age,
    status: body.status ?? 'available',
    createdAt: now,
    updatedAt: now,
  };
  store.set(pet.id, pet);
  return pet;
};

/**
 * Applies a partial update to an existing pet.
 * @param id - Pet identifier
 * @param body - Validated update payload
 * @returns The updated pet, or undefined if not found
 */
export const update = (id: string, body: UpdatePetBody): Pet | undefined => {
  const existing = store.get(id);
  if (!existing) return undefined;

  const updated: Pet = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  store.set(id, updated);
  return updated;
};

/**
 * Removes a pet from the store.
 * @param id - Pet identifier
 * @returns true if the pet existed and was removed, false otherwise
 */
export const remove = (id: string): boolean => store.delete(id);
