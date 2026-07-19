export interface AttendanceRecord {
  id: number;
  studentName: string;
  class: string;
  section: string;
  rollNo: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  markedBy: string;
}

const statuses: ('present' | 'absent' | 'late' | 'half-day')[] = ['present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late', 'present', 'half-day'];

export const attendanceRecords: AttendanceRecord[] = [
  { id: 1, studentName: 'Arjun Kumar', class: '10', section: 'A', rollNo: '101', date: '2026-07-18', status: 'present', markedBy: 'Ravi Shankar' },
  { id: 2, studentName: 'Priya Sharma', class: '10', section: 'A', rollNo: '102', date: '2026-07-18', status: 'present', markedBy: 'Ravi Shankar' },
  { id: 3, studentName: 'Mohammed Ali', class: '10', section: 'B', rollNo: '103', date: '2026-07-18', status: 'late', markedBy: 'Ravi Shankar' },
  { id: 4, studentName: 'Neha Kapoor', class: '10', section: 'B', rollNo: '104', date: '2026-07-18', status: 'absent', markedBy: 'Ravi Shankar' },
  { id: 5, studentName: 'Sneha Patel', class: '9', section: 'A', rollNo: '201', date: '2026-07-18', status: 'present', markedBy: 'Neha Singh' },
  { id: 6, studentName: 'Rahul Das', class: '9', section: 'B', rollNo: '202', date: '2026-07-18', status: 'absent', markedBy: 'Neha Singh' },
  { id: 7, studentName: 'Manish Tiwari', class: '9', section: 'A', rollNo: '203', date: '2026-07-18', status: 'present', markedBy: 'Neha Singh' },
  { id: 8, studentName: 'Aditi Nair', class: '8', section: 'A', rollNo: '301', date: '2026-07-18', status: 'present', markedBy: 'Sunita Murthy' },
  { id: 9, studentName: 'Vikram Singh', class: '8', section: 'B', rollNo: '302', date: '2026-07-18', status: 'present', markedBy: 'Sunita Murthy' },
  { id: 10, studentName: 'Divya Bhat', class: '8', section: 'A', rollNo: '303', date: '2026-07-18', status: 'half-day', markedBy: 'Sunita Murthy' },
  { id: 11, studentName: 'Ananya Gupta', class: '7', section: 'A', rollNo: '401', date: '2026-07-18', status: 'present', markedBy: 'Amit Kumar' },
  { id: 12, studentName: 'Rohit Verma', class: '7', section: 'B', rollNo: '402', date: '2026-07-18', status: 'late', markedBy: 'Amit Kumar' },
  { id: 13, studentName: 'Akash Jain', class: '7', section: 'A', rollNo: '403', date: '2026-07-18', status: 'present', markedBy: 'Amit Kumar' },
  { id: 14, studentName: 'Kavita Reddy', class: '6', section: 'A', rollNo: '501', date: '2026-07-18', status: 'present', markedBy: 'Deepa Menon' },
  { id: 15, studentName: 'Amit Joshi', class: '6', section: 'B', rollNo: '502', date: '2026-07-18', status: 'absent', markedBy: 'Deepa Menon' },
  { id: 16, studentName: 'Pooja Mehta', class: '5', section: 'A', rollNo: '601', date: '2026-07-18', status: 'present', markedBy: 'Vivek Saxena' },
  { id: 17, studentName: 'Sunil Yadav', class: '5', section: 'B', rollNo: '602', date: '2026-07-18', status: 'present', markedBy: 'Vivek Saxena' },
  { id: 18, studentName: 'Meera Iyer', class: '4', section: 'A', rollNo: '701', date: '2026-07-18', status: 'present', markedBy: 'Mohan Rao' },
  { id: 19, studentName: 'Karan Chauhan', class: '4', section: 'B', rollNo: '702', date: '2026-07-18', status: 'late', markedBy: 'Mohan Rao' },
  { id: 20, studentName: 'Nisha Thakur', class: '3', section: 'A', rollNo: '801', date: '2026-07-18', status: 'absent', markedBy: 'Shweta Reddy' },
  { id: 21, studentName: 'Deepak Bansal', class: '3', section: 'B', rollNo: '802', date: '2026-07-18', status: 'present', markedBy: 'Shweta Reddy' },
  { id: 22, studentName: 'Ritu Agarwal', class: '2', section: 'A', rollNo: '901', date: '2026-07-18', status: 'present', markedBy: 'Kavita Joshi' },
  { id: 23, studentName: 'Gaurav Pandey', class: '2', section: 'B', rollNo: '902', date: '2026-07-18', status: 'half-day', markedBy: 'Kavita Joshi' },
  { id: 24, studentName: 'Sonal Desai', class: '1', section: 'A', rollNo: '1001', date: '2026-07-18', status: 'present', markedBy: 'Lata Nair' },
  { id: 25, studentName: 'Harsh Shah', class: '1', section: 'B', rollNo: '1002', date: '2026-07-18', status: 'present', markedBy: 'Lata Nair' },
  { id: 26, studentName: 'Arjun Kumar', class: '10', section: 'A', rollNo: '101', date: '2026-07-17', status: 'present', markedBy: 'Ravi Shankar' },
  { id: 27, studentName: 'Priya Sharma', class: '10', section: 'A', rollNo: '102', date: '2026-07-17', status: 'late', markedBy: 'Ravi Shankar' },
  { id: 28, studentName: 'Sneha Patel', class: '9', section: 'A', rollNo: '201', date: '2026-07-17', status: 'present', markedBy: 'Neha Singh' },
  { id: 29, studentName: 'Aditi Nair', class: '8', section: 'A', rollNo: '301', date: '2026-07-17', status: 'absent', markedBy: 'Sunita Murthy' },
  { id: 30, studentName: 'Ananya Gupta', class: '7', section: 'A', rollNo: '401', date: '2026-07-17', status: 'present', markedBy: 'Amit Kumar' },
];
