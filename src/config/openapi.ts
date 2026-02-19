import type { OpenAPIV3 } from 'openapi-types';

/** Reusable schema components for the OpenAPI spec. */
const petStatusEnum: OpenAPIV3.SchemaObject = {
  type: 'string',
  enum: ['available', 'pending', 'sold'],
  description: 'Availability status of the pet',
};

const petSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['id', 'name', 'species', 'age', 'status', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Unique pet identifier' },
    name: { type: 'string', example: 'Buddy' },
    species: { type: 'string', example: 'Dog' },
    age: { type: 'integer', minimum: 0, maximum: 100, example: 3 },
    status: petStatusEnum,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const apiErrorSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  required: ['error', 'code'],
  properties: {
    error: { type: 'string', example: 'Pet with id \'abc\' not found' },
    code: { type: 'integer', example: 404 },
    details: {},
  },
};

const paginationMetaSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    total: { type: 'integer', example: 42 },
    page: { type: 'integer', example: 1 },
    limit: { type: 'integer', example: 20 },
  },
};

/** Full OpenAPI 3.0 document for the Petstore API. */
export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Copilot API Demo — Petstore',
    version: '1.0.0',
    description:
      'A demo REST API built with Express.js and TypeScript, showcasing best practices with GitHub Copilot.',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Service health' },
    { name: 'Pets', description: 'Petstore resource — CRUD operations' },
  ],
  components: {
    schemas: {
      Pet: petSchema,
      PetStatus: petStatusEnum,
      ApiError: apiErrorSchema,
      PaginationMeta: paginationMetaSchema,
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ApiError' } },
        },
      },
      BadRequest: {
        description: 'Validation error',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ApiError' } },
        },
      },
      TooManyRequests: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ApiError' } },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'ok' },
                        timestamp: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/pets': {
      get: {
        tags: ['Pets'],
        summary: 'List all pets',
        operationId: 'listPets',
        parameters: [
          {
            name: 'status',
            in: 'query',
            required: false,
            schema: petStatusEnum,
            description: 'Filter by availability status',
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 1, minimum: 1 },
            description: 'Page number (1-based)',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
            description: 'Results per page',
          },
        ],
        responses: {
          '200': {
            description: 'Paginated list of pets',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Pet' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '429': { $ref: '#/components/responses/TooManyRequests' },
        },
      },
      post: {
        tags: ['Pets'],
        summary: 'Create a new pet',
        operationId: 'createPet',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'species', 'age'],
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 100, example: 'Buddy' },
                  species: { type: 'string', minLength: 1, maxLength: 60, example: 'Dog' },
                  age: { type: 'integer', minimum: 0, maximum: 100, example: 3 },
                  status: { $ref: '#/components/schemas/PetStatus' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Pet created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Pet' } },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '429': { $ref: '#/components/responses/TooManyRequests' },
        },
      },
    },
    '/api/pets/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', maxLength: 36 },
          description: 'Pet identifier',
        },
      ],
      get: {
        tags: ['Pets'],
        summary: 'Get a pet by ID',
        operationId: 'getPet',
        responses: {
          '200': {
            description: 'The requested pet',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Pet' } },
                },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
          '429': { $ref: '#/components/responses/TooManyRequests' },
        },
      },
      put: {
        tags: ['Pets'],
        summary: 'Update an existing pet',
        operationId: 'updatePet',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 100 },
                  species: { type: 'string', minLength: 1, maxLength: 60 },
                  age: { type: 'integer', minimum: 0, maximum: 100 },
                  status: { $ref: '#/components/schemas/PetStatus' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated pet',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/Pet' } },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '429': { $ref: '#/components/responses/TooManyRequests' },
        },
      },
      delete: {
        tags: ['Pets'],
        summary: 'Delete a pet',
        operationId: 'deletePet',
        responses: {
          '204': { description: 'Pet deleted — no content returned' },
          '404': { $ref: '#/components/responses/NotFound' },
          '429': { $ref: '#/components/responses/TooManyRequests' },
        },
      },
    },
  },
};
