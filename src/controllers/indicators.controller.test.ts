import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as indicatorsController from './indicators.controller';
import { indicatorsService } from '../services/indicators.service';
import { AppError } from '../middleware/errorHandler';
import { Indicator } from '../types/indicators.types';
import {
  GetIndicatorsByCountryParams,
  GetIndicatorByNameParams,
} from '../schemas/indicators.schema';

// Mock the service module
vi.mock('../services/indicators.service', () => ({
  indicatorsService: {
    getByCountry: vi.fn(),
    getByCountryAndName: vi.fn(),
  },
}));

describe('IndicatorsController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRequest = {
      params: {},
    };

    mockResponse = {
      json: vi.fn(),
    };

    mockNext = vi.fn();
  });

  describe('getByCountry', () => {
    it('should call service with correct country and send data response', async () => {
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

      mockRequest.params = { country: 'Mexico' } as GetIndicatorsByCountryParams;

      vi.mocked(indicatorsService.getByCountry).mockResolvedValue(mockIndicators);

      await indicatorsController.getByCountry(
        mockRequest as Request<GetIndicatorsByCountryParams>,
        mockResponse as Response,
        mockNext
      );

      expect(indicatorsService.getByCountry).toHaveBeenCalledWith('Mexico');
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockIndicators,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error on service failure', async () => {
      const error = new AppError('No indicators found for country: InvalidCountry', 404);
      mockRequest.params = { country: 'InvalidCountry' } as GetIndicatorsByCountryParams;

      vi.mocked(indicatorsService.getByCountry).mockRejectedValue(error);

      await indicatorsController.getByCountry(
        mockRequest as Request<GetIndicatorsByCountryParams>,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getByCountryAndName', () => {
    it('should call service with correct country and indicator and send data response', async () => {
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

      mockRequest.params = {
        country: 'Mexico',
        indicator: 'GDP',
      } as GetIndicatorByNameParams;

      vi.mocked(indicatorsService.getByCountryAndName).mockResolvedValue(
        mockIndicators
      );

      await indicatorsController.getByCountryAndName(
        mockRequest as Request<GetIndicatorByNameParams>,
        mockResponse as Response,
        mockNext
      );

      expect(indicatorsService.getByCountryAndName).toHaveBeenCalledWith(
        'Mexico',
        'GDP'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockIndicators,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error on service failure', async () => {
      const error = new AppError(
        'Indicator "InvalidIndicator" not found for country: Mexico',
        404
      );
      mockRequest.params = {
        country: 'Mexico',
        indicator: 'InvalidIndicator',
      } as GetIndicatorByNameParams;

      vi.mocked(indicatorsService.getByCountryAndName).mockRejectedValue(error);

      await indicatorsController.getByCountryAndName(
        mockRequest as Request<GetIndicatorByNameParams>,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
