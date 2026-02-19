import express from 'express';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

const app = express();

// ── Global Middleware ────────────────────────────────────────────
app.use(express.json());
app.use(requestLogger);

// Global rate limiter — applies to all routes
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
    code: 429,
  },
});
app.use(limiter);

// ── Routes ──────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── Error Handling ──────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`🚀 API server running on http://localhost:${config.port}`);
  console.log(`   Health check: http://localhost:${config.port}/api/health`);
});

export { app };
