# SchoolOS — Docker Development & Production Environment

## Folder Structure

```
project-1/
├── Dockerfile                  # Multi-stage Dockerfile for the frontend (Next.js)
├── Dockerfile.backend          # Template Dockerfile for the backend API
├── .dockerignore               # Global ignore rules for Docker builds
├── .env.example                # Environment variable template
├── docker-compose.yml          # Development Docker Compose
├── docker-compose.prod.yml     # Production Docker Compose override
├── docs/
│   └── docker.md               # This file
├── apps/
│   └── web/                    # Next.js frontend application
├── backend/                    # Backend API scaffold (empty — not yet implemented)
├── packages/
│   └── shared/                 # Shared package scaffold (empty)
├── database/                   # Database scripts scaffold (empty)
├── package.json                # Root package.json (pnpm workspace)
├── pnpm-lock.yaml              # Lockfile
└── pnpm-workspace.yaml         # Workspace configuration
```

---

## Docker Architecture

```
                        schoolos-network (bridge)
       ┌───────────────────────┬───────────────────────┐
       │                       │                       │
  schoolos-frontend      schoolos-postgres       schoolos-redis
   (Next.js :3000)       (PostgreSQL :5432)      (Redis :6379)
       │                       │
       │                  schoolos-pgadmin
       │                 (pgAdmin :5050)
       │
  schoolos-backend (optional, not yet implemented)
```

### Communication

Services communicate using **service names** (not `localhost`):
- Frontend → Postgres: `postgres:5432`
- Frontend → Redis: `redis:6379`
- Backend → Postgres: `postgres:5432`
- Backend → Redis: `redis:6379`
- pgAdmin → Postgres: `postgres:5432`

---

## Services

| Service    | Container Name        | Image / Build                        | Port  | Purpose                       |
|------------|-----------------------|--------------------------------------|-------|-------------------------------|
| `frontend` | `schoolos-frontend`   | `Dockerfile` target `development`    | 3000  | Next.js web application       |
| `postgres` | `schoolos-postgres`   | `postgres:16-alpine`                 | 5432  | Primary database               |
| `redis`    | `schoolos-redis`      | `redis:7-alpine`                     | 6379  | Cache, sessions, queue broker |
| `pgadmin`  | `schoolos-pgadmin`    | `dpage/pgadmin4:latest`              | 5050  | Database management UI        |
| `backend`  | `schoolos-backend`    | `Dockerfile.backend` target `dev`    | 4000  | API server (not yet enabled)  |

---

## Ports

| Service   | Internal | External (host) | Override env var   |
|-----------|----------|-----------------|--------------------|
| Frontend  | 3000     | 3000            | `FRONTEND_PORT`    |
| Backend   | 4000     | 4000            | `BACKEND_PORT`     |
| PostgreSQL| 5432     | 5432            | `POSTGRES_PORT`    |
| Redis     | 6379     | 6379            | `REDIS_PORT`       |
| pgAdmin   | 80       | 5050            | `PGADMIN_PORT`     |

Override any port by setting the environment variable in `.env`:
```
FRONTEND_PORT=8080
POSTGRES_PORT=5433
```

---

## Networks

| Network              | Driver | Scope     |
|----------------------|--------|-----------|
| `schoolos-network`   | bridge | local     |

All services are connected to a single bridge network. Service names (e.g. `postgres`, `redis`) are resolvable as hostnames from any container on the network.

---

## Volumes

| Volume             | Mount Point                        | Purpose                          |
|--------------------|------------------------------------|----------------------------------|
| `postgres_data`    | `/var/lib/postgresql/data`         | Persistent database storage      |
| `redis_data`       | `/data`                            | Persistent Redis data            |
| `pgadmin_data`     | `/var/lib/pgadmin`                 | pgAdmin configuration & sessions |

All volumes are **named** and persist across container restarts.

---

## Environment Variables

Requires a `.env` file at the project root (copy from `.env.example`):

| Variable                  | Default                        | Description                              |
|---------------------------|--------------------------------|------------------------------------------|
| `POSTGRES_USER`           | `schoolos`                     | PostgreSQL user                          |
| `POSTGRES_PASSWORD`       | `schoolos`                     | PostgreSQL password                      |
| `POSTGRES_DB`             | `schoolos`                     | PostgreSQL database name                 |
| `POSTGRES_PORT`           | `5432`                         | PostgreSQL host port                     |
| `REDIS_PORT`              | `6379`                         | Redis host port                          |
| `REDIS_PASSWORD`          | *(empty)*                      | Redis password (production)              |
| `PGADMIN_EMAIL`           | `admin@schoolos.com`           | pgAdmin login email                      |
| `PGADMIN_PASSWORD`        | `admin`                        | pgAdmin login password                   |
| `PGADMIN_PORT`            | `5050`                         | pgAdmin host port                        |
| `FRONTEND_PORT`           | `3000`                         | Frontend host port                       |
| `NEXT_PUBLIC_API_URL`     | `http://localhost:4000/api`    | Public API URL for the frontend          |
| `BACKEND_PORT`            | `4000`                         | Backend host port                        |
| `REDIS_URL`               | `redis://redis:6379`           | Redis connection string (inside Docker)  |
| `JWT_SECRET`              | *(must change)*                | JWT signing secret                       |
| `JWT_EXPIRES_IN`          | `7d`                           | JWT token expiration                     |
| `NODE_ENV`                | `development`                  | Node environment                         |
| `LOG_LEVEL`               | `debug`                        | Logging level                            |

**Never hardcode secrets.** Always use environment variables or a `.env` file.

---

## Dockerfile — Multi-stage Build

The `Dockerfile` for the frontend uses **5 stages**:

| Stage          | Purpose                                              |
|----------------|------------------------------------------------------|
| `base`         | Node.js 22 Alpine + pnpm + minimal system tools      |
| `deps`         | Install all dependencies (cached via `pnpm fetch`)   |
| `build`        | Compile the Next.js application                      |
| `production`   | Minimal runtime with standalone server (non-root)   |
| `development`  | Development image with dependencies (source mounted) |

### Layer Caching

- `pnpm-lock.yaml` and `package.json` are copied **before** source code
- `pnpm fetch` is used for optimal layer caching
- Source code changes do NOT invalidate the dependency layer

---

## Development Workflow

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v24+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.20+)

### First-time Setup

```bash
# 1. Clone the repository
git clone https://github.com/jrr-industries/school-OS.git
cd school-OS

# 2. Create environment file
cp .env.example .env

# 3. Build and start all services
docker compose up --build

# 4. Access the application
# Frontend:  http://localhost:3000
# pgAdmin:   http://localhost:5050 (admin@schoolos.com / admin)
```

### Common Commands

```bash
# Start services in the background
docker compose up -d

# View logs for all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f frontend

# Rebuild a single service
docker compose build frontend

# Restart a service
docker compose restart frontend

# Stop services without removing containers
docker compose stop

# Stop and remove containers, networks, volumes
docker compose down -v

# List running containers
docker compose ps

# Execute a command inside a running container
docker compose exec frontend sh

# Access PostgreSQL
docker compose exec postgres psql -U schoolos -d schoolos

# Access Redis
docker compose exec redis redis-cli
```

### Hot Reload

The frontend uses Next.js's built-in **Fast Refresh** (hot module replacement). Changes to source files in `apps/web/src/` are reflected immediately without restarting the container.

### Adding Dependencies

```bash
# Install new dependency
docker compose exec frontend pnpm add some-package --filter @schoolos/web

# Rebuild the image if needed
docker compose build frontend
```

If you add a dependency, rebuild the Docker image to ensure the container has it:

```bash
docker compose up --build -d frontend
```

---

## Production Deployment

### Build & Run Production

```bash
# Build and start in production mode
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

### Production Override Differences

| Aspect          | Development                    | Production                              |
|-----------------|--------------------------------|-----------------------------------------|
| Build target    | `development`                  | `production` (standalone mode)          |
| Volume mounts   | Source code mounted for HMR    | No volumes — code is in the image       |
| Image size      | ~1.5 GB (includes dev deps)    | ~150 MB (standalone, minimal deps)      |
| Restart policy  | `unless-stopped`               | `always`                                |
| Redis           | No password                    | Requires `REDIS_PASSWORD`               |
| Volumes         | Docker-generated names         | Named with `schoolos_` prefix           |
| Network         | Default bridge                 | Named `schoolos_production_network`     |

### Production Checklist

- [ ] Change all default passwords in `.env`
- [ ] Set a strong `JWT_SECRET` (64+ random characters)
- [ ] Set `REDIS_PASSWORD` for production Redis
- [ ] Configure a reverse proxy (Nginx, Traefik) in front of the frontend
- [ ] Enable SSL/TLS termination
- [ ] Set up regular PostgreSQL backups
- [ ] Monitor logs with a centralized solution (ELK, Grafana Loki, etc.)
- [ ] Configure resource limits in Docker Compose

---

## Backend — Getting Started

The backend scaffold exists at `backend/` but has **no package.json or source code yet**. To enable it:

1. Create `backend/package.json` with a `@schoolos/backend` package
2. Implement the application entry point (e.g. `backend/src/index.ts`)
3. Configure a build step that outputs to `backend/dist/`
4. Uncomment the `backend` service block in `docker-compose.yml`
5. Run: `docker compose --profile backend up --build`

---

## Troubleshooting

### Container exits immediately

Check logs:
```bash
docker compose logs frontend
```

### Port already in use

Change the host port in `.env`:
```
FRONTEND_PORT=3001
POSTGRES_PORT=5433
```

### Volume permission issues

On Linux, PostgreSQL may fail to write to the mounted volume. Fix:
```bash
docker compose down
docker volume rm schoolos_postgres_data  # or list with `docker volume ls`
docker compose up -d
```

### pnpm install fails in Docker

Clear the Docker build cache:
```bash
docker compose build --no-cache frontend
```

### Slow startup for the frontend

The first build installs all dependencies. Subsequent builds are cached. To speed up:
```bash
docker compose build --build-arg NODE_ENV=development frontend
```

### Next.js standalone mode not working

If `server.js` exits immediately, ensure `next.config.ts` has `output: 'standalone'` (already configured). If paths are wrong, adjust the `COPY` commands in the production stage of `Dockerfile`.

---

## Performance Optimizations

- **Docker layer caching**: lockfile and `package.json` are copied before source code
- **`pnpm fetch`**: downloads packages without linking, enabling better caching
- **Multi-stage builds**: build deps are isolated from the runtime image
- **Standalone output**: Next.js standalone mode produces a minimal server bundle
- **Alpine base images**: ~80% smaller than Debian-based alternatives
- **Non-root user**: Improved security (user `nextjs` in production)

---

## Security Considerations

- Containers run as **non-root** users in production
- No unnecessary ports are exposed to the host
- Secrets are passed via environment variables (never hardcoded)
- pgAdmin is bound to `localhost` only by default for dev (override for production)
- All base images are official and minimal (Alpine variants)
- Log rotation prevents disk exhaustion
