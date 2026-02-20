/** Types for the Petstore /pet resource. Derived from the Petstore OpenAPI spec. */

/**
 * Pet category (e.g. "Dogs", "Cats").
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * Pet tag for grouping and filtering.
 */
export interface Tag {
  id: number;
  name: string;
}

/**
 * Status of a pet in the store.
 */
export type PetStatus = 'available' | 'pending' | 'sold';

/**
 * Pet entity as returned by the Petstore API and used internally.
 */
export interface Pet {
  id: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  status?: PetStatus;
}

/**
 * Payload for creating a new pet (id is optional — assigned by the server).
 */
export interface CreatePetBody {
  name: string;
  photoUrls: string[];
  category?: Category;
  tags?: Tag[];
  status?: PetStatus;
}

/**
 * Payload for updating an existing pet (id is required).
 */
export interface UpdatePetBody {
  id: number;
  name: string;
  photoUrls: string[];
  category?: Category;
  tags?: Tag[];
  status?: PetStatus;
}
