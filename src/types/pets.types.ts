/** Type definitions for the Petstore resource. */

/** Available status values for a pet listing. */
export type PetStatus = 'available' | 'pending' | 'sold';

/** A pet as stored and returned by the API. */
export interface Pet {
  id: string;
  name: string;
  species: string;
  age: number;
  status: PetStatus;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a new pet. */
export interface CreatePetBody {
  name: string;
  species: string;
  age: number;
  status?: PetStatus;
}

/** Payload for updating an existing pet. All fields are optional. */
export interface UpdatePetBody {
  name?: string;
  species?: string;
  age?: number;
  status?: PetStatus;
}
