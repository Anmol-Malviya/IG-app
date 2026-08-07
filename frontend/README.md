# IG-App Frontend

Customer-facing Next.js application deployed on Vercel.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

## Architecture

See [ARCHITECTURE.md](../ARCHITECTURE.md) for full system documentation.

```
src/
├── app/                 → Next.js App Router pages
│   ├── (auth)/          → Login/Register (no sidebar)
│   ├── (dashboard)/     → Protected pages (with sidebar)
│   └── globals.css      → Global styles
├── components/          → Reusable UI components
│   ├── ui/              → Primitives (Button, Input, Modal)
│   ├── layout/          → Header, Sidebar, Footer
│   └── shared/          → Cross-feature components
├── lib/                 → Core utilities (api, auth, constants)
├── hooks/               → Custom React hooks
├── providers/           → Context providers (Auth, Theme)
├── types/               → TypeScript definitions
└── styles/              → Additional CSS
```

## Deployment (Vercel)

Push to `main` branch to auto-deploy on Vercel. See `vercel.json` for configuration.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for coding rules.
