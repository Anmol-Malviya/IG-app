# Module: User

## Purpose
Manages user profiles, listing, and deactivation. Provides both self-service endpoints (authenticated users managing their own profile) and admin endpoints (listing/managing all users).

## API Endpoints

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/api/users/me` | ✓ | Any | Get current user profile |
| PUT | `/api/users/me` | ✓ | Any | Update current user profile |
| GET | `/api/users` | ✓ | Admin+ | List all users (paginated) |
| GET | `/api/users/:id` | ✓ | Admin+ | Get user by ID |
| DELETE | `/api/users/:id` | ✓ | Admin+ | Deactivate user (soft delete) |

## Database Model
- **Collection**: `users`
- **Key Fields**: email (unique, indexed), password (hashed, excluded from queries), role, tenantId, isActive

## Dependencies
- `shared/utils/crypto` — password hashing
- `shared/utils/apiResponse` — standardized responses
- `middleware/auth.middleware` — JWT verification
- `middleware/rbac.middleware` — role-based access control
- `middleware/validator` — Zod request validation

## Changelog
- **2026-08-07**: Initial implementation with CRUD + pagination
