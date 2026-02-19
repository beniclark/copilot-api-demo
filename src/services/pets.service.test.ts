import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as petsRepo from '../repositories/pets.repository';
import * as petsService from './pets.service';
import { AppError } from '../middleware/errorHandler';

vi.mock('../repositories/pets.repository');

const mockPet = {
  id: 'test-id-123',
  name: 'Buddy',
  species: 'Dog',
  age: 3,
  status: 'available' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('listPets', () => {
  it('returns paginated pet list with meta', () => {
    vi.mocked(petsRepo.findAll).mockReturnValue([mockPet]);

    const result = petsService.listPets({ page: 1, limit: 20, status: undefined });

    expect(result.pets).toEqual([mockPet]);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('passes status filter to repository', () => {
    vi.mocked(petsRepo.findAll).mockReturnValue([]);

    petsService.listPets({ page: 1, limit: 20, status: 'sold' });

    expect(petsRepo.findAll).toHaveBeenCalledWith('sold');
  });

  it('returns only the requested page slice', () => {
    const pets = Array.from({ length: 5 }, (_, i) => ({
      ...mockPet,
      id: `id-${i}`,
      name: `Pet ${i}`,
    }));
    vi.mocked(petsRepo.findAll).mockReturnValue(pets);

    const result = petsService.listPets({ page: 2, limit: 2, status: undefined });

    expect(result.pets).toHaveLength(2);
    expect(result.pets[0].id).toBe('id-2');
  });
});

describe('getPetById', () => {
  it('returns pet when found', () => {
    vi.mocked(petsRepo.findById).mockReturnValue(mockPet);

    const result = petsService.getPetById('test-id-123');

    expect(result).toEqual(mockPet);
    expect(petsRepo.findById).toHaveBeenCalledWith('test-id-123');
  });

  it('throws AppError 404 when pet does not exist', () => {
    vi.mocked(petsRepo.findById).mockReturnValue(undefined);

    expect(() => petsService.getPetById('missing-id')).toThrow(AppError);
    expect(() => petsService.getPetById('missing-id')).toThrow('not found');
  });
});

describe('createPet', () => {
  it('delegates to repository and returns created pet', () => {
    vi.mocked(petsRepo.create).mockReturnValue(mockPet);

    const body = { name: 'Buddy', species: 'Dog', age: 3, status: 'available' as const };
    const result = petsService.createPet(body);

    expect(result).toEqual(mockPet);
    expect(petsRepo.create).toHaveBeenCalledWith(body);
  });
});

describe('updatePet', () => {
  it('returns updated pet when found', () => {
    const updated = { ...mockPet, name: 'Buddy Jr.' };
    vi.mocked(petsRepo.update).mockReturnValue(updated);

    const result = petsService.updatePet('test-id-123', { name: 'Buddy Jr.' });

    expect(result.name).toBe('Buddy Jr.');
  });

  it('throws AppError 404 when pet does not exist', () => {
    vi.mocked(petsRepo.update).mockReturnValue(undefined);

    expect(() => petsService.updatePet('no-such-id', { name: 'X' })).toThrow(AppError);
  });
});

describe('deletePet', () => {
  it('completes without error when pet exists', () => {
    vi.mocked(petsRepo.remove).mockReturnValue(true);

    expect(() => petsService.deletePet('test-id-123')).not.toThrow();
  });

  it('throws AppError 404 when pet does not exist', () => {
    vi.mocked(petsRepo.remove).mockReturnValue(false);

    expect(() => petsService.deletePet('no-such-id')).toThrow(AppError);
  });
});
