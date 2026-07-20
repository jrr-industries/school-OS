# SchoolOS Architecture Guide

## Overview

SchoolOS is an enterprise-grade multi-tenant SaaS platform designed for school management. The architecture follows clean architecture principles with a modular monorepo structure.

## Architecture Principles

- **Separation of Concerns**: Each package has a single responsibility
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Repository Pattern**: Data access is abstracted behind repositories
- **Feature-Based Structure**: Code is organized by feature, not by type
- **Tenant Isolation**: Every query is scoped by school_id

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │    Web    │  │   Admin  │  │ Mobile   │                 │
│  │  (Next.js)│  │ (Next.js)│  │  (PWA)   │                 │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                 │
├───────┴──────────────┴──────────────┴──────────────────────┤
│                      API Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Next.js Route Handlers                    │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │  │
│  │  │  Auth   │ │  Users  │ │ Schools │ │  More   │   │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│                    Service Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AuthService  │  UserService  │  SchoolService       │  │
│  │  Permission   │  Session      │  Audit               │  │
│  └──────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│                   Repository Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  BaseRepository  │  SchoolRepository  │  UserRepo    │  │
│  └──────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│                     Data Layer                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  Prisma  │  │ Supabase │  │  Redis   │                 │
│  │  (ORM)   │  │  (Auth)  │  │ (Cache)  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└────────────────────────────────────────────────────────────┘
```

## Module Structure

### Packages

| Package | Responsibility |
|---------|---------------|
| `@schoolos/ui` | Reusable UI components, design system |
| `@schoolos/database` | Prisma client, repository pattern |
| `@schoolos/auth` | Authentication, session management |
| `@schoolos/api` | API handlers, response formatting |
| `@schoolos/config` | Environment validation |
| `@schoolos/types` | Shared TypeScript types |
| `@schoolos/utils` | Utility functions |
| `@schoolos/permissions` | RBAC, permission checking |
| `@schoolos/hooks` | React hooks, Zustand stores |
| `@schoolos/constants` | System constants, enums |
| `@schoolos/validation` | Zod schemas |

### Multi-Tenancy

Every database table includes `school_id` and all queries are automatically scoped:

```typescript
// Repository pattern auto-scopes by school_id
const users = await userRepository.findAll(schoolId, {
  page: 1,
  limit: 10,
});
```

## Data Flow

1. Client makes request to Next.js Route Handler
2. Middleware extracts tenant context and validates auth
3. API handler validates input via Zod schemas
4. Service layer processes business logic
5. Repository layer queries database through Prisma
6. Response is formatted and returned

## Security

- All API responses use a standardized wrapper
- Input validation at the edge via Zod
- RBAC enforced at API and UI level
- Rate limiting on all public endpoints
- Helmet security headers
- Content Security Policy
