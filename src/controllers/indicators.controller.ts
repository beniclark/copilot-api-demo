import { Request, Response, NextFunction } from 'express';
import { indicatorsService } from '../services/indicators.service';
import { ApiResponse } from '../types/api.types';
import { Indicator } from '../types/indicators.types';
import {
  GetIndicatorsByCountryParams,
  GetIndicatorByNameParams,
} from '../schemas/indicators.schema';

/**
 * Fetches all economic indicators for a given country.
 * @route GET /api/indicators/:country
 * @openapi
 * /indicators/{country}:
 *   get:
 *     tags:
 *       - Indicators
 *     summary: Get all indicators for a country
 *     description: Retrieves all economic indicators available for the specified country from Trading Economics. Results are cached for 5 minutes.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 60
 *           example: Mexico
 *         description: The country name or ISO code (e.g., "Mexico", "US")
 *     responses:
 *       200:
 *         description: Successfully retrieved indicators
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndicatorResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Country not found or no indicators available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               error: 'Indicators not found for country: InvalidCountry'
 *               code: 404
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *       502:
 *         description: Upstream Trading Economics API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               error: 'Failed to fetch indicators'
 *               code: 502
 */
export const getByCountry = async (
  req: Request<GetIndicatorsByCountryParams>,
  res: Response<ApiResponse<Indicator[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { country } = req.params;
    const indicators = await indicatorsService.getByCountry(country);

    res.json({
      data: indicators,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetches a specific economic indicator for a given country and indicator name.
 * @route GET /api/indicators/:country/:indicator
 * @openapi
 * /indicators/{country}/{indicator}:
 *   get:
 *     tags:
 *       - Indicators
 *     summary: Get a specific indicator for a country
 *     description: Retrieves a specific economic indicator for the specified country from Trading Economics. Results are cached for 5 minutes.
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 60
 *           example: Mexico
 *         description: The country name or ISO code (e.g., "Mexico", "US")
 *       - in: path
 *         name: indicator
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: GDP
 *         description: The indicator name (e.g., "GDP", "Inflation Rate")
 *     responses:
 *       200:
 *         description: Successfully retrieved indicator
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndicatorResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Indicator not found for the specified country
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               error: 'Indicator "InvalidIndicator" not found for country: Mexico'
 *               code: 404
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *       502:
 *         description: Upstream Trading Economics API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               error: 'Failed to fetch indicator'
 *               code: 502
 */
export const getByCountryAndName = async (
  req: Request<GetIndicatorByNameParams>,
  res: Response<ApiResponse<Indicator[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { country, indicator } = req.params;
    const indicators = await indicatorsService.getByCountryAndName(
      country,
      indicator
    );

    res.json({
      data: indicators,
    });
  } catch (error) {
    next(error);
  }
};
