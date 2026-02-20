import { Router, Request, Response } from 'express';
import { indicatorsRouter } from './indicators.routes';

/**
 * Root route index.
 * Registers all resource routers and provides a health check endpoint.
 */
const router = Router();

/**
 * Health check endpoint.
 * @route GET /api/health
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - System
 *     summary: Health check
 *     description: Returns the current health status and server timestamp.
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: '2026-02-19T12:00:00.000Z'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

// ── Resource Routes ──────────────────────────────────────────────
router.use('/indicators', indicatorsRouter);

export { router as apiRouter };
