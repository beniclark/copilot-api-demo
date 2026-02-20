import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { indicatorsRepository } from './indicators.repository';
import { AppError } from '../middleware/errorHandler';

const mockIndicatorPayload = [
  {
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
  },
];

describe('indicatorsRepository', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('fetchByCountry', () => {
    it('returns indicator data for a valid country', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockIndicatorPayload),
      });

      const result = await indicatorsRepository.fetchByCountry('mexico');

      expect(result).toEqual(mockIndicatorPayload);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(calledUrl).toContain('/country/mexico');
    });

    it('includes group query parameter when provided', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockIndicatorPayload),
      });

      await indicatorsRepository.fetchByCountry('mexico', 'gdp');

      const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(calledUrl).toContain('group=gdp');
    });

    it('encodes country names with special characters', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await indicatorsRepository.fetchByCountry('new zealand').catch(() => {});

      const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(calledUrl).toContain('/country/new%20zealand');
    });

    it('throws AppError 500 on network failure', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(
        indicatorsRepository.fetchByCountry('mexico')
      ).rejects.toThrow(AppError);

      await expect(
        indicatorsRepository.fetchByCountry('mexico')
      ).rejects.toMatchObject({ statusCode: 500 });
    });

    it('throws AppError 502 on non-ok upstream response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(
        indicatorsRepository.fetchByCountry('mexico')
      ).rejects.toThrow(AppError);

      await expect(
        indicatorsRepository.fetchByCountry('mexico')
      ).rejects.toMatchObject({ statusCode: 502 });
    });

    it('throws AppError 502 when response is not an array', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ error: 'not found' }),
      });

      await expect(
        indicatorsRepository.fetchByCountry('mexico')
      ).rejects.toThrow(AppError);

      await expect(
        indicatorsRepository.fetchByCountry('mexico')
      ).rejects.toMatchObject({ statusCode: 502 });
    });

    it('uses generic error messages that do not leak upstream details', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      try {
        await indicatorsRepository.fetchByCountry('mexico');
      } catch (error: unknown) {
        expect((error as AppError).message).toBe('Unable to retrieve indicator data');
        expect((error as AppError).message).not.toContain('500');
        expect((error as AppError).message).not.toContain('Internal Server Error');
      }
    });
  });

  describe('fetchByCountryAndIndicator', () => {
    it('returns indicator data for a valid country and indicator', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockIndicatorPayload),
      });

      const result = await indicatorsRepository.fetchByCountryAndIndicator('mexico', 'gdp');

      expect(result).toEqual(mockIndicatorPayload);
      const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(calledUrl).toContain('/country/mexico/gdp');
    });

    it('encodes indicator names with special characters', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockIndicatorPayload),
      });

      await indicatorsRepository.fetchByCountryAndIndicator('mexico', 'inflation rate');

      const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(calledUrl).toContain('/country/mexico/inflation%20rate');
    });

    it('throws AppError 502 on non-ok upstream response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        indicatorsRepository.fetchByCountryAndIndicator('mexico', 'gdp')
      ).rejects.toMatchObject({ statusCode: 502 });
    });
  });
});
