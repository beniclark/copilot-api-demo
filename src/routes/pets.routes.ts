import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { petController } from '../controllers/pet.controller';
import { validate } from '../middleware/validate';
import {
  CreatePetBodySchema,
  UpdatePetBodySchema,
  GetPetParamsSchema,
  FindPetsByStatusQuerySchema,
} from '../schemas/pet.schema';
import { config } from '../config';

const router = Router();

// Per-route-group rate limiter
const petsLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.', code: 429 },
});
router.use(petsLimiter);

// ── GET /api/pets/findByStatus ──────────────────────────────────
/**
 * Find pets by status.
 * @route GET /api/pets/findByStatus
 * @openapi
 * /pets/findByStatus:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Find pets by status
 *     description: Returns pets filtered by their status (available, pending, or sold).
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [available, pending, sold]
 *           default: available
 *         description: Status value to filter by.
 *     responses:
 *       200:
 *         description: A list of pets matching the status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/findByStatus',
  validate(FindPetsByStatusQuerySchema, 'query'),
  petController.findByStatus
);

// ── POST /api/pets ──────────────────────────────────────────────
/**
 * Add a new pet to the store.
 * @route POST /api/pets
 * @openapi
 * /pets:
 *   post:
 *     tags:
 *       - Pets
 *     summary: Add a new pet
 *     description: Creates a new pet in the Petstore.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePetBody'
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', validate(CreatePetBodySchema, 'body'), petController.create);

// ── PUT /api/pets ───────────────────────────────────────────────
/**
 * Update an existing pet.
 * @route PUT /api/pets
 * @openapi
 * /pets:
 *   put:
 *     tags:
 *       - Pets
 *     summary: Update an existing pet
 *     description: Updates a pet that already exists in the store. The full pet object (including id) must be provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePetBody'
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/', validate(UpdatePetBodySchema, 'body'), petController.update);

// ── GET /api/pets/:petId ────────────────────────────────────────
/**
 * Find a pet by its numeric ID.
 * @route GET /api/pets/:petId
 * @openapi
 * /pets/{petId}:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Find pet by ID
 *     description: Returns a single pet by its numeric ID.
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the pet to return.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PetResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/:petId',
  validate(GetPetParamsSchema, 'params'),
  petController.getById
);

// ── DELETE /api/pets/:petId ─────────────────────────────────────
/**
 * Delete a pet by its numeric ID.
 * @route DELETE /api/pets/:petId
 * @openapi
 * /pets/{petId}:
 *   delete:
 *     tags:
 *       - Pets
 *     summary: Delete a pet
 *     description: Deletes a pet from the store by its numeric ID.
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the pet to delete.
 *     responses:
 *       204:
 *         description: Pet deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  '/:petId',
  validate(GetPetParamsSchema, 'params'),
  petController.remove
);

export { router as petsRouter };
