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
