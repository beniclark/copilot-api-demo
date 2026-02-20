import { describe, it, expect, vi, beforeEach } from 'vitest';
import { petService } from './pet.service';
import { petRepository } from '../repositories/pet.repository';
import { Pet } from '../types/pet.types';

vi.mock('../repositories/pet.repository');

const mockPet: Pet = {
  id: 10,
  name: 'doggie',
  photoUrls: ['https://example.com/photo.jpg'],
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 0, name: 'friendly' }],
  status: 'available',
};

describe('petService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    petService.clearCache();
  });

  // ── getByStatus ─────────────────────────────────────────────

  describe('getByStatus', () => {
    it('returns pets from the repository', async () => {
      vi.mocked(petRepository.findByStatus).mockResolvedValueOnce([mockPet]);

      const result = await petService.getByStatus('available');

      expect(result).toEqual([mockPet]);
      expect(petRepository.findByStatus).toHaveBeenCalledWith('available');
    });

    it('returns cached data on subsequent calls', async () => {
      vi.mocked(petRepository.findByStatus).mockResolvedValueOnce([mockPet]);

      await petService.getByStatus('available');
      const result = await petService.getByStatus('available');

      expect(result).toEqual([mockPet]);
      expect(petRepository.findByStatus).toHaveBeenCalledTimes(1);
    });
  });

  // ── getById ─────────────────────────────────────────────────

  describe('getById', () => {
    it('returns a pet from the repository', async () => {
      vi.mocked(petRepository.getById).mockResolvedValueOnce(mockPet);

      const result = await petService.getById(10);

      expect(result).toEqual(mockPet);
      expect(petRepository.getById).toHaveBeenCalledWith(10);
    });

    it('returns cached data on subsequent calls', async () => {
      vi.mocked(petRepository.getById).mockResolvedValueOnce(mockPet);

      await petService.getById(10);
      const result = await petService.getById(10);

      expect(result).toEqual(mockPet);
      expect(petRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('throws 404 when pet is not found', async () => {
      vi.mocked(petRepository.getById).mockRejectedValueOnce(
        new Error('Unable to complete the Petstore API request')
      );

      await expect(petService.getById(999)).rejects.toThrow('Pet with ID 999 not found');
    });
  });

  // ── create ──────────────────────────────────────────────────

  describe('create', () => {
    it('creates a pet and invalidates status cache', async () => {
      vi.mocked(petRepository.addPet).mockResolvedValueOnce(mockPet);

      const body = { name: 'doggie', photoUrls: ['https://example.com/photo.jpg'], status: 'available' as const };
      const result = await petService.create(body);

      expect(result).toEqual(mockPet);
      expect(petRepository.addPet).toHaveBeenCalledWith(body);
    });
  });

  // ── update ──────────────────────────────────────────────────

  describe('update', () => {
    it('updates a pet and invalidates caches', async () => {
      const updated = { ...mockPet, name: 'updatedDoggie' };
      vi.mocked(petRepository.updatePet).mockResolvedValueOnce(updated);

      const result = await petService.update(updated);

      expect(result.name).toBe('updatedDoggie');
      expect(petRepository.updatePet).toHaveBeenCalledWith(updated);
    });
  });

  // ── remove ──────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes a pet and invalidates its cache', async () => {
      vi.mocked(petRepository.deletePet).mockResolvedValueOnce(undefined);

      await petService.remove(10);

      expect(petRepository.deletePet).toHaveBeenCalledWith(10);
    });
  });
});
