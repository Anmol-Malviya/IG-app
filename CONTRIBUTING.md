# Contributing Guidelines — IG-App

> **Every developer must follow these rules for every code change.**

---

## 📋 Rules for Every Code Change

### 1. Documentation First
- [ ] Update `ARCHITECTURE.md` if adding/modifying a module, endpoint, or database schema
- [ ] Update `CHANGELOG.md` with what changed and the date
- [ ] Every new backend module must have its own `README.md`

### 2. Type Safety
- **No `any` types** — Use proper TypeScript interfaces or `unknown`
- **Zod schemas** for all API request validation — types are derived from schemas
- **Shared types** go in `shared/types/`, module-specific types in `<module>/<module>.types.ts`

### 3. Error Handling
- Never `throw new Error()` — always use `AppError` class from `shared/errors/`
- All async route handlers must use `asyncHandler()` wrapper
- Never catch errors silently — log them with the request ID

### 4. API Response Format
Always use the `apiResponse()` helper. Every response follows this format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "meta": { "page": 1, "limit": 10, "total": 100 }
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": []
  }
}
```

### 5. Security
- **Never hardcode secrets** — use `config/index.ts` to access environment variables
- **Validate all inputs** — Zod middleware on every route
- **Authenticate routes** — use `auth.middleware.ts` for protected routes
- **Authorize access** — use `rbac.middleware.ts` for role-based access
- **Sanitize outputs** — never return passwords, internal IDs, or sensitive data

### 6. Module Pattern (Backend)
When adding a new feature:
1. Create folder: `src/modules/<name>/`
2. Create files: `<name>.controller.ts`, `<name>.service.ts`, `<name>.routes.ts`, `<name>.validation.ts`, `<name>.types.ts`
3. Create `<name>.model.ts` if the module has a database collection
4. Create `README.md` documenting the module
5. Register routes in `src/app.ts`
6. Update `ARCHITECTURE.md` with new endpoints

When removing a feature:
1. Delete the module folder
2. Remove route import from `src/app.ts`
3. Update `ARCHITECTURE.md`
4. Update `CHANGELOG.md`

### 7. Component Pattern (Frontend / Superadmin)
- **UI primitives** → `components/ui/` (Button, Input, Modal, etc.)
- **Layout components** → `components/layout/` (Header, Sidebar, Footer)
- **Feature components** → `components/shared/` or co-located with the page
- **Hooks** → `hooks/` folder with `use` prefix
- **Providers** → `providers/` folder

### 8. Environment Variables
- Backend: Add to `.env.example` + `config/index.ts`
- Frontend/Superadmin: Prefix with `NEXT_PUBLIC_` for client-side, add to `.env.local.example`

### 9. Git Commit Convention
```
feat: add user registration endpoint
fix: resolve token refresh race condition
docs: update API endpoint reference
refactor: extract pagination utility
security: add rate limiting to auth routes
```

### 10. Code Review Checklist
Before submitting any change, verify:
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] No `any` types introduced
- [ ] All new routes have Zod validation
- [ ] Error handling uses `AppError`
- [ ] Documentation updated (ARCHITECTURE.md, CHANGELOG.md, module README)
- [ ] Environment variables documented
- [ ] Sensitive data is not exposed in responses
