import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { TradingEconomicsIndicator } from '../types/indicators.types';

const { baseUrl, apiKey } = config.tradingEconomics;

/**
 * Fetches raw indicator data from the Trading Economics API.
 * This is the only layer that makes HTTP calls to the external service.
 */
export const indicatorsRepository = {
  /**
   * Fetch all indicators for a country, optionally filtered by category group.
   * @param country - Country name (e.g. "mexico")
   * @param group - Optional category group filter (e.g. "gdp")
   * @returns Raw indicator array from Trading Economics
   */
  async fetchByCountry(
    country: string,
    group?: string
  ): Promise<TradingEconomicsIndicator[]> {
    const url = new URL(`${baseUrl}/country/${encodeURIComponent(country)}`);
    url.searchParams.set('c', apiKey);
    if (group) {
      url.searchParams.set('group', group);
    }

    return fetchIndicators(url);
  },

  /**
   * Fetch a specific indicator for a country.
   * @param country - Country name (e.g. "mexico")
   * @param indicator - Indicator name (e.g. "gdp")
   * @returns Raw indicator array from Trading Economics
   */
  async fetchByCountryAndIndicator(
    country: string,
    indicator: string
  ): Promise<TradingEconomicsIndicator[]> {
    const url = new URL(
      `${baseUrl}/country/${encodeURIComponent(country)}/${encodeURIComponent(indicator)}`
    );
    url.searchParams.set('c', apiKey);

    return fetchIndicators(url);
  },
};

/**
 * Shared fetch helper that handles HTTP errors and network failures.
 */
async function fetchIndicators(url: URL): Promise<TradingEconomicsIndicator[]> {
  let response: Response;

  try {
    response = await fetch(url.toString());
  } catch (error: unknown) {
    throw new AppError(
      `Failed to fetch indicators: ${error instanceof Error ? error.message : 'Network error'}`,
      500
    );
  }

  if (!response.ok) {
    throw new AppError(
      `Upstream API error: ${response.status} ${response.statusText}`,
      502
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new AppError('Unexpected response format from Trading Economics API', 502);
  }

  return data as TradingEconomicsIndicator[];
}
