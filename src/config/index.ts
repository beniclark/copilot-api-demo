/**
 * Application configuration.
 * Centralizes environment variables and defaults.
 */
export const config = {
  /** Server port */
  port: parseInt(process.env.PORT || '3000', 10),

  /** Trading Economics API configuration */
  tradingEconomics: {
    baseUrl: 'https://api.tradingeconomics.com',
    apiKey: process.env.TE_API_KEY || 'guest:guest',
  },

  /** Cache TTL in seconds */
  cacheTtl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes

  /** Rate limiting */
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },
} as const;
