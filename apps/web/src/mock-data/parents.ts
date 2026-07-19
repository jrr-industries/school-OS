export interface Parent {
  id: number;
  name: string;
  relationship: string;
  children: number;
  childrenNames: string[];
  phone: string;
  email: string;
  occupation: string;
  address: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export const parents: Parent[] = [
  { id: 1, name: 'Rajesh Kumar', relationship: 'Father', children: 2, childrenNames: ['Arjun Kumar', 'Ananya Kumar'], phone: '9876511001', email: 'rajesh.kumar@example.com', occupation: 'Business Owner', address: '12, Green Park, Mumbai', status: 'active', joinedDate: '2020-06-15' },
  { id: 2, name: 'Lakshmi Devi', relationship: 'Mother', children: 1, childrenNames: ['Priya Sharma'], phone: '9876511002', email: 'lakshmi.d@example.com', occupation: 'Teacher', address: '45, Lake View, Mumbai', status: 'active', joinedDate: '2020-06-15' },
  { id: 3, name: 'Ahmed Khan', relationship: 'Father', children: 2, childrenNames: ['Mohammed Ali', 'Fatima Ali'], phone: '9876511003', email: 'ahmed.khan@example.com', occupation: 'Doctor', address: '78, Civil Lines, Delhi', status: 'active', joinedDate: '2020-09-01' },
  { id: 4, name: 'David Joseph', relationship: 'Father', children: 1, childrenNames: ['Sneha Patel'], phone: '9876511004', email: 'david.j@example.com', occupation: 'Software Engineer', address: '34, Satellite Road, Ahmedabad', status: 'active', joinedDate: '2021-04-10' },
  { id: 5, name: 'Meera Das', relationship: 'Mother', children: 2, childrenNames: ['Rahul Das', 'Maya Das'], phone: '9876511005', email: 'meera.d@example.com', occupation: 'Nurse', address: '56, New Town, Kolkata', status: 'active', joinedDate: '2020-06-15' },
  { id: 6, name: 'Suresh Nair', relationship: 'Father', children: 1, childrenNames: ['Aditi Nair'], phone: '9876511006', email: 'suresh.n@example.com', occupation: 'Bank Manager', address: '90, Marine Drive, Kochi', status: 'active', joinedDate: '2021-07-20' },
  { id: 7, name: 'Harpreet Singh', relationship: 'Father', children: 3, childrenNames: ['Vikram Singh', 'Simran Singh', 'Gurpreet Singh'], phone: '9876511007', email: 'harpreet.s@example.com', occupation: 'Government Officer', address: '23, Malviya Nagar, Jaipur', status: 'active', joinedDate: '2020-08-05' },
  { id: 8, name: 'Priyanka Gupta', relationship: 'Mother', children: 1, childrenNames: ['Ananya Gupta'], phone: '9876511008', email: 'priyanka.g@example.com', occupation: 'Lawyer', address: '67, Model Town, Delhi', status: 'active', joinedDate: '2021-03-15' },
  { id: 9, name: 'Sanjay Verma', relationship: 'Father', children: 2, childrenNames: ['Rohit Verma', 'Kriti Verma'], phone: '9876511009', email: 'sanjay.v@example.com', occupation: 'Architect', address: '15, BHEL Township, Haridwar', status: 'active', joinedDate: '2021-04-22' },
  { id: 10, name: 'Sita Reddy', relationship: 'Mother', children: 1, childrenNames: ['Kavita Reddy'], phone: '9876511010', email: 'sita.r@example.com', occupation: 'Professor', address: '89, Jubilee Hills, Hyderabad', status: 'active', joinedDate: '2022-01-10' },
  { id: 11, name: 'Ramesh Joshi', relationship: 'Father', children: 2, childrenNames: ['Amit Joshi', 'Neha Joshi'], phone: '9876511011', email: 'ramesh.j@example.com', occupation: 'Chartered Accountant', address: '34, Shastri Nagar, Pune', status: 'active', joinedDate: '2021-06-01' },
  { id: 12, name: 'Anita Mehta', relationship: 'Mother', children: 1, childrenNames: ['Pooja Mehta'], phone: '9876511012', email: 'anita.m@example.com', occupation: 'Homemaker', address: '56, Race Course Road, Baroda', status: 'active', joinedDate: '2022-04-18' },
  { id: 13, name: 'Dinesh Yadav', relationship: 'Father', children: 2, childrenNames: ['Sunil Yadav', 'Ravi Yadav'], phone: '9876511013', email: 'dinesh.y@example.com', occupation: 'Farmer', address: '12, Gandhi Nagar, Lucknow', status: 'active', joinedDate: '2021-09-05' },
  { id: 14, name: 'Radha Iyer', relationship: 'Mother', children: 1, childrenNames: ['Meera Iyer'], phone: '9876511014', email: 'radha.i@example.com', occupation: 'Musician', address: '78, Besant Nagar, Chennai', status: 'active', joinedDate: '2022-07-12' },
  { id: 15, name: 'Mahesh Chauhan', relationship: 'Father', children: 2, childrenNames: ['Karan Chauhan', 'Aarti Chauhan'], phone: '9876511015', email: 'mahesh.c@example.com', occupation: 'Business', address: '45, Vijay Nagar, Indore', status: 'inactive', joinedDate: '2022-10-20' },
  { id: 16, name: 'Prakash Thakur', relationship: 'Father', children: 1, childrenNames: ['Nisha Thakur'], phone: '9876511016', email: 'prakash.t@example.com', occupation: 'Police Officer', address: '23, Saket, Delhi', status: 'active', joinedDate: '2023-01-15' },
  { id: 17, name: 'Sarita Bansal', relationship: 'Mother', children: 2, childrenNames: ['Deepak Bansal', 'Pooja Bansal'], phone: '9876511017', email: 'sarita.b@example.com', occupation: 'Doctor', address: '67, Vaishali Nagar, Jaipur', status: 'active', joinedDate: '2022-05-30' },
  { id: 18, name: 'Vijay Agarwal', relationship: 'Father', children: 1, childrenNames: ['Ritu Agarwal'], phone: '9876511018', email: 'vijay.a@example.com', occupation: 'Businessman', address: '89, Ashok Nagar, Mumbai', status: 'active', joinedDate: '2023-04-01' },
  { id: 19, name: 'Rekha Pandey', relationship: 'Mother', children: 3, childrenNames: ['Gaurav Pandey', 'Shalini Pandey', 'Rajan Pandey'], phone: '9876511019', email: 'rekha.p@example.com', occupation: 'Teacher', address: '34, Gomti Nagar, Lucknow', status: 'active', joinedDate: '2022-08-14' },
  { id: 20, name: 'Mohan Desai', relationship: 'Father', children: 1, childrenNames: ['Sonal Desai'], phone: '9876511020', email: 'mohan.d@example.com', occupation: 'Engineer', address: '12, Panchavati, Nashik', status: 'active', joinedDate: '2023-06-10' },
];
