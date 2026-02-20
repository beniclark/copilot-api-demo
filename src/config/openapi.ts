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
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64', example: 1 },
            name: { type: 'string', example: 'Dogs' },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64', example: 0 },
            name: { type: 'string', example: 'friendly' },
          },
        },
        Pet: {
          type: 'object',
          required: ['id', 'name', 'photoUrls'],
          properties: {
            id: { type: 'integer', format: 'int64', example: 10 },
            name: { type: 'string', example: 'doggie' },
            category: { $ref: '#/components/schemas/Category' },
            photoUrls: {
              type: 'array',
              items: { type: 'string', example: 'https://example.com/photo.jpg' },
            },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/Tag' },
            },
            status: {
              type: 'string',
              description: 'Pet status in the store',
              enum: ['available', 'pending', 'sold'],
              example: 'available',
            },
          },
        },
        CreatePetBody: {
          type: 'object',
          required: ['name', 'photoUrls'],
          properties: {
            name: { type: 'string', example: 'doggie' },
            photoUrls: {
              type: 'array',
              items: { type: 'string', example: 'https://example.com/photo.jpg' },
            },
            category: { $ref: '#/components/schemas/Category' },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/Tag' },
            },
            status: {
              type: 'string',
              enum: ['available', 'pending', 'sold'],
              example: 'available',
            },
          },
        },
        UpdatePetBody: {
          type: 'object',
          required: ['id', 'name', 'photoUrls'],
          properties: {
            id: { type: 'integer', format: 'int64', example: 10 },
            name: { type: 'string', example: 'doggie' },
            photoUrls: {
              type: 'array',
              items: { type: 'string', example: 'https://example.com/photo.jpg' },
            },
            category: { $ref: '#/components/schemas/Category' },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/Tag' },
            },
            status: {
              type: 'string',
              enum: ['available', 'pending', 'sold'],
              example: 'available',
            },
          },
        },
        PetResponse: {
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/Pet' },
          },
        },
        PetsResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Pet' },
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
