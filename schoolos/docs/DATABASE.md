# Database Guide

## Schema Overview

All tables follow the base model pattern:

```prisma
id          String    @id @default(uuid())
school_id   String    @map("school_id")
created_at  DateTime  @default(now())
updated_at  DateTime  @updatedAt
deleted_at  DateTime?
created_by  String?
updated_by  String?
version     Int       @default(1)
```

## Core Tables

### schools
Multi-tenant root entity. All data is scoped to a school.

### users & profiles
User accounts with profile information. Linked to school.

### roles & permissions
RBAC system with role-permission assignments.

### subscriptions & subscription_plans
Billing and feature access control.

### audit_logs
Immutable audit trail for all actions.

## Migrations

```bash
# Create migration
pnpm db:migrate --name migration_name

# Apply migrations
pnpm db:migrate:prod

# Push schema (dev)
pnpm db:push
```

## Seeding

```bash
pnpm db:seed
```

## Best Practices

1. Always use the repository pattern for data access
2. Never bypass tenant scoping
3. Use soft deletes (deleted_at) instead of hard deletes
4. Include created_by/updated_by for audit trail
5. Version field helps with optimistic concurrency
