import { prisma } from '@/lib/prisma/client';
import type { AuditAction } from '@/generated/prisma';

interface AuditEntry {
  action: AuditAction;
  entity: string;
  entityId: string;
  data?: Record<string, unknown>;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
}

export async function createAuditLog(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        data: entry.data ?? {},
        userId: entry.userId ?? null,
        userEmail: entry.userEmail ?? null,
        ipAddress: entry.ipAddress ?? null,
      },
    });
  } catch (error) {
    // Audit logging should never break the main operation
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Middleware-style wrapper that creates an audit log after a successful operation.
 */
export async function withAudit<T>(
  action: AuditAction,
  entity: string,
  operation: () => Promise<{ id: string; data?: Record<string, unknown> }>,
  context?: { userId?: string; userEmail?: string; ipAddress?: string },
): Promise<T> {
  const result = await operation();
  await createAuditLog({
    action,
    entity,
    entityId: result.id,
    data: result.data,
    ...context,
  });
  return result as unknown as T;
}
