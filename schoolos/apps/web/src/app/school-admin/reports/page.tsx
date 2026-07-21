'use client';

import { useState, useCallback } from 'react';
import {
  FileText, FileSpreadsheet, FileDown, Printer, Users, ClipboardCheck,
  IndianRupee, Briefcase, School, Download, Eye, Loader2,
  AlertCircle, Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, cn } from '@schoolos/ui';
import { useSchoolAdminAuth } from '@/features/supabase/hooks/use-school-admin-auth';
import { PageHeader } from '@/features/school-admin/components/page-header';

const dateRanges = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
];

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  path: string;
  sampleData: Record<string, string>[];
  columns: string[];
}

const reportTypes: ReportType[] = [
  {
    id: 'user',
    title: 'User Report',
    description: 'Complete user data including students, teachers, parents, and staff',
    icon: Users,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    path: 'users',
    columns: ['Name', 'Role', 'Email', 'Phone', 'Status', 'Last Login'],
    sampleData: [
      { Name: 'John Doe', Role: 'Student', Email: 'john@school.com', Phone: '9876543210', Status: 'Active', 'Last Login': '2026-07-20' },
      { Name: 'Jane Smith', Role: 'Teacher', Email: 'jane@school.com', Phone: '9876543211', Status: 'Active', 'Last Login': '2026-07-21' },
      { Name: 'Bob Wilson', Role: 'Parent', Email: 'bob@school.com', Phone: '9876543212', Status: 'Active', 'Last Login': '2026-07-19' },
    ],
  },
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Daily and monthly attendance records with percentages',
    icon: ClipboardCheck,
    color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
    path: 'attendance',
    columns: ['Date', 'Total', 'Present', 'Absent', 'Late', 'Percentage'],
    sampleData: [
      { Date: '2026-07-15', Total: '500', Present: '470', Absent: '20', Late: '10', Percentage: '94%' },
      { Date: '2026-07-16', Total: '500', Present: '465', Absent: '25', Late: '10', Percentage: '93%' },
      { Date: '2026-07-17', Total: '500', Present: '480', Absent: '12', Late: '8', Percentage: '96%' },
    ],
  },
  {
    id: 'fee',
    title: 'Fee Report',
    description: 'Fee collection, pending fees, and payment history',
    icon: IndianRupee,
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    path: 'fees',
    columns: ['Student', 'Class', 'Amount', 'Paid', 'Pending', 'Due Date'],
    sampleData: [
      { Student: 'Alice Brown', Class: '10A', Amount: '₹25,000', Paid: '₹25,000', Pending: '₹0', 'Due Date': '2026-06-30' },
      { Student: 'Charlie Davis', Class: '9B', Amount: '₹22,000', Paid: '₹15,000', Pending: '₹7,000', 'Due Date': '2026-06-30' },
      { Student: 'Diana Evans', Class: '11C', Amount: '₹28,000', Paid: '₹20,000', Pending: '₹8,000', 'Due Date': '2026-07-15' },
    ],
  },
  {
    id: 'staff',
    title: 'Staff Report',
    description: 'Staff directory, roles, salaries, and performance',
    icon: Briefcase,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
    path: 'staff',
    columns: ['Name', 'Department', 'Role', 'Salary', 'Joined', 'Status'],
    sampleData: [
      { Name: 'Dr. Kumar', Department: 'Science', Role: 'HOD', Salary: '₹85,000', Joined: '2020-04-01', Status: 'Active' },
      { Name: 'Ms. Patel', Department: 'Mathematics', Role: 'Teacher', Salary: '₹55,000', Joined: '2021-08-15', Status: 'Active' },
      { Name: 'Mr. Singh', Department: 'Admin', Role: 'Accountant', Salary: '₹45,000', Joined: '2019-01-10', Status: 'Active' },
    ],
  },
  {
    id: 'school',
    title: 'School Report',
    description: 'Overall school statistics and performance metrics',
    icon: School,
    color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400',
    path: 'school',
    columns: ['Metric', 'Value', 'Previous', 'Change', 'Status'],
    sampleData: [
      { Metric: 'Total Students', Value: '1,850', Previous: '1,720', Change: '+7.6%', Status: 'Good' },
      { Metric: 'Pass Rate', Value: '92%', Previous: '89%', Change: '+3.4%', Status: 'Excellent' },
      { Metric: 'Fee Collection', Value: '₹8.5L', Previous: '₹7.2L', Change: '+18%', Status: 'Good' },
    ],
  },
];

function generateCSV(data: Record<string, string>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h] ?? '';
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      }).join(','),
    ),
  ];
  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  useSchoolAdminAuth();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [previewData, setPreviewData] = useState<Record<string, string>[] | null>(null);
  const [loading, setLoading] = useState(false);

  const report = reportTypes.find((r) => r.id === selectedReport);

  const handleGenerate = useCallback(async (reportId: string) => {
    setSelectedReport(reportId);
    setGenerating(true);
    setLoading(true);
    const found = reportTypes.find((r) => r.id === reportId);
    if (found) {
      await new Promise((r) => setTimeout(r, 800));
      setPreviewData(found.sampleData);
    }
    setLoading(false);
    setGenerating(false);
  }, []);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  const handleExportCSV = useCallback(() => {
    if (!report || !previewData) return;
    generateCSV(previewData, `${report.title.toLowerCase().replace(/\s+/g, '-')}-report`);
  }, [report, previewData]);

  const handleExportExcel = useCallback(() => {
    if (!report || !previewData) return;
    const headers = Object.keys(previewData[0] ?? {});
    let html = '<table>';
    html += '<tr>' + headers.map((h) => `<th>${h}</th>`).join('') + '</tr>';
    for (const row of previewData) {
      html += '<tr>' + headers.map((h) => `<td>${row[h] ?? ''}</td>`).join('') + '</tr>';
    }
    html += '</table>';
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  }, [report, previewData]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and export school reports"
      />

      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-1 w-fit">
        <Filter className="h-4 w-4 text-muted-foreground ml-1" />
        {dateRanges.map((r) => (
          <button
            key={r.value}
            onClick={() => setDateRange(r.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              dateRange === r.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;
          return (
            <Card
              key={report.id}
              className={cn(
                'relative overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer',
                isSelected && 'ring-2 ring-primary',
              )}
              onClick={() => handleGenerate(report.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={cn('rounded-lg p-3 shrink-0', report.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{report.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        className="gap-1.5 text-xs h-8"
                        onClick={(e) => { e.stopPropagation(); handleGenerate(report.id); }}
                        disabled={generating}
                      >
                        {generating && isSelected ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        {generating && isSelected ? 'Generating...' : 'Generate'}
                      </Button>
                      {isSelected && previewData && (
                        <>
                          <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8" onClick={(e) => { e.stopPropagation(); handleExportPDF(); }}>
                            <Printer className="h-3.5 w-3.5" /> PDF
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8" onClick={(e) => { e.stopPropagation(); handleExportExcel(); }}>
                            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8" onClick={(e) => { e.stopPropagation(); handleExportCSV(); }}>
                            <FileDown className="h-3.5 w-3.5" /> CSV
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedReport && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                Preview: {report?.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">Sample data preview</p>
            </div>
            {previewData && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExportPDF}>
                  <Printer className="h-3.5 w-3.5" /> Print / PDF
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExportExcel}>
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExportCSV}>
                  <FileDown className="h-3.5 w-3.5" /> CSV
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <div className="h-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : previewData && previewData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      {Object.keys(previewData[0]).map((header) => (
                        <th key={header} className="px-3 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2.5 text-sm">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p className="text-sm">No data available for this report</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedReport && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Select a Report</h3>
            <p className="mt-1 text-sm text-center max-w-md">
              Choose a report type above to generate and export data. You can export as PDF, Excel, or CSV.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
