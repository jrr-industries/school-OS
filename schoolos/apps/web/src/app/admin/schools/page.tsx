'use client';

import { PageHeader, DataTable, Toolbar, ToolbarGroup, ToolbarButton } from '@/features/super-admin/components';
import { Plus, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface School {
  id: string;
  name: string;
  code: string;
  type: string;
  status: 'active' | 'suspended' | 'pending' | 'deleted';
  students: number;
  teachers: number;
  createdAt: string;
  subscription: string;
}

const mockSchools: School[] = [
  { id: '1', name: 'Springfield Elementary', code: 'SPR-ELM', type: 'Public', status: 'active', students: 450, teachers: 32, createdAt: '2023-01-15', subscription: 'Pro' },
  { id: '2', name: 'Lincoln High School', code: 'LIN-HS', type: 'Public', status: 'active', students: 1200, teachers: 85, createdAt: '2022-09-01', subscription: 'Enterprise' },
  { id: '3', name: 'Riverside Academy', code: 'RIV-ACA', type: 'Private', status: 'active', students: 320, teachers: 28, createdAt: '2023-03-20', subscription: 'Pro' },
  { id: '4', name: 'Mountain View Middle', code: 'MTN-MID', type: 'Public', status: 'suspended', students: 0, teachers: 0, createdAt: '2023-02-10', subscription: 'Basic' },
  { id: '5', name: 'Oakwood Preparatory', code: 'OAK-PREP', type: 'Private', status: 'pending', students: 180, teachers: 22, createdAt: '2024-01-05', subscription: 'Trial' },
];

const columns = [
  { key: 'name', header: 'School', accessor: (row: School) => <><strong>{row.name}</strong><br/><span className="text-xs text-muted-foreground">{row.code}</span></>, sortable: true },
  { key: 'type', header: 'Type', accessor: (row: School) => row.type, sortable: true },
  { key: 'status', header: 'Status', accessor: (row: School) => <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'active' ? 'bg-green-100 text-green-800' : row.status === 'suspended' ? 'bg-red-100 text-red-800' : row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'}`}>{row.status}</span> },
  { key: 'students', header: 'Students', accessor: (row: School) => row.students.toLocaleString(), align: 'right', sortable: true },
  { key: 'teachers', header: 'Teachers', accessor: (row: School) => row.teachers, align: 'right', sortable: true },
  { key: 'subscription', header: 'Plan', accessor: (row: School) => row.subscription, sortable: true },
  { key: 'createdAt', header: 'Created', accessor: (row: School) => new Date(row.createdAt).toLocaleDateString('en-CA'), sortable: true },
];

export default function SchoolsPage() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Schools"
        description="Manage and monitor all schools on the platform"
        actions={
          <Toolbar>
            <ToolbarGroup>
              <ToolbarButton onClick={() => {}} icon={<Plus className="h-4 w-4" />} variant="primary">
                Create School
              </ToolbarButton>
            </ToolbarGroup>
          </Toolbar>
        }
      />

      <DataTable
        columns={columns as any}
        data={mockSchools}
        keyExtractor={(row) => row.id}
        searchKey="name"
        onSearch={() => {}}
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        rowActions={() => (
          <div className="flex items-center justify-end gap-1">
            <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="View">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Edit">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="More actions">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}
        pagination={{
          page,
          pageSize: 10,
          total: mockSchools.length,
          onPageChange: setPage,
          onPageSizeChange: () => {},
        }}
      />
    </div>
  );
}