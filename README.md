# copilot-api-demo

Demo project for the **"Leveraging GitHub Copilot for API Development"** presentation.

## Quick Start

```bash
npm install
npm run dev        # starts the dev server with hot reload
```

Visit `http://localhost:3000/api/health` to confirm it's running.
Visit `http://localhost:3000/api/docs` to explore the OpenAPI documentation.

## Project Structure

```
├── .github/
│   ├── copilot-instructions.md              # Always-on rules for Copilot
│   ├── instructions/
│   │   ├── controllers.instructions.md      # Rules for controller files
│   │   ├── services.instructions.md         # Rules for service files
│   │   ├── schemas.instructions.md          # Rules for Zod schemas
│   │   ├── openapi.instructions.md          # Rules & template for OpenAPI 3.0 docs
│   │   └── tests.instructions.md            # Rules for test files
│   └── agents/
│       ├── api-planner.agent.md             # Read-only planning agent
│       ├── api-builder.agent.md             # Implementation agent
│       └── api-reviewer.agent.md            # Code review agent
├── .vscode/
│   └── mcp.json                             # MCP server configuration (Fetch + GitHub)
├── src/
│   ├── index.ts                             # Express app entry point
│   ├── config/
│   │   ├── index.ts                         # Centralized configuration
│   │   └── openapi.ts                       # OpenAPI 3.0 spec + shared components
│   ├── middleware/
│   │   ├── errorHandler.ts                  # Centralized error handling
│   │   ├── requestLogger.ts                 # Request logging
│   │   └── validate.ts                      # Zod validation middleware
│   ├── routes/index.ts                      # Route registry
│   ├── controllers/                         # (created during demo)
│   ├── services/                            # (created during demo)
│   ├── repositories/                        # (created during demo)
│   ├── schemas/                             # (created during demo)
│   └── types/
│       └── api.types.ts                     # Shared ApiResponse & ApiError types
└── package.json
```

## Demo Flow

### Demo 1 — Instruction Files
Show `.github/copilot-instructions.md` and the `instructions/` folder.
Ask Copilot to create an endpoint — observe that it follows all the rules automatically.

### Demo 2 — Custom Agents
Select the **API Planner** agent → ask it to plan a `/api/indicators` resource.
Click the **"Implement this plan"** handoff → the **API Builder** agent creates all the files.
Optionally use the **API Reviewer** agent to audit the generated code.

### Demo 3 — MCP Servers
**Scenario A:** Ask Copilot to fetch the Petstore OpenAPI spec and generate a typed client.
**Scenario B:** Ask Copilot to fetch Trading Economics docs and generate a service wrapper.

## Environment Variables

| Variable      | Default        | Description                        |
|---------------|----------------|------------------------------------|
| `PORT`        | `3000`         | Server port                        |
| `TE_API_KEY`  | `guest:guest`  | Trading Economics API key          |
| `CACHE_TTL`   | `300`          | Cache TTL in seconds (5 min)       |

## Scripts

| Command          | Description                |
|------------------|----------------------------|
| `npm run dev`    | Start dev server (hot reload) |
| `npm run build`  | Compile TypeScript           |
| `npm start`      | Run compiled JS              |
| `npm run lint`   | Run ESLint                   |
| `npm test`       | Run Vitest                   |
