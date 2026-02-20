import { Request, Response, NextFunction } from 'express';
import { indicatorsService } from '../services/indicators.service';
import { ApiResponse } from '../types/api.types';
import { Indicator } from '../types/indicators.types';

/**
 * Get economic indicators by country.
 * @route GET /api/indicators/:country
 * @param req - Express request with `country` path param and optional `group` query param
 * @returns ApiResponse<Indicator[]>
 */
export const getByCountry = async (
  req: Request,
  res: Response<ApiResponse<Indicator[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { country } = req.params;
    const group = req.query.group as string | undefined;
    const data = await indicatorsService.getByCountry(country, group);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific economic indicator for a country.
 * @route GET /api/indicators/:country/:indicator
 * @param req - Express request with `country` and `indicator` path params
 * @returns ApiResponse<Indicator[]>
 */
export const getByCountryAndIndicator = async (
  req: Request,
  res: Response<ApiResponse<Indicator[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { country, indicator } = req.params;
    const data = await indicatorsService.getByCountryAndIndicator(
      country,
      indicator
    );
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
