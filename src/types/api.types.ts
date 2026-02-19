/** Shared API response and error types used across all endpoints. */

/**
 * Standard success response wrapper.
 * Every endpoint must return data in this shape.
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

/**
 * Standard error response shape.
 * The centralized error handler sends this to clients.
 */
export interface ApiError {
  error: string;
  code: number;
  details?: unknown;
}
