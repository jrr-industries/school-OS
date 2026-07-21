'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@schoolos/ui';
import { createStudentSchema } from '@schoolos/validation';
import type { CreateStudentInput } from '@schoolos/validation';

interface StudentFormProps {
  initialData?: Partial<CreateStudentInput>;
  onSubmit: (data: CreateStudentInput) => Promise<void>;
  isLoading?: boolean;
}

export function StudentForm({ initialData, onSubmit, isLoading }: StudentFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: initialData,
  });

  const onSubmitForm = async (data: CreateStudentInput) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                step >= i + 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </button>
            {i < totalSteps - 1 && (
              <div
                className={`h-px w-8 ${
                  step > i + 1 ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="Middle Name" {...register('middleName')} />
            <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
            <div className="space-y-1">
              <label className="text-sm font-medium">Gender</label>
              <select {...register('gender')} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input label="Blood Group" {...register('bloodGroup')} />
            <Input label="Religion" {...register('religion')} />
            <Input label="Nationality" {...register('nationality')} />
            <Input label="Mother Tongue" {...register('motherTongue')} />
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Admission Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Input label="Admission Number" {...register('admissionNumber')} error={errors.admissionNumber?.message} />
            <Input label="Roll Number" {...register('rollNumber')} />
            <Input label="EMIS Number" {...register('emisNumber')} />
            <Input label="Admission Date" type="date" {...register('admissionDate')} error={errors.admissionDate?.message} />
            <Input label="Aadhar Number" {...register('aadharNumber')} />
            <Input label="Passport Number" {...register('passportNumber')} />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Academic Placement</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Input label="Class ID" {...register('classId')} />
            <Input label="Section ID" {...register('sectionId')} />
            <Input label="Campus ID" {...register('campusId')} />
            <Input label="Academic Year ID" {...register('academicYearId')} />
            <Input label="Category ID" {...register('categoryId')} />
            <Input label="House ID" {...register('houseId')} />
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register('isScholarship')} className="h-4 w-4 rounded border-border" />
              <label className="text-sm">Scholarship</label>
            </div>
            <Input label="Scholarship Details" {...register('scholarshipDetails')} />
            <div className="col-span-2">
              <label className="text-sm font-medium">Medical Notes</label>
              <textarea {...register('medicalNotes')} className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Special Needs</label>
              <textarea {...register('specialNeeds')} className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {step < totalSteps ? (
            <Button type="button" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button type="submit" isLoading={isLoading}>
              Create Student
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
