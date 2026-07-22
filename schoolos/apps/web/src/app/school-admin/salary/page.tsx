'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users, Briefcase, Clock, BadgePercent,
  Calculator, Building2, DollarSign, Banknote, UserCheck,
  UserX, Download, Plus, Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, cn } from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { toast } from 'sonner';

interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  avatar: string;
  designation: string;
  department: string;
  joiningDate: string;
  status: string;
}

interface AttendanceLog {
  employeeCode: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  status: string;
}

interface PayrollRecord {
  employeeCode: string;
  employeeName: string;
  basicSalary: number;
  present: number;
  late: number;
  halfDay: number;
  absent: number;
  paidLeave: number;
  unpaidLeave: number;
  overtime: number;
  allowances: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  month: string;
  year: number;
  processed: boolean;
}

interface EmployeeSalary {
  employeeCode: string;
  employeeName: string;
  designation: string;
  department: string;
  basicSalary: number;
  hra: number;
  da: number;
  transport: number;
  pf: number;
  esi: number;
  bankAccount: string;
  ifsc: string;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);
}

export default function PayrollPage() {
  const { schoolId, loading: authLoading } = useSchoolAdminAuth();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [employeeSalaries, setEmployeeSalaries] = useState<EmployeeSalary[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'attendance' | 'payroll'>('overview');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showPayslip, setShowPayslip] = useState<PayrollRecord | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/school-admin/salary');
      const json = await res.json();
      if (json.success) {
        setEmployees(json.data.employees || []);
        setAttendanceLogs(json.data.attendanceLogs || []);
        setPayrollRecords(json.data.payrollRecords || []);
        setEmployeeSalaries(json.data.employeeSalaries || []);
      }
    } catch {
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!authLoading && schoolId) fetchData(); }, [authLoading, schoolId]);

  const totalBasic = useMemo(() => employeeSalaries.reduce((s, e) => s + e.basicSalary, 0), [employeeSalaries]);
  const processedCount = useMemo(() => payrollRecords.filter((r) => r.processed).length, [payrollRecords]);
  const presentToday = useMemo(() => attendanceLogs.filter((a) => {
    const d = new Date(a.date); return d.toDateString() === new Date().toDateString() && (a.status === 'present' || a.status === 'late');
  }).length, [attendanceLogs]);
  const lateToday = useMemo(() => attendanceLogs.filter((a) => a.status === 'late').length, [attendanceLogs]);

  const filteredEmps = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeCode.toLowerCase().includes(search.toLowerCase())
  );

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const processPayroll = async (emp: Employee) => {
    const salary = employeeSalaries.find((s) => s.employeeCode === emp.employeeCode);
    if (!salary) { toast.error('Set salary details first'); return; }

    const monthAttendance = attendanceLogs.filter((a) => {
      const d = new Date(a.date);
      return a.employeeCode === emp.employeeCode && d.getMonth() === new Date().getMonth() && d.getFullYear() === currentYear;
    });

    const present = monthAttendance.filter((a) => a.status === 'present').length;
    const late = monthAttendance.filter((a) => a.status === 'late').length;
    const absent = monthAttendance.filter((a) => a.status === 'absent').length;
    const halfDay = monthAttendance.filter((a) => a.status === 'half_day').length;
    const overtime = monthAttendance.reduce((s, a) => {
      if (!a.checkIn || !a.checkOut) return s;
      const [inH, inM] = a.checkIn.split(':').map(Number);
      const [outH, outM] = a.checkOut.split(':').map(Number);
      const hrs = (outH * 60 + outM - inH * 60 - inM) / 60 - 8;
      return s + Math.max(0, Math.round(hrs));
    }, 0);

    const perDay = salary.basicSalary / 26;
    const grossSalary = salary.basicSalary + salary.hra + salary.da + salary.transport;
    const deductionAmount = (absent + halfDay * 0.5) * perDay;
    const netSalary = grossSalary - deductionAmount - salary.pf - salary.esi;

    const record: PayrollRecord = {
      employeeCode: emp.employeeCode,
      employeeName: emp.name,
      basicSalary: salary.basicSalary,
      present, late, halfDay, absent,
      paidLeave: 0, unpaidLeave: 0,
      overtime,
      allowances: salary.hra + salary.da + salary.transport,
      deductions: deductionAmount + salary.pf + salary.esi,
      grossSalary,
      netSalary: Math.max(0, netSalary),
      month: currentMonth,
      year: currentYear,
      processed: true,
    };

    try {
      const res = await fetch('/api/school-admin/salary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payrollRecord: record }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Payroll processed for ${emp.name}`);
        fetchData();
      } else toast.error(json.error || 'Failed');
    } catch {
      toast.error('Failed to process payroll');
    }
  };

  const saveSalary = async (salary: EmployeeSalary) => {
    try {
      const res = await fetch('/api/school-admin/salary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeSalary: salary }),
      });
      const json = await res.json();
      if (json.success) { toast.success('Salary details saved'); fetchData(); setShowSalaryModal(false); }
      else toast.error(json.error || 'Failed');
    } catch { toast.error('Failed to save'); }
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: DollarSign },
    { id: 'employees' as const, label: 'Employees', icon: Users },
    { id: 'attendance' as const, label: 'Attendance', icon: Clock },
    { id: 'payroll' as const, label: 'Payroll', icon: Calculator },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Salary & Payroll</h1>
          <p className="text-sm text-muted-foreground">Biometric attendance integration & automated payroll</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5"><Clock className="h-3 w-3" /> {currentMonth} {currentYear}</Badge>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <CardContent className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/30"><Briefcase className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Total Employees</p><p className="text-xl font-bold">{employees.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900/30"><UserCheck className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Present Today</p><p className="text-xl font-bold text-emerald-600">{presentToday}</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-amber-100 p-2.5 text-amber-600 dark:bg-amber-900/30"><Clock className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Late Today</p><p className="text-xl font-bold text-amber-600">{lateToday}</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-red-100 p-2.5 text-red-600 dark:bg-red-900/30"><UserX className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Absent Today</p><p className="text-xl font-bold text-red-600">{employees.length - presentToday - lateToday}</p></div></div></CardContent></Card>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-purple-100 p-2.5 text-purple-600"><Calculator className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Total Basic Salary</p><p className="text-xl font-bold">{formatINR(totalBasic)}</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-green-100 p-2.5 text-green-600"><BadgePercent className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Payroll Processed</p><p className="text-xl font-bold">{processedCount}/{employees.length}</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-indigo-100 p-2.5 text-indigo-600"><Building2 className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Avg Salary/Employee</p><p className="text-xl font-bold">{employees.length > 0 ? formatINR(Math.round(totalBasic / employees.length)) : '₹0'}</p></div></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-cyan-100 p-2.5 text-cyan-600"><Banknote className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">Monthly Payroll</p><p className="text-xl font-bold">{formatINR(totalBasic)}</p></div></div></CardContent></Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="text-sm font-medium">Biometric Attendance Integration</CardTitle></CardHeader>
                <CardContent>
                  <div className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
                    <div className="flex justify-center mb-3"><div className="rounded-lg bg-muted p-3"><Clock className="h-8 w-8" /></div></div>
                    <h3 className="font-medium mb-1">Connect Biometric Device</h3>
                    <p className="text-sm mb-4">Sync attendance logs from fingerprint, face recognition, or RFID devices automatically.</p>
                    <div className="grid gap-3 sm:grid-cols-3 max-w-lg mx-auto text-left text-sm">
                      <div className="rounded-lg border p-3"><p className="font-medium text-xs text-muted-foreground">Step 1</p><p>Connect device via API</p></div>
                      <div className="rounded-lg border p-3"><p className="font-medium text-xs text-muted-foreground">Step 2</p><p>Auto-sync punch logs</p></div>
                      <div className="rounded-lg border p-3"><p className="font-medium text-xs text-muted-foreground">Step 3</p><p>Payroll auto-calculated</p></div>
                    </div>
                    <Button variant="outline" className="mt-4 gap-2" onClick={() => toast.info('Biometric integration coming soon')}>
                      <Plus className="h-4 w-4" /> Configure Device
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Button size="sm" className="gap-2" onClick={() => setShowSalaryModal(true)}>
                  <Plus className="h-4 w-4" /> Set Salary
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3 text-right">Basic Salary</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {filteredEmps.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No employees found</td></tr>
                    ) : filteredEmps.map((emp) => {
                      const salary = employeeSalaries.find((s) => s.employeeCode === emp.employeeCode);
                      return (
                        <tr key={emp.id} className="group hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">{emp.name.charAt(0)}</div>
                              <div><p className="font-medium">{emp.name}</p><p className="text-xs text-muted-foreground">{emp.email}</p></div>
                            </div>
                          </td>
                          <td className="px-4 py-3"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{emp.employeeCode}</code></td>
                          <td className="px-4 py-3">{emp.designation}</td>
                          <td className="px-4 py-3 text-muted-foreground">{emp.department}</td>
                          <td className="px-4 py-3 text-right font-medium">{salary ? formatINR(salary.basicSalary) : '—'}</td>
                          <td className="px-4 py-3 text-center"><Badge variant={emp.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">{emp.status}</Badge></td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
                                setSelectedEmp(emp);
                                setShowSalaryModal(true);
                              }}>Salary</Button>
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={async () => {
                                const rec = payrollRecords.find((r) => r.employeeCode === emp.employeeCode && r.month === currentMonth && r.year === currentYear);
                                if (rec) setShowPayslip(rec);
                                else { await processPayroll(emp); }
                              }}>Process</Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Biometric attendance logs — auto-synced from device. Click status to toggle.</p>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Check In</th>
                    <th className="px-4 py-3">Check Out</th>
                    <th className="px-4 py-3">Working Hours</th>
                    <th className="px-4 py-3">Status</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {attendanceLogs.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center"><Clock className="h-8 w-8 mb-2" /><p>No attendance records yet</p><p className="text-xs mt-1">Biometric sync will populate this automatically</p></div>
                      </td></tr>
                    ) : attendanceLogs.slice(0, 50).map((log, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{log.employeeName}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{log.date}</td>
                        <td className="px-4 py-2.5">{log.checkIn}</td>
                        <td className="px-4 py-2.5">{log.checkOut}</td>
                        <td className="px-4 py-2.5">{log.workingHours}</td>
                        <td className="px-4 py-2.5"><Badge variant={
                          log.status === 'present' ? 'success' : log.status === 'late' ? 'warning' : log.status === 'half_day' ? 'default' : 'destructive'
                        } className="text-[10px] capitalize">{log.status.replace('_', ' ')}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Processed payroll records. Click "Generate" to calculate salary based on attendance.</p>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3 text-center">Present</th>
                    <th className="px-4 py-3 text-center">Late</th>
                    <th className="px-4 py-3 text-center">Half Day</th>
                    <th className="px-4 py-3 text-center">Absent</th>
                    <th className="px-4 py-3 text-center">OT</th>
                    <th className="px-4 py-3 text-right">Gross</th>
                    <th className="px-4 py-3 text-right">Deductions</th>
                    <th className="px-4 py-3 text-right">Net Salary</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {payrollRecords.length === 0 ? (
                      <tr><td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center"><Calculator className="h-8 w-8 mb-2" /><p>No payroll processed yet</p><p className="text-xs mt-1">Go to Employees tab and click "Process" to generate payroll</p></div>
                      </td></tr>
                    ) : payrollRecords.map((rec, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setShowPayslip(rec)}>
                        <td className="px-4 py-3 font-medium">{rec.employeeName}</td>
                        <td className="px-4 py-3 text-center">{rec.present}</td>
                        <td className="px-4 py-3 text-center text-amber-600">{rec.late}</td>
                        <td className="px-4 py-3 text-center text-orange-600">{rec.halfDay}</td>
                        <td className="px-4 py-3 text-center text-red-600">{rec.absent}</td>
                        <td className="px-4 py-3 text-center text-emerald-600">{rec.overtime}h</td>
                        <td className="px-4 py-3 text-right font-medium">{formatINR(rec.grossSalary)}</td>
                        <td className="px-4 py-3 text-right text-red-600">{formatINR(rec.deductions)}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">{formatINR(rec.netSalary)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={rec.processed ? 'success' : 'warning'} className="text-[10px]">{rec.processed ? 'Paid' : 'Pending'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={showSalaryModal} onOpenChange={(o) => { if (!o) setShowSalaryModal(false); }}>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Set Employee Salary</h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Employee</label>
                <Select value={selectedEmp?.id || ''} onValueChange={(v) => {
                  const emp = employees.find((e) => e.id === v);
                  setSelectedEmp(emp || null);
                }}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name} ({e.employeeCode})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Basic Salary (₹)</label>
                <Input type="number" id="basicSalary" defaultValue={0} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">HRA</label>
                <Input type="number" id="hra" defaultValue={0} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">DA</label>
                <Input type="number" id="da" defaultValue={0} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Transport</label>
                <Input type="number" id="transport" defaultValue={0} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">PF Deduction</label>
                <Input type="number" id="pf" defaultValue={0} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">ESI Deduction</label>
                <Input type="number" id="esi" defaultValue={0} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Bank Account</label>
                <Input id="bankAccount" placeholder="XXXXXXXXXX" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">IFSC Code</label>
                <Input id="ifsc" placeholder="SBIN0001234" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setShowSalaryModal(false)}>Cancel</Button>
              <Button onClick={() => {
                if (!selectedEmp) { toast.error('Select an employee'); return; }
                const basic = parseInt((document.getElementById('basicSalary') as HTMLInputElement).value) || 0;
                const hra = parseInt((document.getElementById('hra') as HTMLInputElement).value) || 0;
                const da = parseInt((document.getElementById('da') as HTMLInputElement).value) || 0;
                const transport = parseInt((document.getElementById('transport') as HTMLInputElement).value) || 0;
                const pf = parseInt((document.getElementById('pf') as HTMLInputElement).value) || 0;
                const esi = parseInt((document.getElementById('esi') as HTMLInputElement).value) || 0;
                const bankAccount = (document.getElementById('bankAccount') as HTMLInputElement).value;
                const ifsc = (document.getElementById('ifsc') as HTMLInputElement).value;
                saveSalary({
                  employeeCode: selectedEmp.employeeCode,
                  employeeName: selectedEmp.name,
                  designation: selectedEmp.designation,
                  department: selectedEmp.department,
                  basicSalary: basic, hra, da, transport, pf, esi, bankAccount, ifsc,
                });
              }}>Save Salary</Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={!!showPayslip} onOpenChange={(o) => { if (!o) setShowPayslip(null); }}>
        {showPayslip && (
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Salary Slip</h3>
                <p className="text-sm text-muted-foreground">{showPayslip.month} {showPayslip.year}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
            <div className="rounded-lg border p-4 mb-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-muted-foreground">Employee</p><p className="font-medium">{showPayslip.employeeName}</p></div>
                <div><p className="text-xs text-muted-foreground">Code</p><p className="font-medium">{showPayslip.employeeCode}</p></div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-semibold mb-3">Attendance Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Present</span><span className="font-medium">{showPayslip.present}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Late</span><span className="font-medium text-amber-600">{showPayslip.late}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Half Day</span><span className="font-medium text-orange-600">{showPayslip.halfDay}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Absent</span><span className="font-medium text-red-600">{showPayslip.absent}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Overtime</span><span className="font-medium text-emerald-600">{showPayslip.overtime}h</span></div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-semibold mb-3">Salary Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Basic Salary</span><span className="font-medium">{formatINR(showPayslip.basicSalary)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Allowances</span><span className="font-medium">{formatINR(showPayslip.allowances)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Gross Salary</span><span className="font-medium">{formatINR(showPayslip.grossSalary)}</span></div>
                  <div className="border-t pt-2 flex justify-between"><span className="text-muted-foreground">Deductions</span><span className="font-medium text-red-600">-{formatINR(showPayslip.deductions)}</span></div>
                  <div className="border-t pt-2 flex justify-between"><span className="font-semibold">Net Salary</span><span className="text-lg font-bold text-emerald-600">{formatINR(showPayslip.netSalary)}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
