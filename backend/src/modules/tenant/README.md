# Module: Tenant

## Purpose
Multi-tenant management — create, read, update, delete tenants. All operations restricted to superadmin role.

## API Endpoints

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/api/tenants` | ✓ | SuperAdmin | Create a new tenant |
| GET | `/api/tenants` | ✓ | SuperAdmin | List all tenants (paginated) |
| GET | `/api/tenants/:id` | ✓ | SuperAdmin | Get tenant by ID |
| PUT | `/api/tenants/:id` | ✓ | SuperAdmin | Update tenant |
| DELETE | `/api/tenants/:id` | ✓ | SuperAdmin | Delete tenant |

## Database Model
- **Collection**: `tenants`
- **Key Fields**: name, slug (unique, indexed), domain, plan (free/starter/pro/enterprise), isActive, settings (maxUsers, features)

## Dependencies
- `middleware/auth.middleware` — JWT verification
- `middleware/rbac.middleware` — superadmin authorization
- `middleware/validator` — Zod request validation

## Changelog
- **2026-08-07**: Initial implementation with full CRUD
