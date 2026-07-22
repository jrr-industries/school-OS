import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

const SYSTEM_SCHOOL_ID = '00000000-0000-0000-0000-000000000000';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const settings = await prisma.setting.findMany({
      where: { schoolId: SYSTEM_SCHOOL_ID, deletedAt: null },
      orderBy: { group: 'asc' },
    });

    const grouped: Record<string, Record<string, unknown>> = {};
    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = {};
      grouped[s.group][s.key] = s.value;
    }

    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch settings';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Only available in development mode' },
      { status: 403 },
    );
  }

  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { settings } = body as {
      settings: { key: string; value: unknown; group: string }[];
    };

    if (!Array.isArray(settings) || settings.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Body must contain a non-empty settings array with { key, value, group }' },
        { status: 400 },
      );
    }

    const results = await Promise.all(
      settings.map((s) =>
        prisma.setting.upsert({
          where: {
            schoolId_key: { schoolId: SYSTEM_SCHOOL_ID, key: s.key },
          },
          update: { value: s.value as any, group: s.group },
          create: {
            schoolId: SYSTEM_SCHOOL_ID,
            key: s.key,
            value: s.value as any,
            group: s.group,
            createdBy: session.id,
          },
        }),
      ),
    );

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to save settings';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
