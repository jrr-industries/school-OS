import { NextResponse } from 'next/server';
import { getDevSession } from '@/lib/dev-session';
import { prisma } from '@schoolos/database';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const session = await getDevSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user?.id ?? session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        schoolId: session.schoolId,
        schoolName: session.schoolName,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to get session' },
      { status: 500 },
    );
  }
}