import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'copilot-api-demo',
      version: '1.0.0',
      description:
        'Demo REST API built with Express.js and TypeScript. Demonstrates best practices including integration with the Trading Economics external API and a Petstore-style resource.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        ApiError: {
          type: 'object',
          required: ['error', 'code'],
          properties: {
            error: { type: 'string', example: 'Resource not found' },
            code: { type: 'integer', example: 404 },
            details: {},
          },
        },
        Indicator: {
          type: 'object',
          required: ['country', 'category', 'title', 'latestValue', 'latestValueDate'],
          properties: {
            country: { type: 'string', example: 'Mexico' },
            category: { type: 'string', example: 'GDP' },
            title: { type: 'string', example: 'Mexico GDP' },
            latestValueDate: { type: 'string', format: 'date-time', example: '2022-12-31T00:00:00' },
            latestValue: { type: 'number', example: 1414.19 },
            source: { type: 'string', example: 'World Bank' },
            sourceUrl: { type: 'string', example: 'https://www.worldbank.org/' },
            unit: { type: 'string', example: 'USD Billion' },
            url: { type: 'string', example: '/mexico/gdp' },
            categoryGroup: { type: 'string', example: 'GDP' },
            adjustment: { type: 'string', example: 'Current USD' },
            frequency: { type: 'string', example: 'Yearly' },
            historicalDataSymbol: { type: 'string', example: 'WGDPMEXI' },
            createDate: { type: 'string', format: 'date-time' },
            firstValueDate: { type: 'string', format: 'date-time' },
            previousValue: { type: 'number', example: 1272.84 },
            previousValueDate: { type: 'string', format: 'date-time' },
          },
        },
        IndicatorsResponse: {
          type: 'object',
          required: ['data'],
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Indicator' },
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: { error: 'Validation failed', code: 400, details: [] },
            },
          },
        },
        TooManyRequests: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                error: 'Too many requests, please try again later.',
                code: 429,
              },
            },
          },
        },
        InternalServerError: {
          description: 'Unexpected server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
      },
    },
  },
  // Scan all route files for @openapi JSDoc blocks
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

/** Pre-built OpenAPI 3.0 specification object. */
export const openApiSpec = swaggerJsdoc(options);
