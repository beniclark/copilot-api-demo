import { Request, Response, NextFunction } from 'express';
import { petService } from '../services/pet.service';
import { ApiResponse } from '../types/api.types';
import { Pet, PetStatus } from '../types/pet.types';

/**
 * Find pets by status.
 * @route GET /api/pets/findByStatus
 * @param req - Express request with `status` query param
 * @returns ApiResponse<Pet[]>
 */
export const findByStatus = async (
  req: Request,
  res: Response<ApiResponse<Pet[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query as { status: PetStatus };
    const data = await petService.getByStatus(status);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a pet by its numeric ID.
 * @route GET /api/pets/:petId
 * @param req - Express request with `petId` path param
 * @returns ApiResponse<Pet>
 */
export const getById = async (
  req: Request,
  res: Response<ApiResponse<Pet>>,
  next: NextFunction
): Promise<void> => {
  try {
    const petId = Number(req.params.petId);
    const data = await petService.getById(petId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new pet to the store.
 * @route POST /api/pets
 * @param req - Express request with pet body
 * @returns ApiResponse<Pet>
 */
export const create = async (
  req: Request,
  res: Response<ApiResponse<Pet>>,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await petService.create(req.body);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing pet.
 * @route PUT /api/pets
 * @param req - Express request with full pet body (including id)
 * @returns ApiResponse<Pet>
 */
export const update = async (
  req: Request,
  res: Response<ApiResponse<Pet>>,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await petService.update(req.body);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a pet by its numeric ID.
 * @route DELETE /api/pets/:petId
 * @param req - Express request with `petId` path param
 * @returns 204 No Content
 */
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const petId = Number(req.params.petId);
    await petService.remove(petId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const petController = {
  findByStatus,
  getById,
  create,
  update,
  remove,
};
