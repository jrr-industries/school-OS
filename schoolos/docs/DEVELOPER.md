# Developer Guide

## Getting Started

```bash
pnpm dev
```

This starts all apps in development mode:
- Web: http://localhost:3000
- Admin: http://localhost:3001

## Project Structure

```
schoolos/
├── apps/
│   ├── web/          # Main Next.js application
│   └── admin/        # Admin dashboard
├── packages/
│   ├── ui/           # Design system components
│   ├── database/     # Prisma & repositories
│   ├── auth/         # Authentication
│   ├── api/          # API utilities
│   ├── config/       # Environment config
│   ├── types/        # TypeScript types
│   ├── utils/        # Utilities
│   ├── permissions/  # RBAC system
│   ├── hooks/        # React hooks & stores
│   ├── constants/    # System constants
│   └── validation/   # Zod schemas
├── prisma/           # Database schema & seeds
├── docker/           # Docker configurations
└── docs/             # Documentation
```

## Adding a New Feature

1. Create feature folder: `src/features/<feature-name>/`
2. Add types to `@schoolos/types`
3. Add validation to `@schoolos/validation`
4. Create repository in `@schoolos/database`
5. Create service in the feature folder
6. Create API routes in `app/api/<feature-name>/`
7. Create UI components in `src/features/<feature-name>/components/`

## Code Standards

- Strict TypeScript - no `any` types
- Feature-based folder structure
- Repository pattern for data access
- Zod schemas for validation
- Standardized API responses
- Every table has school_id for tenant isolation

## Testing

```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# All tests
pnpm test
```

## Commit Convention

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `chore:` Maintenance
- `docs:` Documentation
- `refactor:` Code restructuring
- `test:` Testing
