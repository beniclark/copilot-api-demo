import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock globalThis.fetch before importing the module under test
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

import {
  findByStatus,
  getById,
  addPet,
  updatePet,
  deletePet,
} from './pet.repository';
import { Pet } from '../types/pet.types';

const mockPet: Pet = {
  id: 10,
  name: 'doggie',
  photoUrls: ['https://example.com/photo.jpg'],
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 0, name: 'friendly' }],
  status: 'available',
};

describe('petRepository', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ── findByStatus ────────────────────────────────────────────

  describe('findByStatus', () => {
    it('returns pets for a valid status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPet]),
      });

      const result = await findByStatus('available');

      expect(result).toEqual([mockPet]);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://petstore.swagger.io/v2/pet/findByStatus?status=available',
        undefined
      );
    });

    it('encodes the status query parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await findByStatus('sold');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('status=sold'),
        undefined
      );
    });

    it('throws on non-2xx response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      });

      await expect(findByStatus('available')).rejects.toThrow(
        'Unable to complete the Petstore API request'
      );
    });

    it('throws on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      await expect(findByStatus('available')).rejects.toThrow(
        'Unable to reach the Petstore API'
      );
    });
  });

  // ── getById ─────────────────────────────────────────────────

  describe('getById', () => {
    it('returns a pet for a valid ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPet),
      });

      const result = await getById(10);

      expect(result).toEqual(mockPet);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://petstore.swagger.io/v2/pet/10',
        undefined
      );
    });

    it('throws on 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Pet not found'),
      });

      await expect(getById(999)).rejects.toThrow(
        'Unable to complete the Petstore API request'
      );
    });
  });

  // ── addPet ──────────────────────────────────────────────────

  describe('addPet', () => {
    it('posts a new pet and returns the created pet', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPet),
      });

      const body = { name: 'doggie', photoUrls: ['https://example.com/photo.jpg'] };
      const result = await addPet(body);

      expect(result).toEqual(mockPet);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://petstore.swagger.io/v2/pet',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      );
    });
  });

  // ── updatePet ───────────────────────────────────────────────

  describe('updatePet', () => {
    it('puts the updated pet and returns it', async () => {
      const updated = { ...mockPet, name: 'updatedDoggie' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updated),
      });

      const result = await updatePet(updated);

      expect(result.name).toBe('updatedDoggie');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://petstore.swagger.io/v2/pet',
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  // ── deletePet ───────────────────────────────────────────────

  describe('deletePet', () => {
    it('sends a DELETE request for the given pet ID', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });

      await deletePet(10);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://petstore.swagger.io/v2/pet/10',
        { method: 'DELETE' }
      );
    });

    it('throws on non-2xx response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Pet not found'),
      });

      await expect(deletePet(999)).rejects.toThrow(
        'Unable to complete the Petstore API request'
      );
    });
  });
});
