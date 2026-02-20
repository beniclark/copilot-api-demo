import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { validate } from '../middleware/validate';
import {
  GetIndicatorsByCountryParamsSchema,
  GetIndicatorByNameParamsSchema,
} from '../schemas/indicators.schema';
import * as indicatorsController from '../controllers/indicators.controller';

/**
 * Rate limiter for indicators endpoints.
 * Limit: 100 requests per 15 minutes per IP.
 */
const indicatorsRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Too many requests, please try again later.',
    code: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

// Apply rate limiting to all indicators routes
router.use(indicatorsRateLimiter);

/**
 * GET /api/indicators/:country
 * Fetch all economic indicators for a country.
 */
router.get(
  '/:country',
  validate(GetIndicatorsByCountryParamsSchema, 'params'),
  indicatorsController.getByCountry
);

/**
 * GET /api/indicators/:country/:indicator
 * Fetch a specific indicator for a country.
 */
router.get(
  '/:country/:indicator',
  validate(GetIndicatorByNameParamsSchema, 'params'),
  indicatorsController.getByCountryAndName
);

export { router as indicatorsRouter };
