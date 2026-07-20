# SchoolOS

Enterprise Multi-Tenant School Management Platform

## Overview

SchoolOS is a production-ready, enterprise-grade SaaS platform designed to manage 10,000+ schools and 10+ million students. Built with Next.js 15, TypeScript, and a modular monorepo architecture.

## Architecture

- **Monorepo**: pnpm workspaces with shared packages
- **Frontend**: Next.js 15, React 19, TailwindCSS, shadcn/ui
- **Backend**: Next.js Route Handlers, Prisma ORM
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth + JWT
- **Cache**: Redis
- **State**: TanStack Query + Zustand
- **Validation**: Zod

## Structure

```
schoolos/
├── apps/         # Applications (web, admin, mobile-pwa)
├── packages/     # Shared packages (ui, auth, api, database, etc.)
├── prisma/       # Database schema and migrations
├── docker/       # Docker configurations
└── docs/         # Documentation
```

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm docker:dev
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [Database Guide](docs/DATABASE.md)
- [Developer Guide](docs/DEVELOPER.md)
- [Contributing Guide](docs/CONTRIBUTING.md)

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15, React 19 |
| Language | TypeScript (strict) |
| Styling | TailwindCSS, shadcn/ui |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Supabase Auth |
| Cache | Redis |
| State | TanStack Query, Zustand |
| Validation | Zod |
| Forms | React Hook Form |
| Testing | Vitest, Playwright |
| CI/CD | GitHub Actions |
| Deployment | Docker, Docker Compose |

## License

MIT
