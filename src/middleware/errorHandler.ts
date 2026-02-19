import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/api.types';

/**
 * Custom application error with an HTTP status code.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Centralized error handler middleware.
 * Catches all errors forwarded via next(error) and sends a consistent ApiError response.
 * Never exposes raw stack traces to clients.
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response<ApiError>,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const details = err instanceof AppError ? err.details : undefined;

  // Log the full error server-side for debugging
  console.error(`[ERROR] ${err.message}`, {
    statusCode,
    stack: err.stack,
    details,
  });

  // Send sanitized error to client — never include stack traces
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    code: statusCode,
    ...(details !== undefined && { details }),
  });
};
