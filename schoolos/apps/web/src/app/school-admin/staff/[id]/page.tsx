'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Edit, Trash2, Mail, Phone, Clock,
  Download, XCircle, FileText
} from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent } from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';
import type { Employee, EmployeeStatus } from '@/features/school-admin/types';

const statusColors: Record<EmployeeStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
  resigned: 'outline',
  terminated: 'destructive',
};

const mockStaff: Employee = {
  id: '1',
  schoolId: 's1',
  employeeId: 'EMP001',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  email: 'rajesh@school.edu',
  phone: '9876543210',
  alternatePhone: '9876543000',
  gender: 'male',
  dateOfBirth: '1985-03-15',
  bloodGroup: 'b_positive',
  qualification: 'M.Ed, B.Sc',
  experience: 15,
  designationId: 'd1',
  designation: { id: 'd1', title: 'Principal', slug: 'principal', hierarchyLevel: 80, isTeaching: false },
  departmentId: 'dep1',
  department: { id: 'dep1', name: 'Administration' },
  employmentType: 'full_time',
  status: 'active',
  isClassTeacher: false,
  joiningDate: '2020-06-01',
  createdAt: '2024-01-01',
  updatedAt: '2024-06-15',
};

export default function StaffDetailPage() {
  const params = useParams();
  const [staff] = useState<Employee>(mockStaff);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Profile"
        description="View and manage staff details"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Staff', href: '/school-admin/staff' },
          { label: `${staff.firstName} ${staff.lastName}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/school-admin/staff/${params.id}/edit`}>
              <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Edit</Button>
            </Link>
            <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {staff.firstName[0]}{staff.lastName[0]}
                </div>
                <h2 className="mt-4 text-lg font-semibold">{staff.firstName} {staff.lastName}</h2>
                <p className="text-sm text-muted-foreground">{staff.designation?.title}</p>
                <Badge variant={statusColors[staff.status]} className="mt-2">{staff.status}</Badge>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Joined {staff.joiningDate}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${staff.email}`} className="hover:underline">{staff.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${staff.phone}`} className="hover:underline">{staff.phone}</a>
              </div>
              {staff.alternatePhone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{staff.alternatePhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="mr-2 h-4 w-4" /> Download Profile
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Mail className="mr-2 h-4 w-4" /> Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start text-amber-600" size="sm">
                <XCircle className="mr-2 h-4 w-4" /> Deactivate
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Employment Details</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><p className="text-xs text-muted-foreground">Employee ID</p><p className="text-sm font-medium">{staff.employeeId}</p></div>
                    <div><p className="text-xs text-muted-foreground">Designation</p><p className="text-sm font-medium">{staff.designation?.title}</p></div>
                    <div><p className="text-xs text-muted-foreground">Department</p><p className="text-sm font-medium">{staff.department?.name}</p></div>
                    <div><p className="text-xs text-muted-foreground">Employment Type</p><p className="text-sm font-medium capitalize">{staff.employmentType.replace('_', ' ')}</p></div>
                    <div><p className="text-xs text-muted-foreground">Joining Date</p><p className="text-sm font-medium">{staff.joiningDate}</p></div>
                    <div><p className="text-xs text-muted-foreground">Total Experience</p><p className="text-sm font-medium">{staff.experience} years</p></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">Personal Information</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><p className="text-xs text-muted-foreground">Date of Birth</p><p className="text-sm font-medium">{staff.dateOfBirth}</p></div>
                    <div><p className="text-xs text-muted-foreground">Gender</p><p className="text-sm font-medium capitalize">{staff.gender}</p></div>
                    <div><p className="text-xs text-muted-foreground">Blood Group</p><p className="text-sm font-medium capitalize">{staff.bloodGroup?.replace('_', ' ')}</p></div>
                    <div><p className="text-xs text-muted-foreground">Qualification</p><p className="text-sm font-medium">{staff.qualification}</p></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-sm font-medium">No Documents</h3>
                    <p className="text-xs text-muted-foreground">No documents have been uploaded for this staff member.</p>
                    <Button variant="outline" className="mt-4" size="sm">Upload Document</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Permissions are automatically assigned based on the role/designation.
                    Custom permissions can be configured from the role management section.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-sm font-medium">No Recent Activity</h3>
                    <p className="text-xs text-muted-foreground">Activity log will appear here once the staff member starts using the system.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
