# Module: Auth

## Purpose
Handles user authentication — registration, login, token refresh, and logout. Uses JWT for stateless authentication with access + refresh token pattern.

## API Endpoints

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| POST | `/api/auth/register` | ✗ | 10/15min | Register new user |
| POST | `/api/auth/login` | ✗ | 10/15min | Login, returns JWT pair |
| POST | `/api/auth/refresh` | ✗ | 10/15min | Refresh access token |
| POST | `/api/auth/logout` | ✓ | 10/15min | Logout (client token removal) |

## Security
- Passwords hashed with bcryptjs (12 rounds)
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Strict rate limiting (10 requests per 15 minutes)
- Login uses same error message for wrong email/password to prevent user enumeration

## Dependencies
- `modules/user/user.model` — User Mongoose model
- `shared/utils/crypto` — password hashing, JWT generation
- `middleware/validator` — Zod request validation
- `middleware/rateLimiter` — auth rate limiter

## Changelog
- **2026-08-07**: Initial implementation with register, login, refresh, logout
