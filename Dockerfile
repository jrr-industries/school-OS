# =============================================================================
# SchoolOS — Multi-stage Dockerfile
# =============================================================================
# Stage 1: base — shared foundation for all stages
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Install minimal tooling for health checks
RUN apk add --no-cache wget

# =============================================================================
# Stage 2: deps — install ALL dependencies (cached via lockfile)
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm fetch --frozen-lockfile && \
    pnpm install --frozen-lockfile --offline

# =============================================================================
# Stage 3: build — compile the Next.js application
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @schoolos/web build

# =============================================================================
# Stage 4: production — minimal runtime image (standalone)
FROM base AS production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Copy standalone server + compiled app
COPY --from=build /app/apps/web/.next/standalone ./
# Copy static assets (not bundled in standalone by default)
COPY --from=build /app/apps/web/.next/static ./.next/static
# Copy public assets
COPY --from=build /app/apps/web/public ./public

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]

# =============================================================================
# Stage 5: development — hot-reload with mounted source
FROM base AS development
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm fetch --frozen-lockfile && \
    pnpm install --frozen-lockfile --offline

ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["pnpm", "--filter", "@schoolos/web", "dev"]
