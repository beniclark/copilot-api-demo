import { describe, it, expect, vi, beforeEach } from 'vitest';
import { indicatorsService } from './indicators.service';
import { indicatorsRepository } from '../repositories/indicators.repository';
import { AppError } from '../middleware/errorHandler';
import { Indicator } from '../types/indicators.types';

// Mock the repository module
vi.mock('../repositories/indicators.repository', () => ({
  indicatorsRepository: {
    getByCountry: vi.fn(),
    getByCountryAndName: vi.fn(),
  },
}));

describe('IndicatorsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getByCountry', () => {
    it('should return indicators when repository returns data', async () => {
      const mockIndicators: Indicator[] = [
        {
          Country: 'Mexico',
          Category: 'GDP',
          Title: 'GDP Annual Growth Rate',
          LatestValue: 3.2,
          LatestValueDate: '2023-12-31T00:00:00',
          Source: 'World Bank',
          Unit: 'Percent',
          URL: 'https://tradingeconomics.com/mexico/gdp-growth-annual',
          CategoryGroup: 'GDP',
          Frequency: 'yearly',
          HistoricalDataSymbol: 'MEXGDPYOY',
          CreateDate: '2020-01-01T00:00:00',
          PreviousValue: 3.0,
          PreviousValueDate: '2023-09-30T00:00:00',
        },
      ];

      vi.mocked(indicatorsRepository.getByCountry).mockResolvedValue(
        mockIndicators
      );

      const result = await indicatorsService.getByCountry('Mexico');

      expect(result).toEqual(mockIndicators);
      expect(indicatorsRepository.getByCountry).toHaveBeenCalledWith('Mexico');
      expect(indicatorsRepository.getByCountry).toHaveBeenCalledTimes(1);
    });

    it('should throw 404 AppError when repository returns empty array', async () => {
      vi.mocked(indicatorsRepository.getByCountry).mockResolvedValue([]);

      await expect(indicatorsService.getByCountry('InvalidCountry')).rejects.toThrow(
        AppError
      );

      await expect(indicatorsService.getByCountry('InvalidCountry')).rejects.toThrow(
        'No indicators found for country: InvalidCountry'
      );

      try {
        await indicatorsService.getByCountry('InvalidCountry');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it('should propagate AppError from repository', async () => {
      const repoError = new AppError('Indicators not found for country: Mexico', 404);
      vi.mocked(indicatorsRepository.getByCountry).mockRejectedValue(repoError);

      await expect(indicatorsService.getByCountry('Mexico')).rejects.toThrow(
        repoError
      );
    });
  });

  describe('getByCountryAndName', () => {
    it('should return indicators when repository returns data', async () => {
      const mockIndicators: Indicator[] = [
        {
          Country: 'Mexico',
          Category: 'GDP',
          Title: 'GDP Annual Growth Rate',
          LatestValue: 3.2,
          LatestValueDate: '2023-12-31T00:00:00',
          Source: 'World Bank',
          Unit: 'Percent',
          URL: 'https://tradingeconomics.com/mexico/gdp-growth-annual',
          CategoryGroup: 'GDP',
          Frequency: 'yearly',
          HistoricalDataSymbol: 'MEXGDPYOY',
          CreateDate: '2020-01-01T00:00:00',
          PreviousValue: 3.0,
          PreviousValueDate: '2023-09-30T00:00:00',
        },
      ];

      vi.mocked(indicatorsRepository.getByCountryAndName).mockResolvedValue(
        mockIndicators
      );

      const result = await indicatorsService.getByCountryAndName('Mexico', 'GDP');

      expect(result).toEqual(mockIndicators);
      expect(indicatorsRepository.getByCountryAndName).toHaveBeenCalledWith(
        'Mexico',
        'GDP'
      );
      expect(indicatorsRepository.getByCountryAndName).toHaveBeenCalledTimes(1);
    });

    it('should throw 404 AppError when repository returns empty array', async () => {
      vi.mocked(indicatorsRepository.getByCountryAndName).mockResolvedValue([]);

      await expect(
        indicatorsService.getByCountryAndName('Mexico', 'InvalidIndicator')
      ).rejects.toThrow(AppError);

      await expect(
        indicatorsService.getByCountryAndName('Mexico', 'InvalidIndicator')
      ).rejects.toThrow('Indicator "InvalidIndicator" not found for country: Mexico');

      try {
        await indicatorsService.getByCountryAndName('Mexico', 'InvalidIndicator');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it('should propagate AppError from repository', async () => {
      const repoError = new AppError(
        'Indicator "GDP" not found for country: Mexico',
        404
      );
      vi.mocked(indicatorsRepository.getByCountryAndName).mockRejectedValue(
        repoError
      );

      await expect(
        indicatorsService.getByCountryAndName('Mexico', 'GDP')
      ).rejects.toThrow(repoError);
    });
  });
});
