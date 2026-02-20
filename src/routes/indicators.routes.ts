import { Router } from 'express';
import * as indicatorsController from '../controllers/indicators.controller';
import { validate } from '../middleware/validate';
import {
  GetIndicatorsByCountryParamsSchema,
  GetIndicatorsByCountryQuerySchema,
  GetIndicatorByCountryAndIndicatorParamsSchema,
} from '../schemas/indicators.schema';

const router = Router();

/**
 * Get all economic indicators for a country.
 * @route GET /api/indicators/:country
 * @openapi
 * /indicators/{country}:
 *   get:
 *     tags:
 *       - Indicators
 *     summary: Get indicators by country
 *     description: Returns all economic indicators for the specified country, optionally filtered by category group. Results are cached for 5 minutes.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 60
 *         description: Country name (e.g. "mexico")
 *       - in: query
 *         name: group
 *         required: false
 *         schema:
 *           type: string
 *           enum: [health, markets, taxes, gdp, housing, trade, climate, labour, overview, prices, government, consumer, business, money]
 *         description: Category group filter
 *     responses:
 *       200:
 *         description: List of indicators
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndicatorsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: No indicators found for the given country
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
  '/:country',
  validate(GetIndicatorsByCountryParamsSchema, 'params'),
  validate(GetIndicatorsByCountryQuerySchema, 'query'),
  indicatorsController.getByCountry
);

/**
 * Get a specific indicator for a country.
 * @route GET /api/indicators/:country/:indicator
 * @openapi
 * /indicators/{country}/{indicator}:
 *   get:
 *     tags:
 *       - Indicators
 *     summary: Get a specific indicator by country
 *     description: Returns a specific economic indicator (e.g. GDP, inflation) for the specified country. Results are cached for 5 minutes.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 60
 *         description: Country name (e.g. "mexico")
 *       - in: path
 *         name: indicator
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         description: Indicator name (e.g. "gdp", "inflation-rate")
 *     responses:
 *       200:
 *         description: Indicator data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndicatorsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Indicator not found for the given country
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
  '/:country/:indicator',
  validate(GetIndicatorByCountryAndIndicatorParamsSchema, 'params'),
  indicatorsController.getByCountryAndIndicator
);

export { router as indicatorsRouter };
