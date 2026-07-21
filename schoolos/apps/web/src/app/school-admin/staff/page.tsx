'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Search, SlidersHorizontal,
  Mail, Phone,
  Eye, Edit, Trash2, X
} from 'lucide-react';
import {
  Button, Input, Badge, Card, CardContent, CardHeader, CardTitle,
  Select, Modal
} from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import type { Employee, EmployeeStatus } from '@/features/school-admin/types';

const statusColors: Record<EmployeeStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
  resigned: 'outline',
  terminated: 'destructive',
};

const statusLabels: Record<EmployeeStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  resigned: 'Resigned',
  terminated: 'Terminated',
};

const mockStaff: Employee[] = [
  { id: '1', schoolId: 's1', employeeId: 'EMP001', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh@school.edu', phone: '9876543210', designationId: 'd1', designation: { id: 'd1', title: 'Principal', slug: 'principal', hierarchyLevel: 80, isTeaching: false }, department: { id: 'dep1', name: 'Administration' }, employmentType: 'full_time', status: 'active', isClassTeacher: false, joiningDate: '2020-06-01', qualification: 'M.Ed', experience: 15, gender: 'male', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '2', schoolId: 's1', employeeId: 'EMP002', firstName: 'Priya', lastName: 'Sharma', email: 'priya@school.edu', phone: '9876543211', designationId: 'd2', designation: { id: 'd2', title: 'Vice Principal', slug: 'vice_principal', hierarchyLevel: 75, isTeaching: true }, department: { id: 'dep1', name: 'Administration' }, employmentType: 'full_time', status: 'active', isClassTeacher: false, joiningDate: '2021-03-15', qualification: 'M.Sc, B.Ed', experience: 12, gender: 'female', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '3', schoolId: 's1', employeeId: 'EMP003', firstName: 'Amit', lastName: 'Verma', email: 'amit@school.edu', phone: '9876543212', designationId: 'd3', designation: { id: 'd3', title: 'Teacher', slug: 'teacher', hierarchyLevel: 50, isTeaching: true }, department: { id: 'dep2', name: 'Science' }, employmentType: 'full_time', status: 'active', isClassTeacher: true, joiningDate: '2022-07-01', qualification: 'M.Sc, B.Ed', experience: 8, gender: 'male', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '4', schoolId: 's1', employeeId: 'EMP004', firstName: 'Sunita', lastName: 'Singh', email: 'sunita@school.edu', phone: '9876543213', designationId: 'd4', designation: { id: 'd4', title: 'HR Manager', slug: 'hr', hierarchyLevel: 60, isTeaching: false }, department: { id: 'dep3', name: 'Human Resources' }, employmentType: 'full_time', status: 'active', isClassTeacher: false, joiningDate: '2023-01-10', qualification: 'MBA-HR', experience: 6, gender: 'female', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '5', schoolId: 's1', employeeId: 'EMP005', firstName: 'Vikram', lastName: 'Patel', email: 'vikram@school.edu', phone: '9876543214', designationId: 'd5', designation: { id: 'd5', title: 'Accountant', slug: 'accountant', hierarchyLevel: 60, isTeaching: false }, department: { id: 'dep4', name: 'Finance' }, employmentType: 'full_time', status: 'active', isClassTeacher: false, joiningDate: '2022-11-20', qualification: 'B.Com, MBA', experience: 10, gender: 'male', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '6', schoolId: 's1', employeeId: 'EMP006', firstName: 'Neha', lastName: 'Gupta', email: 'neha@school.edu', phone: '9876543215', designationId: 'd3', designation: { id: 'd3', title: 'Teacher', slug: 'teacher', hierarchyLevel: 50, isTeaching: true }, department: { id: 'dep5', name: 'Mathematics' }, employmentType: 'full_time', status: 'active', isClassTeacher: true, joiningDate: '2023-06-05', qualification: 'M.Sc Maths, B.Ed', experience: 5, gender: 'female', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '7', schoolId: 's1', employeeId: 'EMP007', firstName: 'Rohit', lastName: 'Yadav', email: 'rohit@school.edu', phone: '9876543216', designationId: 'd6', designation: { id: 'd6', title: 'Librarian', slug: 'librarian', hierarchyLevel: 40, isTeaching: false }, department: { id: 'dep6', name: 'Library' }, employmentType: 'part_time', status: 'active', isClassTeacher: false, joiningDate: '2024-01-15', qualification: 'MLISc', experience: 3, gender: 'male', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '8', schoolId: 's1', employeeId: 'EMP008', firstName: 'Kavita', lastName: 'Joshi', email: 'kavita@school.edu', phone: '9876543217', designationId: 'd7', designation: { id: 'd7', title: 'Receptionist', slug: 'receptionist', hierarchyLevel: 35, isTeaching: false }, department: { id: 'dep1', name: 'Administration' }, employmentType: 'full_time', status: 'active', isClassTeacher: false, joiningDate: '2023-09-01', qualification: 'BA', experience: 4, gender: 'female', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '9', schoolId: 's1', employeeId: 'EMP009', firstName: 'Deepak', lastName: 'Mehta', email: 'deepak@school.edu', phone: '9876543218', designationId: 'd8', designation: { id: 'd8', title: 'Transport Manager', slug: 'transport_manager', hierarchyLevel: 45, isTeaching: false }, department: { id: 'dep7', name: 'Transport' }, employmentType: 'full_time', status: 'active', isClassTeacher: false, joiningDate: '2022-04-10', qualification: 'BBA', experience: 7, gender: 'male', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
  { id: '10', schoolId: 's1', employeeId: 'EMP010', firstName: 'Anita', lastName: 'Desai', email: 'anita@school.edu', phone: '9876543219', designationId: 'd9', designation: { id: 'd9', title: 'Hostel Warden', slug: 'hostel_warden', hierarchyLevel: 45, isTeaching: false }, department: { id: 'dep8', name: 'Hostel' }, employmentType: 'full_time', status: 'inactive', isClassTeacher: false, joiningDate: '2021-08-01', qualification: 'B.Sc', experience: 6, gender: 'female', createdAt: '2024-01-01', updatedAt: '2024-06-15' },
];

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const filteredStaff = useMemo(() => {
    return mockStaff.filter((s) => {
      const matchesSearch = !search || 
        s.firstName.toLowerCase().includes(search.toLowerCase()) ||
        s.lastName.toLowerCase().includes(search.toLowerCase()) ||
        s.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const handleDelete = () => {
    setDeleteModal(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage all school staff members"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Staff' },
        ]}
        actions={
          <Link href="/school-admin/staff/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Staff ({filteredStaff.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-60"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="mt-3 flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="resigned">Resigned</option>
                <option value="terminated">Terminated</option>
              </Select>
              {statusFilter !== 'all' && (
                <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>
                  <X className="mr-1 h-3 w-3" /> Clear
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Designation</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No staff members found.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr key={staff.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/school-admin/staff/${staff.id}`} className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {staff.firstName[0]}{staff.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{staff.firstName} {staff.lastName}</p>
                            <p className="text-xs text-muted-foreground">{staff.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm">{staff.employeeId}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{staff.designation?.title}</span>
                        {staff.isClassTeacher && (
                          <Badge variant="secondary" className="ml-1 text-[10px]">CT</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{staff.department?.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a href={`tel:${staff.phone}`} className="text-sm text-muted-foreground hover:text-foreground">
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                          {staff.email && (
                            <a href={`mailto:${staff.email}`} className="text-sm text-muted-foreground hover:text-foreground">
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusColors[staff.status]} className="text-[10px]">
                          {statusLabels[staff.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{staff.employmentType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/school-admin/staff/${staff.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/school-admin/staff/${staff.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteModal(staff.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal open={!!deleteModal} onOpenChange={(open) => !open && setDeleteModal(null)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete this staff member? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
