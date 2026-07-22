import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || !['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(session.role) || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const school = await prisma.school.findUnique({
      where: { id: session.schoolId }, select: { settings: true },
    });

    const settings = (school?.settings as Record<string, unknown>) ?? {};
    const facilitiesData = (settings.facilitiesData as Record<string, unknown>) ?? {};

    const assets = (facilitiesData.assets as any[]) || (facilitiesData.facilities as any[]) || [];
    const requests = (facilitiesData.requests as any[]) || (facilitiesData.maintenanceRequests as any[]) || [];

    return NextResponse.json({
      success: true,
      data: {
        assets,
        cctv: (facilitiesData.cctv as Record<string, unknown>) || { totalCameras: 0, activeCameras: 0, status: 'active' },
        internet: (facilitiesData.internet as Record<string, unknown>) || { status: 'up', speed: '0 Mbps', provider: 'N/A' },
        powerBackup: (facilitiesData.powerBackup as Record<string, unknown>) || { status: 'active', capacity: '0 kVA', lastTested: 'N/A' },
        waterSupply: (facilitiesData.waterSupply as Record<string, unknown>) || { status: 'active', source: 'N/A', tankLevel: 0 },
        requests,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const school = await prisma.school.findUnique({
      where: { id: session.schoolId }, select: { settings: true },
    });
    const settings = (school?.settings as Record<string, unknown>) ?? {};
    settings.facilitiesData = body;
    await prisma.school.update({
      where: { id: session.schoolId },
      data: { settings: JSON.parse(JSON.stringify(settings)) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 },
    );
  }
}
