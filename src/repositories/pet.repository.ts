import { Pet, CreatePetBody, UpdatePetBody, PetStatus } from '../types/pet.types';

const BASE_URL = 'https://petstore.swagger.io/v2';

/**
 * Fetch helper that calls the Petstore API and returns typed JSON.
 * Throws on non-2xx responses with a generic client-safe message.
 */
const fetchPetstore = async <T>(url: string, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    console.error('Petstore API network error:', err);
    throw new Error('Unable to reach the Petstore API');
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.error(`Petstore API error ${response.status}: ${text}`);
    throw new Error('Unable to complete the Petstore API request');
  }

  return response.json() as Promise<T>;
};

/**
 * Find pets by their status.
 * @param status - Pet status to filter by (available, pending, sold)
 * @returns Array of matching pets
 */
export const findByStatus = async (status: PetStatus): Promise<Pet[]> => {
  const url = `${BASE_URL}/pet/findByStatus?status=${encodeURIComponent(status)}`;
  return fetchPetstore<Pet[]>(url);
};

/**
 * Get a single pet by its ID.
 * @param petId - Numeric ID of the pet
 * @returns The pet object
 */
export const getById = async (petId: number): Promise<Pet> => {
  const url = `${BASE_URL}/pet/${encodeURIComponent(petId)}`;
  return fetchPetstore<Pet>(url);
};

/**
 * Add a new pet to the store.
 * @param body - Pet data (name, photoUrls, etc.)
 * @returns The newly created pet (with server-assigned ID)
 */
export const addPet = async (body: CreatePetBody): Promise<Pet> => {
  const url = `${BASE_URL}/pet`;
  return fetchPetstore<Pet>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

/**
 * Update an existing pet.
 * @param body - Complete pet object including its ID
 * @returns The updated pet
 */
export const updatePet = async (body: UpdatePetBody): Promise<Pet> => {
  const url = `${BASE_URL}/pet`;
  return fetchPetstore<Pet>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

/**
 * Delete a pet by its ID.
 * @param petId - Numeric ID of the pet to delete
 */
export const deletePet = async (petId: number): Promise<void> => {
  const url = `${BASE_URL}/pet/${encodeURIComponent(petId)}`;
  let response: Response;
  try {
    response = await fetch(url, { method: 'DELETE' });
  } catch (err) {
    console.error('Petstore API network error:', err);
    throw new Error('Unable to reach the Petstore API');
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.error(`Petstore API error ${response.status}: ${text}`);
    throw new Error('Unable to complete the Petstore API request');
  }
};

export const petRepository = {
  findByStatus,
  getById,
  addPet,
  updatePet,
  deletePet,
};
