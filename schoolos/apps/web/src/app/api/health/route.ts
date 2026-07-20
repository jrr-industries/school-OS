import { prisma } from '@schoolos/database';
import { ApiResponse } from '@schoolos/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    const duration = Date.now() - startTime;

    return ApiResponse.success({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      responseTime: `${duration}ms`,
      environment: process.env.NODE_ENV ?? 'development',
      version: '1.0.0',
    });
  } catch (error) {
    return ApiResponse.error(
      503,
      'SERVICE_UNAVAILABLE',
      'Database connection failed',
    );
  }
}
