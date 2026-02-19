import { Request, Response, NextFunction } from 'express';
import * as petsService from '../services/pets.service';
import { ApiResponse } from '../types/api.types';
import { Pet } from '../types/pets.types';
import {
  ListPetsQuery,
  GetPetParams,
  CreatePetBody,
  UpdatePetBody,
} from '../schemas/pets.schema';

/**
 * List all pets with optional status filter and pagination.
 * @route GET /api/pets
 * @param req - Express request with optional `status`, `page`, and `limit` query params
 * @returns ApiResponse<Pet[]> with pagination meta
 */
export const listPets = async (
  req: Request,
  res: Response<ApiResponse<Pet[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    // query has been validated and transformed by the validate middleware
    const query = req.query as unknown as ListPetsQuery;
    const { pets, total, page, limit } = petsService.listPets(query);
    res.json({
      data: pets,
      meta: { total, page, limit },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single pet by ID.
 * @route GET /api/pets/:id
 * @param req - Express request with `id` path param
 * @returns ApiResponse<Pet>
 */
export const getPet = async (
  req: Request<GetPetParams>,
  res: Response<ApiResponse<Pet>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = petsService.getPetById(id);
    res.json({ data: pet });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new pet.
 * @route POST /api/pets
 * @param req - Express request with validated pet body
 * @returns ApiResponse<Pet> with 201 status
 */
export const createPet = async (
  req: Request<object, ApiResponse<Pet>, CreatePetBody>,
  res: Response<ApiResponse<Pet>>,
  next: NextFunction
): Promise<void> => {
  try {
    const pet = petsService.createPet(req.body);
    res.status(201).json({ data: pet });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing pet.
 * @route PUT /api/pets/:id
 * @param req - Express request with `id` path param and validated update body
 * @returns ApiResponse<Pet>
 */
export const updatePet = async (
  req: Request<GetPetParams, ApiResponse<Pet>, UpdatePetBody>,
  res: Response<ApiResponse<Pet>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = petsService.updatePet(id, req.body);
    res.json({ data: pet });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a pet by ID.
 * @route DELETE /api/pets/:id
 * @param req - Express request with `id` path param
 * @returns 204 No Content
 */
export const deletePet = async (
  req: Request<GetPetParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    petsService.deletePet(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
