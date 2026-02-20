import NodeCache from 'node-cache';
import { config } from '../config';
import { Indicator } from '../types/indicators.types';
import { AppError } from '../middleware/errorHandler';

/**
 * In-memory cache for Trading Economics API responses.
 * TTL is configured in config.cacheTtl (default: 5 minutes).
 */
const cache = new NodeCache({ stdTTL: config.cacheTtl });

/**
 * Repository for accessing economic indicators from Trading Economics API.
 * Handles all data access, caching, and error handling for the external API.
 */
class IndicatorsRepository {
  private readonly baseUrl = config.tradingEconomics.baseUrl;
  private readonly apiKey = config.tradingEconomics.apiKey;

  /**
   * Fetches all economic indicators for a given country.
   * Results are cached to reduce external API calls.
   *
   * @param country - The country name or ISO code (e.g., "Mexico", "US")
   * @returns Array of indicators for the specified country
   * @throws {AppError} 404 if country is not found
   * @throws {AppError} 502 if upstream API fails
   */
  async getByCountry(country: string): Promise<Indicator[]> {
    const cacheKey = `indicators:${country.toLowerCase()}`;

    // Check cache first
    const cached = cache.get<Indicator[]>(cacheKey);
    if (cached !== undefined) {
      console.log(`[Cache HIT] ${cacheKey}`);
      return cached;
    }

    console.log(`[Cache MISS] ${cacheKey} — fetching from Trading Economics`);

    const url = `${this.baseUrl}/indicators/${encodeURIComponent(country)}?c=${this.apiKey}`;

    try {
      const response = await fetch(url);

      if (response.status === 404) {
        throw new AppError(
          `Indicators not found for country: ${country}`,
          404
        );
      }

      if (!response.ok) {
        throw new AppError(
          `Failed to fetch indicators from Trading Economics (status ${response.status})`,
          502
        );
      }

      const data = (await response.json()) as Indicator[];

      // Cache the successful response
      cache.set(cacheKey, data);

      return data;
    } catch (error) {
      // Re-throw AppErrors as-is
      if (error instanceof AppError) {
        throw error;
      }

      // Wrap network/fetch errors
      console.error('[IndicatorsRepository] Fetch error:', error);
      throw new AppError('Failed to fetch indicators', 502);
    }
  }

  /**
   * Fetches a specific economic indicator for a given country and indicator name.
   * Results are cached to reduce external API calls.
   *
   * @param country - The country name or ISO code (e.g., "Mexico", "US")
   * @param indicator - The indicator name (e.g., "GDP", "Inflation Rate")
   * @returns Array of matching indicators (typically one)
   * @throws {AppError} 404 if country/indicator combination is not found
   * @throws {AppError} 502 if upstream API fails
   */
  async getByCountryAndName(
    country: string,
    indicator: string
  ): Promise<Indicator[]> {
    const cacheKey = `indicators:${country.toLowerCase()}:${indicator.toLowerCase()}`;

    // Check cache first
    const cached = cache.get<Indicator[]>(cacheKey);
    if (cached !== undefined) {
      console.log(`[Cache HIT] ${cacheKey}`);
      return cached;
    }

    console.log(`[Cache MISS] ${cacheKey} — fetching from Trading Economics`);

    const url = `${this.baseUrl}/indicators/${encodeURIComponent(country)}/${encodeURIComponent(indicator)}?c=${this.apiKey}`;

    try {
      const response = await fetch(url);

      if (response.status === 404) {
        throw new AppError(
          `Indicator "${indicator}" not found for country: ${country}`,
          404
        );
      }

      if (!response.ok) {
        throw new AppError(
          `Failed to fetch indicator from Trading Economics (status ${response.status})`,
          502
        );
      }

      const data = (await response.json()) as Indicator[];

      // Cache the successful response
      cache.set(cacheKey, data);

      return data;
    } catch (error) {
      // Re-throw AppErrors as-is
      if (error instanceof AppError) {
        throw error;
      }

      // Wrap network/fetch errors
      console.error('[IndicatorsRepository] Fetch error:', error);
      throw new AppError('Failed to fetch indicator', 502);
    }
  }
}

/**
 * Singleton instance of the indicators repository.
 * Import and use this throughout the application.
 */
export const indicatorsRepository = new IndicatorsRepository();
