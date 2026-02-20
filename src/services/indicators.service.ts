import NodeCache from 'node-cache';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { indicatorsRepository } from '../repositories/indicators.repository';
import {
  Indicator,
  TradingEconomicsIndicator,
} from '../types/indicators.types';

const cache = new NodeCache({ stdTTL: config.cacheTtl });

/**
 * Maps a raw Trading Economics indicator (PascalCase) to our internal shape (camelCase).
 * Handles null/undefined date fields defensively by defaulting to empty string.
 */
function mapIndicator(raw: TradingEconomicsIndicator): Indicator {
  return {
    country: raw.Country,
    category: raw.Category,
    title: raw.Title,
    latestValueDate: raw.LatestValueDate ?? '',
    latestValue: raw.LatestValue,
    source: raw.Source,
    sourceUrl: raw.SourceURL,
    unit: raw.Unit,
    url: raw.URL,
    categoryGroup: raw.CategoryGroup,
    adjustment: raw.Adjustment,
    frequency: raw.Frequency,
    historicalDataSymbol: raw.HistoricalDataSymbol,
    createDate: raw.CreateDate ?? '',
    firstValueDate: raw.FirstValueDate ?? '',
    previousValue: raw.PreviousValue,
    previousValueDate: raw.PreviousValueDate ?? '',
  };
}

/**
 * Indicators service - business logic and caching for economic indicator data.
 */
export const indicatorsService = {
  /**
   * Get all economic indicators for a country, optionally filtered by category group.
   * Results are cached for the configured TTL (default 5 minutes).
   * @param country - Country name (e.g. "mexico")
   * @param group - Optional category group filter (e.g. "gdp")
   * @returns Array of normalized indicators
   */
  async getByCountry(country: string, group?: string): Promise<Indicator[]> {
    const cacheKey = group
      ? `country:${country}:group:${group}`
      : `country:${country}`;

    const cached = cache.get<Indicator[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const raw = await indicatorsRepository.fetchByCountry(country, group);

    if (raw.length === 0) {
      throw new AppError(`No indicators found for country '${country}'`, 404);
    }

    const indicators = raw.map(mapIndicator);
    cache.set(cacheKey, indicators);
    return indicators;
  },

  /**
   * Get a specific economic indicator for a country.
   * Results are cached for the configured TTL (default 5 minutes).
   * @param country - Country name (e.g. "mexico")
   * @param indicator - Indicator name (e.g. "gdp")
   * @returns Array of normalized indicators
   */
  async getByCountryAndIndicator(
    country: string,
    indicator: string
  ): Promise<Indicator[]> {
    const cacheKey = `country-indicator:${country}:${indicator}`;

    const cached = cache.get<Indicator[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const raw = await indicatorsRepository.fetchByCountryAndIndicator(
      country,
      indicator
    );

    if (raw.length === 0) {
      throw new AppError(
        `No indicators found for country '${country}' and indicator '${indicator}'`,
        404
      );
    }

    const indicators = raw.map(mapIndicator);
    cache.set(cacheKey, indicators);
    return indicators;
  },

  /**
   * Flush the in-memory indicator cache.
   * Primarily used in tests to ensure isolation between test cases.
   */
  clearCache(): void {
    cache.flushAll();
  },
};
