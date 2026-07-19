export interface Student {
  id: number;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  attendance: number;
  status: 'active' | 'inactive' | 'transferred';
  avatar?: string;
}

export const students: Student[] = [
  { id: 1, name: 'Arjun Kumar', class: '10', section: 'A', rollNo: '101', gender: 'Male', bloodGroup: 'O+', phone: '9876543210', email: 'arjun.k@example.com', address: '12, Green Park, Mumbai', attendance: 95, status: 'active' },
  { id: 2, name: 'Priya Sharma', class: '10', section: 'A', rollNo: '102', gender: 'Female', bloodGroup: 'A+', phone: '9876543211', email: 'priya.s@example.com', address: '45, Lake View, Mumbai', attendance: 92, status: 'active' },
  { id: 3, name: 'Mohammed Ali', class: '10', section: 'B', rollNo: '103', gender: 'Male', bloodGroup: 'B+', phone: '9876543212', email: 'mohammed.a@example.com', address: '78, Civil Lines, Delhi', attendance: 88, status: 'active' },
  { id: 4, name: 'Sneha Patel', class: '9', section: 'A', rollNo: '201', gender: 'Female', bloodGroup: 'AB+', phone: '9876543213', email: 'sneha.p@example.com', address: '34, Satellite Road, Ahmedabad', attendance: 97, status: 'active' },
  { id: 5, name: 'Rahul Das', class: '9', section: 'B', rollNo: '202', gender: 'Male', bloodGroup: 'O-', phone: '9876543214', email: 'rahul.d@example.com', address: '56, New Town, Kolkata', attendance: 78, status: 'active' },
  { id: 6, name: 'Aditi Nair', class: '8', section: 'A', rollNo: '301', gender: 'Female', bloodGroup: 'A-', phone: '9876543215', email: 'aditi.n@example.com', address: '90, Marine Drive, Kochi', attendance: 94, status: 'active' },
  { id: 7, name: 'Vikram Singh', class: '8', section: 'B', rollNo: '302', gender: 'Male', bloodGroup: 'B-', phone: '9876543216', email: 'vikram.s@example.com', address: '23, Malviya Nagar, Jaipur', attendance: 85, status: 'active' },
  { id: 8, name: 'Ananya Gupta', class: '7', section: 'A', rollNo: '401', gender: 'Female', bloodGroup: 'O+', phone: '9876543217', email: 'ananya.g@example.com', address: '67, Model Town, Delhi', attendance: 96, status: 'active' },
  { id: 9, name: 'Rohit Verma', class: '7', section: 'B', rollNo: '402', gender: 'Male', bloodGroup: 'AB-', phone: '9876543218', email: 'rohit.v@example.com', address: '15, BHEL Township, Haridwar', attendance: 82, status: 'active' },
  { id: 10, name: 'Kavita Reddy', class: '6', section: 'A', rollNo: '501', gender: 'Female', bloodGroup: 'A+', phone: '9876543219', email: 'kavita.r@example.com', address: '89, Jubilee Hills, Hyderabad', attendance: 91, status: 'active' },
  { id: 11, name: 'Amit Joshi', class: '6', section: 'B', rollNo: '502', gender: 'Male', bloodGroup: 'B+', phone: '9876543220', email: 'amit.j@example.com', address: '34, Shastri Nagar, Pune', attendance: 87, status: 'active' },
  { id: 12, name: 'Pooja Mehta', class: '5', section: 'A', rollNo: '601', gender: 'Female', bloodGroup: 'O+', phone: '9876543221', email: 'pooja.m@example.com', address: '56, Race Course Road, Baroda', attendance: 98, status: 'active' },
  { id: 13, name: 'Sunil Yadav', class: '5', section: 'B', rollNo: '602', gender: 'Male', bloodGroup: 'A+', phone: '9876543222', email: 'sunil.y@example.com', address: '12, Gandhi Nagar, Lucknow', attendance: 73, status: 'active' },
  { id: 14, name: 'Meera Iyer', class: '4', section: 'A', rollNo: '701', gender: 'Female', bloodGroup: 'AB+', phone: '9876543223', email: 'meera.i@example.com', address: '78, Besant Nagar, Chennai', attendance: 95, status: 'active' },
  { id: 15, name: 'Karan Chauhan', class: '4', section: 'B', rollNo: '702', gender: 'Male', bloodGroup: 'B+', phone: '9876543224', email: 'karan.c@example.com', address: '45, Vijay Nagar, Indore', attendance: 90, status: 'active' },
  { id: 16, name: 'Nisha Thakur', class: '3', section: 'A', rollNo: '801', gender: 'Female', bloodGroup: 'O-', phone: '9876543225', email: 'nisha.t@example.com', address: '23, Saket, Delhi', attendance: 88, status: 'active' },
  { id: 17, name: 'Deepak Bansal', class: '3', section: 'B', rollNo: '802', gender: 'Male', bloodGroup: 'A-', phone: '9876543226', email: 'deepak.b@example.com', address: '67, Vaishali Nagar, Jaipur', attendance: 76, status: 'active' },
  { id: 18, name: 'Ritu Agarwal', class: '2', section: 'A', rollNo: '901', gender: 'Female', bloodGroup: 'B-', phone: '9876543227', email: 'ritu.a@example.com', address: '89, Ashok Nagar, Mumbai', attendance: 99, status: 'active' },
  { id: 19, name: 'Gaurav Pandey', class: '2', section: 'B', rollNo: '902', gender: 'Male', bloodGroup: 'O+', phone: '9876543228', email: 'gaurav.p@example.com', address: '34, Gomti Nagar, Lucknow', attendance: 81, status: 'active' },
  { id: 20, name: 'Sonal Desai', class: '1', section: 'A', rollNo: '1001', gender: 'Female', bloodGroup: 'A+', phone: '9876543229', email: 'sonal.d@example.com', address: '12, Panchavati, Nashik', attendance: 93, status: 'active' },
  { id: 21, name: 'Harsh Shah', class: '1', section: 'B', rollNo: '1002', gender: 'Male', bloodGroup: 'AB+', phone: '9876543230', email: 'harsh.s@example.com', address: '56, Satellite, Ahmedabad', attendance: 86, status: 'active' },
  { id: 22, name: 'Neha Kapoor', class: '10', section: 'B', rollNo: '104', gender: 'Female', bloodGroup: 'B+', phone: '9876543231', email: 'neha.k@example.com', address: '78, Defence Colony, Delhi', attendance: 84, status: 'inactive' },
  { id: 23, name: 'Manish Tiwari', class: '9', section: 'A', rollNo: '203', gender: 'Male', bloodGroup: 'O+', phone: '9876543232', email: 'manish.t@example.com', address: '45, Lajpat Nagar, Delhi', attendance: 67, status: 'transferred' },
  { id: 24, name: 'Divya Bhat', class: '8', section: 'A', rollNo: '303', gender: 'Female', bloodGroup: 'A+', phone: '9876543233', email: 'divya.b@example.com', address: '90, Malleshwaram, Bangalore', attendance: 78, status: 'inactive' },
  { id: 25, name: 'Akash Jain', class: '7', section: 'A', rollNo: '403', gender: 'Male', bloodGroup: 'AB-', phone: '9876543234', email: 'akash.j@example.com', address: '23, Indiranagar, Bangalore', attendance: 92, status: 'active' },
];
