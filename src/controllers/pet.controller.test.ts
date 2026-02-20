import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { petController } from './pet.controller';
import { petService } from '../services/pet.service';
import { Pet } from '../types/pet.types';

vi.mock('../services/pet.service');

const mockPet: Pet = {
  id: 10,
  name: 'doggie',
  photoUrls: ['https://example.com/photo.jpg'],
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 0, name: 'friendly' }],
  status: 'available',
};

const mockRes = () => {
  const res = {
    json: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

describe('petController', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ── findByStatus ────────────────────────────────────────────

  describe('findByStatus', () => {
    it('returns 200 with pets matching status', async () => {
      vi.mocked(petService.getByStatus).mockResolvedValueOnce([mockPet]);

      const req = { query: { status: 'available' } } as unknown as Request;
      const res = mockRes();
      const next = vi.fn() as NextFunction;

      await petController.findByStatus(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ data: [mockPet] });
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors to next()', async () => {
      const error = new Error('boom');
      vi.mocked(petService.getByStatus).mockRejectedValueOnce(error);

      const req = { query: { status: 'available' } } as unknown as Request;
      const res = mockRes();
      const next = vi.fn() as NextFunction;

      await petController.findByStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── getById ─────────────────────────────────────────────────

  describe('getById', () => {
    it('returns 200 with the pet', async () => {
      vi.mocked(petService.getById).mockResolvedValueOnce(mockPet);

      const req = { params: { petId: '10' } } as unknown as Request;
      const res = mockRes();
      const next = vi.fn() as NextFunction;

      await petController.getById(req, res, next);

      expect(petService.getById).toHaveBeenCalledWith(10);
      expect(res.json).toHaveBeenCalledWith({ data: mockPet });
    });

    it('forwards errors to next()', async () => {
      const error = new Error('not found');
      vi.mocked(petService.getById).mockRejectedValueOnce(error);

      const req = { params: { petId: '999' } } as unknown as Request;
      const res = mockRes();
      const next = vi.fn() as NextFunction;

      await petController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── create ──────────────────────────────────────────────────

  describe('create', () => {
    it('returns 201 with the created pet', async () => {
      vi.mocked(petService.create).mockResolvedValueOnce(mockPet);

      const body = { name: 'doggie', photoUrls: ['https://example.com/photo.jpg'] };
      const req = { body } as unknown as Request;
      const res = mockRes();
      const next = vi.fn() as NextFunction;

      await petController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockPet });
    });
  });

  // ── update ──────────────────────────────────────────────────

  describe('update', () => {
    it('returns 200 with the updated pet', async () => {
      const updated = { ...mockPet, name: 'updatedDoggie' };
      vi.mocked(petService.update).mockResolvedValueOnce(updated);

      const req = { body: updated } as unknown as Request;
      const res = mockRes();
      const next = vi.fn() as NextFunction;

      await petController.update(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ data: updated });
    });
  });

  // ── remove ──────────────────────────────────────────────────

  describe('remove', () => {
    it('returns 204 on successful deletion', async () => {
      vi.mocked(petService.remove).mockResolvedValueOnce(undefined);

      const req = { params: { petId: '10' } } as unknown as Request;
      const res = mockRes();
      const next = vi.fn() as NextFunction;

      await petController.remove(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('forwards errors to next()', async () => {
      const error = new Error('not found');
      vi.mocked(petService.remove).mockRejectedValueOnce(error);

      const req = { params: { petId: '999' } } as unknown as Request;
      const res = mockRes();
      const next = vi.fn() as NextFunction;

      await petController.remove(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
