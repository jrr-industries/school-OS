export type EmployeeStatus = 'active' | 'inactive' | 'suspended' | 'resigned' | 'terminated';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary' | 'intern' | 'volunteer';
export type Gender = 'male' | 'female' | 'other';

export interface Designation {
  id: string;
  title: string;
  slug: string;
  departmentId?: string;
  hierarchyLevel: number;
  isTeaching: boolean;
}

export interface Employee {
  id: string;
  schoolId: string;
  userId?: string;
  designationId: string;
  departmentId?: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
  photo?: string;
  qualification?: string;
  experience?: number;
  joiningDate?: string;
  leavingDate?: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  isClassTeacher: boolean;
  designation?: Designation;
  department?: { id: string; name: string };
  user?: { id: string; email: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeePayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  qualification: string;
  departmentId: string;
  designationId: string;
  joiningDate: string;
  employmentType: EmploymentType;
  status: string;
  password?: string;
}
