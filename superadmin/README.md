# IG-App Superadmin

Superadmin Next.js dashboard application deployed on Vercel.

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
│   ├── (auth)/          → Login (no sidebar, superadmin only)
│   ├── (dashboard)/     → Protected metrics, user/tenant tables
│   └── globals.css      → Global custom admin theme
├── components/          → UI components
├── lib/                 → API client, auth helpers, constants
├── hooks/               → Custom React hooks
├── providers/           → Auth & Theme Context providers
```

## Deployment (Vercel)

Push to `main` branch to auto-deploy on Vercel. See `vercel.json` for details.
