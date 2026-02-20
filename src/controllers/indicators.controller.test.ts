import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as indicatorsController from './indicators.controller';
import { indicatorsService } from '../services/indicators.service';
import { AppError } from '../middleware/errorHandler';
import { Indicator } from '../types/indicators.types';

vi.mock('../services/indicators.service');

const mockIndicator: Indicator = {
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
};

function mockReqResNext(params = {}, query = {}) {
  const req = { params, query } as unknown as Request;
  const res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

describe('indicators controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getByCountry', () => {
    it('responds 200 with indicator data', async () => {
      const mockData: Indicator[] = [mockIndicator];
      vi.mocked(indicatorsService.getByCountry).mockResolvedValue(mockData);
      const { req, res, next } = mockReqResNext({ country: 'mexico' }, { group: 'gdp' });

      await indicatorsController.getByCountry(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ data: mockData });
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next(error) when service throws', async () => {
      const error = new AppError('Not found', 404);
      vi.mocked(indicatorsService.getByCountry).mockRejectedValue(error);
      const { req, res, next } = mockReqResNext({ country: 'nowhere' });

      await indicatorsController.getByCountry(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('passes country and group from request to service', async () => {
      vi.mocked(indicatorsService.getByCountry).mockResolvedValue([]);
      const { req, res, next } = mockReqResNext({ country: 'mexico' }, { group: 'gdp' });

      await indicatorsController.getByCountry(req, res, next);

      expect(indicatorsService.getByCountry).toHaveBeenCalledWith('mexico', 'gdp');
    });
  });

  describe('getByCountryAndIndicator', () => {
    it('responds 200 with indicator data', async () => {
      const mockData: Indicator[] = [mockIndicator];
      vi.mocked(indicatorsService.getByCountryAndIndicator).mockResolvedValue(mockData);
      const { req, res, next } = mockReqResNext({ country: 'mexico', indicator: 'gdp' });

      await indicatorsController.getByCountryAndIndicator(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ data: mockData });
    });

    it('calls next(error) when service throws', async () => {
      const error = new AppError('Upstream error', 502);
      vi.mocked(indicatorsService.getByCountryAndIndicator).mockRejectedValue(error);
      const { req, res, next } = mockReqResNext({
        country: 'mexico',
        indicator: 'gdp',
      });

      await indicatorsController.getByCountryAndIndicator(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
