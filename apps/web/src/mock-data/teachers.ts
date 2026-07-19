export interface Teacher {
  id: number;
  name: string;
  employeeId: string;
  subjects: string[];
  qualification: string;
  experience: number;
  phone: string;
  email: string;
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  students: number;
  avatar?: string;
}

export const teachers: Teacher[] = [
  { id: 1, name: 'Ravi Shankar', employeeId: 'TCH001', subjects: ['Mathematics', 'Physics'], qualification: 'M.Sc, B.Ed', experience: 12, phone: '9876543001', email: 'ravi.shankar@example.com', department: 'Science', status: 'active', students: 120 },
  { id: 2, name: 'Neha Singh', employeeId: 'TCH002', subjects: ['English Literature'], qualification: 'M.A, B.Ed', experience: 8, phone: '9876543002', email: 'neha.singh@example.com', department: 'English', status: 'active', students: 95 },
  { id: 3, name: 'Priya Sharma', employeeId: 'TCH003', subjects: ['Chemistry', 'Biology'], qualification: 'M.Sc, Ph.D', experience: 15, phone: '9876543003', email: 'priya.sharma2@example.com', department: 'Science', status: 'active', students: 110 },
  { id: 4, name: 'Sunita Murthy', employeeId: 'TCH004', subjects: ['History', 'Civics'], qualification: 'M.A, B.Ed', experience: 10, phone: '9876543004', email: 'sunita.m@example.com', department: 'Social Studies', status: 'active', students: 88 },
  { id: 5, name: 'Amit Kumar', employeeId: 'TCH005', subjects: ['Computer Science'], qualification: 'B.Tech, M.Tech', experience: 6, phone: '9876543005', email: 'amit.kumar@example.com', department: 'Computer', status: 'active', students: 75 },
  { id: 6, name: 'Deepa Menon', employeeId: 'TCH006', subjects: ['Mathematics'], qualification: 'M.Sc, M.Ed', experience: 14, phone: '9876543006', email: 'deepa.m@example.com', department: 'Mathematics', status: 'active', students: 105 },
  { id: 7, name: 'Rajesh Khanna', employeeId: 'TCH007', subjects: ['Physics'], qualification: 'M.Sc, B.Ed', experience: 9, phone: '9876543007', email: 'rajesh.k@example.com', department: 'Science', status: 'active', students: 92 },
  { id: 8, name: 'Kavita Joshi', employeeId: 'TCH008', subjects: ['Hindi'], qualification: 'M.A, B.Ed', experience: 11, phone: '9876543008', email: 'kavita.j@example.com', department: 'Languages', status: 'active', students: 80 },
  { id: 9, name: 'Anil Deshmukh', employeeId: 'TCH009', subjects: ['Marathi', 'Hindi'], qualification: 'M.A, Ph.D', experience: 18, phone: '9876543009', email: 'anil.d@example.com', department: 'Languages', status: 'active', students: 70 },
  { id: 10, name: 'Shweta Reddy', employeeId: 'TCH010', subjects: ['English Grammar'], qualification: 'M.A, B.Ed', experience: 5, phone: '9876543010', email: 'shweta.r@example.com', department: 'English', status: 'active', students: 85 },
  { id: 11, name: 'Vivek Saxena', employeeId: 'TCH011', subjects: ['Geography', 'Economics'], qualification: 'M.A, M.Ed', experience: 13, phone: '9876543011', email: 'vivek.s@example.com', department: 'Social Studies', status: 'active', students: 78 },
  { id: 12, name: 'Poonam Bhatt', employeeId: 'TCH012', subjects: ['Biology'], qualification: 'M.Sc, B.Ed', experience: 7, phone: '9876543012', email: 'poonam.b@example.com', department: 'Science', status: 'inactive', students: 60 },
  { id: 13, name: 'Suresh Yadav', employeeId: 'TCH013', subjects: ['Physical Education'], qualification: 'B.P.Ed, M.P.Ed', experience: 16, phone: '9876543013', email: 'suresh.y@example.com', department: 'Sports', status: 'active', students: 200 },
  { id: 14, name: 'Lata Nair', employeeId: 'TCH014', subjects: ['Sanskrit'], qualification: 'M.A, Ph.D', experience: 20, phone: '9876543014', email: 'lata.n@example.com', department: 'Languages', status: 'active', students: 45 },
  { id: 15, name: 'Gopal Iyer', employeeId: 'TCH015', subjects: ['Chemistry'], qualification: 'M.Sc, B.Ed', experience: 8, phone: '9876543015', email: 'gopal.i@example.com', department: 'Science', status: 'on-leave', students: 55 },
  { id: 16, name: 'Rekha Patil', employeeId: 'TCH016', subjects: ['Art', 'Craft'], qualification: 'BFA, Diploma', experience: 9, phone: '9876543016', email: 'rekha.p@example.com', department: 'Arts', status: 'active', students: 65 },
  { id: 17, name: 'Mohan Rao', employeeId: 'TCH017', subjects: ['Social Studies'], qualification: 'M.A, B.Ed', experience: 11, phone: '9876543017', email: 'mohan.r@example.com', department: 'Social Studies', status: 'active', students: 72 },
  { id: 18, name: 'Tara Sheikh', employeeId: 'TCH018', subjects: ['Urdu', 'Hindi'], qualification: 'M.A, B.Ed', experience: 6, phone: '9876543018', email: 'tara.s@example.com', department: 'Languages', status: 'active', students: 50 },
  { id: 19, name: 'Vijay Chopra', employeeId: 'TCH019', subjects: ['Mathematics'], qualification: 'M.Sc, B.Ed', experience: 4, phone: '9876543019', email: 'vijay.c@example.com', department: 'Mathematics', status: 'active', students: 90 },
  { id: 20, name: 'Nandini Murugan', employeeId: 'TCH020', subjects: ['Tamil', 'English'], qualification: 'M.A, B.Ed', experience: 10, phone: '9876543020', email: 'nandini.m@example.com', department: 'Languages', status: 'active', students: 68 },
];
