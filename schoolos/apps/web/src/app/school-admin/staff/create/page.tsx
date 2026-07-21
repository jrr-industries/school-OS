'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Save, User, Shield, FileText, Check
} from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Select, cn } from '@schoolos/ui';
import { PageHeader } from '@/features/school-admin/components/page-header';

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'employment', label: 'Employment Details', icon: Shield },
  { id: 'account', label: 'Account Setup', icon: FileText },
  { id: 'review', label: 'Review & Submit', icon: Check },
];

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
  { value: 'physical_education', label: 'Physical Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'human_resources', label: 'Human Resources' },
  { value: 'library', label: 'Library' },
  { value: 'transport', label: 'Transport' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'it', label: 'IT' },
];

export default function CreateStaffPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    photo: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    qualification: '',
    department: '',
    designation: '',
    joiningDate: '',
    role: '',
    status: 'active',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    router.push('/school-admin/staff');
  };

  const canProceed = () => {
    if (currentStep === 0) return formData.firstName && formData.lastName && formData.email && formData.phone;
    if (currentStep === 1) return formData.designation && formData.department && formData.joiningDate;
    if (currentStep === 2) return formData.password && formData.password === formData.confirmPassword;
    return true;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Staff"
        description="Create a new staff member and set up their account"
        breadcrumbs={[
          { label: 'Dashboard', href: '/school-admin/dashboard' },
          { label: 'Staff', href: '/school-admin/staff' },
          { label: 'Add New' },
        ]}
      />

      <div className="flex items-center justify-between border-b pb-4">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div key={step.id} className="flex items-center gap-2">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                isActive && 'bg-primary text-primary-foreground',
                isCompleted && 'bg-emerald-500 text-white',
                !isActive && !isCompleted && 'bg-muted text-muted-foreground',
              )}>
                {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
              </div>
              <span className={cn(
                'text-sm hidden sm:inline',
                isActive && 'font-medium text-foreground',
                !isActive && 'text-muted-foreground',
              )}>
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  'hidden sm:block mx-2 h-px w-12',
                  index < currentStep ? 'bg-emerald-500' : 'bg-border',
                )} />
              )}
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].label}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name *</label>
                  <Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="email@school.edu" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone *</label>
                  <Input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Enter phone number" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                    <option value="">Select gender</option>
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
                <Input value={formData.qualification} onChange={(e) => updateField('qualification', e.target.value)} placeholder="e.g., M.Sc, B.Ed" />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input value={formData.employeeId} onChange={(e) => updateField('employeeId', e.target.value)} placeholder="Auto-generated if empty" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Designation *</label>
                  <Select value={formData.designation} onValueChange={(v) => updateField('designation', v)}>
                    <option value="">Select designation</option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department *</label>
                  <Select value={formData.department} onValueChange={(v) => updateField('department', v)}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Joining Date *</label>
                  <Input type="date" value={formData.joiningDate} onChange={(e) => updateField('joiningDate', e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select value={formData.role} onValueChange={(v) => updateField('role', v)}>
                    <option value="">Same as designation</option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password *</label>
                  <Input type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Create password" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password *</label>
                  <Input type="password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Confirm password" />
                </div>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="text-sm font-medium mb-2">Permissions</h4>
                <p className="text-xs text-muted-foreground">
                  Permissions will be automatically assigned based on the selected designation.
                  You can customize them later from the staff profile.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Review Staff Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Designation</p>
                  <p className="text-sm font-medium capitalize">{formData.designation.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium capitalize">{formData.department.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joining Date</p>
                  <p className="text-sm font-medium">{formData.joiningDate}</p>
                </div>
              </div>
              <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Upon submission, a user account will be created with the provided credentials,
                  and the staff profile will be set up automatically.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={currentStep === 0 ? () => router.back() : handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button onClick={currentStep === STEPS.length - 1 ? handleSubmit : handleNext} disabled={!canProceed()}>
          {currentStep === STEPS.length - 1 ? (
            <>Create Staff <Save className="ml-2 h-4 w-4" /></>
          ) : (
            <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
