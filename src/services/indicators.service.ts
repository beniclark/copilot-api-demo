import { indicatorsRepository } from '../repositories/indicators.repository';
import { Indicator } from '../types/indicators.types';
import { AppError } from '../middleware/errorHandler';

/**
 * Service layer for economic indicators.
 * Handles business logic and orchestrates calls to the repository layer.
 */
class IndicatorsService {
  /**
   * Retrieves all economic indicators for a given country.
   * Throws an error if no indicators are found.
   *
   * @param country - The country name or ISO code (e.g., "Mexico", "US")
   * @returns Array of indicators for the specified country
   * @throws {AppError} 404 if no indicators are found
   * @throws {AppError} Propagates repository errors (404, 502)
   */
  async getByCountry(country: string): Promise<Indicator[]> {
    const indicators = await indicatorsRepository.getByCountry(country);

    if (!indicators || indicators.length === 0) {
      throw new AppError(`No indicators found for country: ${country}`, 404);
    }

    return indicators;
  }

  /**
   * Retrieves a specific economic indicator for a given country and indicator name.
   * Throws an error if no matching indicator is found.
   *
   * @param country - The country name or ISO code (e.g., "Mexico", "US")
   * @param indicator - The indicator name (e.g., "GDP", "Inflation Rate")
   * @returns Array of matching indicators (typically one)
   * @throws {AppError} 404 if no matching indicator is found
   * @throws {AppError} Propagates repository errors (404, 502)
   */
  async getByCountryAndName(
    country: string,
    indicator: string
  ): Promise<Indicator[]> {
    const indicators = await indicatorsRepository.getByCountryAndName(
      country,
      indicator
    );

    if (!indicators || indicators.length === 0) {
      throw new AppError(
        `Indicator "${indicator}" not found for country: ${country}`,
        404
      );
    }

    return indicators;
  }
}

/**
 * Singleton instance of the indicators service.
 * Import and use this throughout the application.
 */
export const indicatorsService = new IndicatorsService();
