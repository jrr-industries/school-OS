'use client';

import { useState, useMemo } from 'react';
import { ClipboardCheck, CalendarDays } from 'lucide-react';
import { PageContainer, PageHeader, ContentContainer } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/shared/data-table';
import type { Column } from '@/components/shared/data-table';
import { attendanceRecords, type AttendanceRecord } from '@/mock-data';
import { cn } from '@/lib/utils';

const statusColors = {
  present: 'bg-success/10 text-success border-success/20',
  absent: 'bg-destructive/10 text-destructive border-destructive/20',
  late: 'bg-warning/10 text-warning border-warning/20',
  'half-day': 'bg-info/10 text-info border-info/20',
};

const statusIcons = {
  present: '●',
  absent: '●',
  late: '●',
  'half-day': '●',
};

export default function AttendancePage() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const filtered = useMemo(() => {
    let data = attendanceRecords;
    if (classFilter !== 'all') {
      data = data.filter((r) => r.class === classFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) => r.studentName.toLowerCase().includes(q));
    }
    return data;
  }, [search, classFilter]);

  const classes = useMemo(() => {
    const set = new Set(attendanceRecords.map((r) => r.class));
    return Array.from(set).sort();
  }, []);

  const summary = useMemo(() => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r) => r.status === 'present').length;
    const absent = attendanceRecords.filter((r) => r.status === 'absent').length;
    const late = attendanceRecords.filter((r) => r.status === 'late').length;
    const halfDay = attendanceRecords.filter((r) => r.status === 'half-day').length;
    return { total, present, absent, late, halfDay };
  }, []);

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
            <span className="text-xs font-semibold text-foreground">{r.rollNo}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{r.studentName}</span>
            <span className="text-xs text-muted-foreground/70">
              Class {r.class}-{r.section}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (r) => (
        <span className="text-sm text-foreground">{r.date}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (r) => (
        <Badge
          variant="outline"
          className={cn('h-6 gap-1.5 border px-2 text-[10px] font-medium', statusColors[r.status])}
        >
          <span className="text-[8px]">{statusIcons[r.status]}</span>
          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'markedBy',
      header: 'Marked By',
      render: (r) => (
        <span className="text-sm text-muted-foreground">{r.markedBy}</span>
      ),
      hideOnMobile: true,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Attendance"
        description="Track and manage student attendance records"
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Today: 18 Jul 2026</span>
        </div>
      </PageHeader>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Present" value={summary.present} total={summary.total} color="text-success" barColor="bg-success" />
        <SummaryCard label="Absent" value={summary.absent} total={summary.total} color="text-destructive" barColor="bg-destructive" />
        <SummaryCard label="Late" value={summary.late} total={summary.total} color="text-warning" barColor="bg-warning" />
        <SummaryCard label="Half Day" value={summary.halfDay} total={summary.total} color="text-info" barColor="bg-info" />
      </div>

      <ContentContainer className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by student name..."
          pageSize={10}
          emptyMessage="No attendance records found"
          emptyIcon={ClipboardCheck}
        />
      </ContentContainer>
    </PageContainer>
  );
}

function SummaryCard({
  label,
  value,
  total,
  color,
  barColor,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  barColor: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn('text-lg font-bold', color)}>{value}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="mt-1 block text-xs text-muted-foreground/70">{pct}% of total</span>
    </div>
  );
}
