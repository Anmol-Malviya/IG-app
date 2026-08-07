# IG-App Backend

Production-grade Express.js API server with TypeScript, MongoDB, and JWT authentication.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (port 5000) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run lint` | Type-check without emitting |

## Architecture

See [ARCHITECTURE.md](../ARCHITECTURE.md) for full system documentation.

```
src/
├── config/          → Environment, DB, CORS, Logger
├── modules/         → Feature modules (auth, user, tenant)
├── middleware/       → Express middleware (auth, RBAC, validation, errors)
├── shared/          → Shared utilities, types, constants, errors
├── app.ts           → Express app setup
└── server.ts        → Entry point with graceful shutdown
```

## Adding a New Module

1. Create `src/modules/<name>/`
2. Add files: `<name>.controller.ts`, `.service.ts`, `.routes.ts`, `.validation.ts`, `.types.ts`, `.model.ts`
3. Add `README.md` to the module
4. Register routes in `src/app.ts`
5. Update `ARCHITECTURE.md`

## Deployment (Render)

The backend deploys to Render via Docker. See `Dockerfile` and `render.yaml`.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for coding rules and conventions.
