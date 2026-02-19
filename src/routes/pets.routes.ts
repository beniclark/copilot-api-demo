import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate';
import {
  ListPetsQuerySchema,
  GetPetParamsSchema,
  CreatePetBodySchema,
  UpdatePetBodySchema,
} from '../schemas/pets.schema';
import {
  listPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
} from '../controllers/pets.controller';

const petsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', code: 429 },
});

const router = Router();

router.use(petsLimiter);

/** GET /api/pets */
router.get('/', validate(ListPetsQuerySchema, 'query'), listPets);

/** GET /api/pets/:id */
router.get('/:id', validate(GetPetParamsSchema, 'params'), getPet);

/** POST /api/pets */
router.post('/', validate(CreatePetBodySchema, 'body'), createPet);

/** PUT /api/pets/:id */
router.put(
  '/:id',
  validate(GetPetParamsSchema, 'params'),
  validate(UpdatePetBodySchema, 'body'),
  updatePet
);

/** DELETE /api/pets/:id */
router.delete('/:id', validate(GetPetParamsSchema, 'params'), deletePet);

export { router as petsRouter };
