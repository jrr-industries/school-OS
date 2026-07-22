import { NextResponse } from 'next/server';
import { prisma } from '@schoolos/database';
import { getDevSession } from '@/lib/dev-session';

export async function GET() {
  try {
    const session = await getDevSession();
    if (!session || session.role !== 'SCHOOL_ADMIN' || !session.schoolId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [school, employees] = await Promise.all([
      prisma.school.findUnique({
        where: { id: session.schoolId },
        select: { settings: true },
      }),
      prisma.employee.findMany({
        where: { schoolId: session.schoolId, deletedAt: null },
        include: {
          designation: { select: { title: true } },
          department: { select: { name: true } },
          user: { select: { name: true, email: true, avatar: true, phone: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const settings = (school?.settings as Record<string, unknown>) ?? {};
    const salaryData = (settings.salaryData as Record<string, unknown>) ?? {};
    const attendanceLogs = (settings.attendanceLogs as Record<string, unknown>[]) ?? [];
    const payrollRecords = (settings.payrollRecords as Record<string, unknown>[]) ?? [];
    const employeeSalaries = (settings.employeeSalaries as Record<string, unknown>[]) ?? [];

    const employeeList = employees.map((e) => ({
      id: e.id,
      employeeCode: e.employeeId,
      name: e.user?.name || `${e.firstName} ${e.lastName}`,
      email: e.user?.email || e.email || '',
      avatar: e.user?.avatar || e.photo || '',
      designation: e.designation?.title || 'Unknown',
      department: e.department?.name || 'Unassigned',
      joiningDate: e.joiningDate?.toISOString?.() || e.createdAt.toISOString(),
      status: e.status,
    }));

    const presentToday = attendanceLogs.filter((a: any) => {
      const d = new Date(a.date);
      const today = new Date();
      return d.toDateString() === today.toDateString() && a.status === 'present';
    }).length;
    const lateToday = attendanceLogs.filter((a: any) => {
      const d = new Date(a.date);
      const today = new Date();
      return d.toDateString() === today.toDateString() && a.status === 'late';
    }).length;
    const absentToday = employeeList.length - presentToday - lateToday;

    return NextResponse.json({
      success: true,
      data: {
        employees: employeeList,
        totalEmployees: employeeList.length,
        presentToday,
        lateToday,
        absentToday,
        attendanceLogs,
        payrollRecords,
        employeeSalaries,
        salaryData,
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
    const { attendanceLog, payrollRecord, employeeSalary } = body;

    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { settings: true },
    });

    const settings = (school?.settings as Record<string, unknown>) ?? {};

    if (attendanceLog) {
      const logs = (settings.attendanceLogs as Record<string, unknown>[]) ?? [];
      const idx = logs.findIndex((l: any) => l.employeeCode === attendanceLog.employeeCode && l.date === attendanceLog.date);
      if (idx >= 0) logs[idx] = attendanceLog;
      else logs.push(attendanceLog);
      settings.attendanceLogs = logs;
    }

    if (payrollRecord) {
      const records = (settings.payrollRecords as Record<string, unknown>[]) ?? [];
      const idx = records.findIndex((r: any) => r.employeeCode === payrollRecord.employeeCode && r.month === payrollRecord.month && r.year === payrollRecord.year);
      if (idx >= 0) records[idx] = payrollRecord;
      else records.push(payrollRecord);
      settings.payrollRecords = records;
    }

    if (employeeSalary) {
      const salaries = (settings.employeeSalaries as Record<string, unknown>[]) ?? [];
      const idx = salaries.findIndex((s: any) => s.employeeCode === employeeSalary.employeeCode);
      if (idx >= 0) salaries[idx] = employeeSalary;
      else salaries.push(employeeSalary);
      settings.employeeSalaries = salaries;
    }

    if (body.salaryData) {
      settings.salaryData = body.salaryData;
    }

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
