# Environment Setup

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose
- Supabase account

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd schoolos

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials

# Start infrastructure (PostgreSQL + Redis)
pnpm docker:dev

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed the database
pnpm db:seed

# Start development
pnpm dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `DIRECT_DATABASE_URL` | Direct PostgreSQL connection | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Yes |

## Docker

```bash
# Development environment
pnpm docker:dev

# Production build
pnpm docker:prod

# Individual services
docker compose -f docker/development/docker-compose.yml up postgres redis
```
