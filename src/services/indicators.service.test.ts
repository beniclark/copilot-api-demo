import { describe, it, expect, vi, beforeEach } from 'vitest';
import { indicatorsService } from './indicators.service';
import { indicatorsRepository } from '../repositories/indicators.repository';
import { TradingEconomicsIndicator } from '../types/indicators.types';
import { AppError } from '../middleware/errorHandler';

vi.mock('../repositories/indicators.repository');

const mockRawIndicator: TradingEconomicsIndicator = {
  Country: 'Mexico',
  Category: 'GDP',
  Title: 'Mexico GDP',
  LatestValueDate: '2022-12-31T00:00:00',
  LatestValue: 1414.19,
  Source: 'World Bank',
  SourceURL: 'https://www.worldbank.org/',
  Unit: 'USD Billion',
  URL: '/mexico/gdp',
  CategoryGroup: 'GDP',
  Adjustment: 'Current USD',
  Frequency: 'Yearly',
  HistoricalDataSymbol: 'WGDPMEXI',
  CreateDate: '2014-07-03T15:32:00',
  FirstValueDate: '1960-12-31T00:00:00',
  PreviousValue: 1272.84,
  PreviousValueDate: '2021-12-31T00:00:00',
};

describe('indicatorsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    indicatorsService.clearCache();
  });

  describe('getByCountry', () => {
    it('returns indicators for a valid country', async () => {
      vi.mocked(indicatorsRepository.fetchByCountry).mockResolvedValue([mockRawIndicator]);

      const result = await indicatorsService.getByCountry('mexico');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        country: 'Mexico',
        category: 'GDP',
        title: 'Mexico GDP',
        latestValueDate: '2022-12-31T00:00:00',
        latestValue: 1414.19,
        source: 'World Bank',
        sourceUrl: 'https://www.worldbank.org/',
        unit: 'USD Billion',
        url: '/mexico/gdp',
        categoryGroup: 'GDP',
        adjustment: 'Current USD',
        frequency: 'Yearly',
        historicalDataSymbol: 'WGDPMEXI',
        createDate: '2014-07-03T15:32:00',
        firstValueDate: '1960-12-31T00:00:00',
        previousValue: 1272.84,
        previousValueDate: '2021-12-31T00:00:00',
      });
    });

    it('returns cached data on second call', async () => {
      vi.mocked(indicatorsRepository.fetchByCountry).mockResolvedValue([mockRawIndicator]);

      await indicatorsService.getByCountry('sweden');
      await indicatorsService.getByCountry('sweden');

      expect(indicatorsRepository.fetchByCountry).toHaveBeenCalledTimes(1);
    });

    it('passes group parameter to repository', async () => {
      vi.mocked(indicatorsRepository.fetchByCountry).mockResolvedValue([mockRawIndicator]);

      await indicatorsService.getByCountry('mexico', 'gdp');

      expect(indicatorsRepository.fetchByCountry).toHaveBeenCalledWith('mexico', 'gdp');
    });

    it('throws 404 when upstream returns empty array', async () => {
      vi.mocked(indicatorsRepository.fetchByCountry).mockResolvedValue([]);

      await expect(indicatorsService.getByCountry('nowhere')).rejects.toThrow(AppError);
      await expect(indicatorsService.getByCountry('nowhere')).rejects.toThrow(
        /No indicators found/
      );
    });

    it('propagates upstream errors as AppError', async () => {
      vi.mocked(indicatorsRepository.fetchByCountry).mockRejectedValue(
        new AppError('Unable to retrieve indicator data', 502)
      );

      await expect(indicatorsService.getByCountry('errorland')).rejects.toThrow(AppError);
    });
  });

  describe('getByCountryAndIndicator', () => {
    it('returns a specific indicator for a country', async () => {
      vi.mocked(indicatorsRepository.fetchByCountryAndIndicator).mockResolvedValue([
        mockRawIndicator,
      ]);

      const result = await indicatorsService.getByCountryAndIndicator('mexico', 'gdp');

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('GDP');
    });

    it('throws 404 when upstream returns empty array', async () => {
      vi.mocked(indicatorsRepository.fetchByCountryAndIndicator).mockResolvedValue([]);

      await expect(
        indicatorsService.getByCountryAndIndicator('nowhere', 'gdp')
      ).rejects.toThrow(/No indicators found/);
    });
  });
});
