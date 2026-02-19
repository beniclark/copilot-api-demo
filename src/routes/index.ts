import { Router, Request, Response } from 'express';
import { petsRouter } from './pets.routes';

/**
 * Root route index.
 * Registers all resource routers and provides a health check endpoint.
 *
 * As you add new resources during the demo, register them here:
 *   import { indicatorsRouter } from './indicators.routes';
 *   router.use('/indicators', indicatorsRouter);
 */
const router = Router();

/**
 * Health check endpoint.
 * @route GET /api/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

// ──────────────────────────────────────────────
// Register resource routes below during the demo
// ──────────────────────────────────────────────
// Example:
//   import { indicatorsRouter } from './indicators.routes';
//   router.use('/indicators', indicatorsRouter);

router.use('/pets', petsRouter);

export { router as apiRouter };
