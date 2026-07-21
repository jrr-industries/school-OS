'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Select } from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';

const DESIGNATIONS = [
  { value: 'principal', label: 'Principal' },
  { value: 'vice_principal', label: 'Vice Principal' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'class_teacher', label: 'Class Teacher' },
  { value: 'hr', label: 'HR' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'librarian', label: 'Librarian' },
  { value: 'transport_manager', label: 'Transport Manager' },
  { value: 'hostel_warden', label: 'Hostel Warden' },
  { value: 'inventory_manager', label: 'Inventory Manager' },
  { value: 'office_staff', label: 'Office Staff' },
];

const DEPARTMENTS = [
  { value: 'administration', label: 'Administration' },
  { value: 'science', label: 'Science' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'humanities', label: 'Humanities' },
  { value: 'languages', label: 'Languages' },
  { value: 'finance', label: 'Finance' },
  { value: 'human_resources', label: 'Human Resources' },
  { value: 'library', label: 'Library' },
  { value: 'transport', label: 'Transport' },
  { value: 'hostel', label: 'Hostel' },
];

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState({
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh@school.edu',
    phone: '9876543210',
    gender: 'male',
    dateOfBirth: '1985-03-15',
    qualification: 'M.Ed, B.Sc',
    department: 'administration',
    designation: 'principal',
    joiningDate: '2020-06-01',
    employmentType: 'full_time',
    status: 'active',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/school-admin/staff/${params.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Staff"
        description="Update staff information"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Staff', href: '/school-admin/staff' },
          { label: `${formData.firstName} ${formData.lastName}`, href: `/school-admin/staff/${params.id}` },
          { label: 'Edit' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Qualification</label>
              <Input value={formData.qualification} onChange={(e) => updateField('qualification', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader><CardTitle>Employment Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <Select value={formData.designation} onValueChange={(v) => updateField('designation', v)}>
                  {DESIGNATIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={formData.department} onValueChange={(v) => updateField('department', v)}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Joining Date</label>
                <Input type="date" value={formData.joiningDate} onChange={(e) => updateField('joiningDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Employment Type</label>
                <Select value={formData.employmentType} onValueChange={(v) => updateField('employmentType', v)}>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
