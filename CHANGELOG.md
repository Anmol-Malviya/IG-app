# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.0] - 2026-08-07

### Added
- Initial project setup with three applications:
  - **frontend**: Next.js 16 + TypeScript + Tailwind CSS 4
  - **backend**: Express.js 5 + TypeScript + Mongoose 9
  - **superadmin**: Next.js 16 + TypeScript + Tailwind CSS 4
- Production-grade backend architecture with modular structure
- Security middleware: Helmet, rate limiting, CORS whitelist, JWT auth
- Request validation with Zod
- Standardized API response format
- Graceful shutdown handling
- Docker + Render deployment configuration
- Vercel deployment configuration for frontend & superadmin
- Documentation system: ARCHITECTURE.md, CONTRIBUTING.md, CHANGELOG.md
- Auth module (register, login, refresh, logout)
- User module (CRUD with RBAC)
- Tenant module (multi-tenant management)
