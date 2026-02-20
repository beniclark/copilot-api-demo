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
          required: ['Country', 'Category', 'Title'],
          properties: {
            Country: {
              type: 'string',
              example: 'Mexico',
              description: 'Country name',
            },
            Category: {
              type: 'string',
              example: 'GDP',
              description: 'Indicator category',
            },
            Title: {
              type: 'string',
              example: 'GDP Annual Growth Rate',
              description: 'Human-readable indicator title',
            },
            LatestValue: {
              type: 'number',
              nullable: true,
              example: 3.2,
              description: 'Latest recorded value',
            },
            LatestValueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2023-12-31T00:00:00',
              description: 'Date of the latest value',
            },
            Source: {
              type: 'string',
              example: 'World Bank',
              description: 'Source of the data',
            },
            Unit: {
              type: 'string',
              example: 'Percent',
              description: 'Measurement unit',
            },
            URL: {
              type: 'string',
              example: 'https://tradingeconomics.com/mexico/gdp-growth-annual',
              description: 'URL to detailed indicator page',
            },
            CategoryGroup: {
              type: 'string',
              example: 'GDP',
              description: 'Category group',
            },
            Frequency: {
              type: 'string',
              example: 'yearly',
              description: 'Frequency of data updates',
            },
            HistoricalDataSymbol: {
              type: 'string',
              example: 'MEXGDPYOY',
              description: 'Historical reference symbol',
            },
            CreateDate: {
              type: 'string',
              format: 'date-time',
              example: '2020-01-01T00:00:00',
              description: 'Indicator creation date',
            },
            PreviousValue: {
              type: 'number',
              nullable: true,
              example: 3.0,
              description: 'Previous recorded value',
            },
            PreviousValueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2023-09-30T00:00:00',
              description: 'Previous value date',
            },
          },
        },
        IndicatorResponse: {
          type: 'object',
          required: ['data'],
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Indicator',
              },
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
