import {
  SchoolInfo,
  PendingApproval,
  SchoolKPI,
  AttendanceRecord,
  GradeDistribution,
  StudentPerformance,
  TeacherPerformance,
  BusRoute,
  LunchItem,
  SchoolEvent,
  NoticeItem,
} from '../types';

export const initialSchoolInfo: SchoolInfo = {
  name: 'Green Valley International School',
  code: 'GVIS-NY-2026',
  principal: {
    name: 'Dr. Sarah Johnson',
    title: 'Executive Principal & Head of Campus',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'sarah.johnson@greenvalley.edu',
  },
  academicYear: '2026–2027',
  term: 'Term 1',
  dateString: 'Wednesday, 22 July 2026',
  status: 'Open',
  totalStudents: 1900,
  presentStudents: 1842,
  totalTeachers: 115,
  presentTeachers: 112,
};

export const initialApprovals: PendingApproval[] = [
  {
    id: 'APP-101',
    title: 'Medical Leave Request (2 Days)',
    category: 'Leave',
    requestedBy: {
      name: 'Mr. Robert Vance',
      role: 'Physics Lead Teacher (Grade 11-12)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    date: 'Today, 7:45 AM',
    urgency: 'High',
    description: 'Requesting sick leave for July 23–24 due to acute bronchitis. Substitute teacher Ms. Henderson assigned to covering Grade 11 AP Physics.',
    status: 'Pending',
    department: 'Science',
  },
  {
    id: 'APP-102',
    title: 'Robotics STEM Lab Equipment Upgrade',
    category: 'Budget',
    requestedBy: {
      name: 'Dr. Marcus Thorne',
      role: 'Head of Technology & Robotics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    date: 'Yesterday, 4:30 PM',
    urgency: 'Medium',
    amount: 4200,
    description: 'Procurement of 6 VEX V5 Competition Kits and extra ultrasonic sensors for National Robotics Tournament preparation in October 2026.',
    status: 'Pending',
    department: 'STEM & Robotics',
  },
  {
    id: 'APP-103',
    title: 'Grade 9 Science Museum Educational Trip',
    category: 'Event',
    requestedBy: {
      name: 'Mrs. Claire Bennett',
      role: 'Grade 9 Academic Coordinator',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    date: '21 July 2026',
    urgency: 'Medium',
    amount: 1850,
    description: 'Excursion for 140 Grade 9 students to Metropolitan Museum of Science on Aug 12. Transport & entrance permissions attached.',
    status: 'Pending',
    department: 'Academics',
  },
  {
    id: 'APP-104',
    title: 'Cafeteria Incident #304 Resolution Approval',
    category: 'Discipline',
    requestedBy: {
      name: 'Coach David Miller',
      role: 'Dean of Student Discipline',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    date: '21 July 2026',
    urgency: 'Urgent',
    description: 'Review disciplinary recommendation for Grade 10 altercation. Proposed 2-day in-school detention & mandatory restorative counseling.',
    status: 'Pending',
    department: 'Student Life',
  },
  {
    id: 'APP-105',
    title: 'Senior Mathematics Faculty Offer - Ms. Elena Rostova',
    category: 'Hiring',
    requestedBy: {
      name: 'Ms. Patricia Hayes',
      role: 'HR Director',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    },
    date: '20 July 2026',
    urgency: 'High',
    amount: 82000,
    description: 'Final authorization to sign contract for Ms. Elena Rostova (M.Sc. Mathematics, 12 yrs IB experience) starting August 1, 2026.',
    status: 'Pending',
    department: 'Human Resources',
  },
];

export const initialKPIs: SchoolKPI[] = [
  {
    id: 'kpi-1',
    label: 'Student Attendance',
    value: '96.9%',
    target: '95.0%',
    unit: '1,842 / 1,900 Present',
    change: '+0.4% vs yesterday',
    isPositive: true,
    trend: [94.5, 95.2, 96.0, 95.8, 96.5, 96.9],
    category: 'Attendance',
    icon: 'Users',
  },
  {
    id: 'kpi-2',
    label: 'Teacher Presence',
    value: '97.4%',
    target: '98.0%',
    unit: '112 / 115 Faculty',
    change: '3 Substitutes active',
    isPositive: true,
    trend: [98, 97, 98.2, 96.5, 97.4],
    category: 'Staff',
    icon: 'UserCheck',
  },
  {
    id: 'kpi-3',
    label: 'Term 1 Fee Collection',
    value: '$1,245,000',
    target: '$1,340,000',
    unit: '92.9% Collected',
    change: '+$42,500 this week',
    isPositive: true,
    trend: [60, 72, 81, 88, 92.9],
    category: 'Finance',
    icon: 'DollarSign',
  },
  {
    id: 'kpi-4',
    label: 'School GPA Average',
    value: '3.68',
    target: '3.50',
    unit: '4.0 Scale',
    change: '+0.12 vs Term 4',
    isPositive: true,
    trend: [3.52, 3.58, 3.61, 3.65, 3.68],
    category: 'Academic',
    icon: 'GraduationCap',
  },
  {
    id: 'kpi-5',
    label: 'Active Bus Routes',
    value: '18 / 18',
    unit: '17 On-time, 1 Delayed',
    change: '17/18 On Schedule',
    isPositive: true,
    trend: [100, 100, 95, 100, 94.4],
    category: 'Transport',
    icon: 'Bus',
  },
  {
    id: 'kpi-6',
    label: 'Daily Cafeteria Meals',
    value: '1,620',
    unit: 'Meals served today',
    change: '98.2% Satisfaction',
    isPositive: true,
    trend: [1500, 1550, 1580, 1610, 1620],
    category: 'Attendance',
    icon: 'Utensils',
  },
];

export const weeklyAttendanceData: AttendanceRecord[] = [
  { day: 'Mon 17', grade6: 98, grade7: 96, grade8: 95, grade9: 94, grade10: 93, grade11: 96, grade12: 97, overall: 95.6 },
  { day: 'Tue 18', grade6: 97, grade7: 97, grade8: 96, grade9: 95, grade10: 94, grade11: 95, grade12: 96, overall: 95.8 },
  { day: 'Wed 19', grade6: 99, grade7: 98, grade8: 97, grade9: 96, grade10: 95, grade11: 97, grade12: 98, overall: 97.1 },
  { day: 'Thu 20', grade6: 96, grade7: 95, grade8: 94, grade9: 93, grade10: 92, grade11: 94, grade12: 95, overall: 94.1 },
  { day: 'Fri 21', grade6: 98, grade7: 96, grade8: 96, grade9: 95, grade10: 94, grade11: 96, grade12: 97, overall: 96.2 },
  { day: 'Mon 20', grade6: 98, grade7: 97, grade8: 96, grade9: 96, grade10: 95, grade11: 97, grade12: 98, overall: 96.7 },
  { day: 'Today', grade6: 99, grade7: 98, grade8: 97, grade9: 96, grade10: 95, grade11: 96, grade12: 97, overall: 96.9 },
];

export const gradeDistributionData: GradeDistribution[] = [
  { subject: 'STEM & Robotics', gradeA: 42, gradeB: 35, gradeC: 15, gradeD: 6, gradeF: 2, avgGPA: 3.75 },
  { subject: 'Mathematics AP', gradeA: 38, gradeB: 32, gradeC: 20, gradeD: 8, gradeF: 2, avgGPA: 3.62 },
  { subject: 'Physics & Bio', gradeA: 35, gradeB: 38, gradeC: 18, gradeD: 7, gradeF: 2, avgGPA: 3.58 },
  { subject: 'English & Lit', gradeA: 48, gradeB: 34, gradeC: 12, gradeD: 5, gradeF: 1, avgGPA: 3.82 },
  { subject: 'World History', gradeA: 40, gradeB: 36, gradeC: 16, gradeD: 6, gradeF: 2, avgGPA: 3.68 },
  { subject: 'Fine Arts & Music', gradeA: 58, gradeB: 28, gradeC: 10, gradeD: 3, gradeF: 1, avgGPA: 3.91 },
];

export const topStudents: StudentPerformance[] = [
  {
    id: 'STU-001',
    name: 'Sophia Chen',
    grade: 'Grade 12',
    gpa: 4.0,
    attendancePct: 99.5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    achievements: ['National Merit Scholar Finalist', 'Robotics Captain', 'AP Chem 5'],
    status: 'Honor Roll',
    parentContact: 'm.chen@domain.com (+1 555-0192)',
  },
  {
    id: 'STU-002',
    name: 'Alexander Wright',
    grade: 'Grade 11',
    gpa: 3.96,
    attendancePct: 98.8,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    achievements: ['Math Olympiad Gold', 'Debate Club President'],
    status: 'Honor Roll',
    parentContact: 'j.wright@domain.com (+1 555-0144)',
  },
  {
    id: 'STU-003',
    name: 'Aaliyah Patel',
    grade: 'Grade 10',
    gpa: 3.94,
    attendancePct: 100.0,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    achievements: ['Perfect Attendance', 'Orchestra Concertmaster'],
    status: 'Honor Roll',
    parentContact: 'r.patel@domain.com (+1 555-0188)',
  },
];

export const atRiskStudents: StudentPerformance[] = [
  {
    id: 'STU-108',
    name: 'Ethan Brooks',
    grade: 'Grade 10',
    gpa: 2.15,
    attendancePct: 82.4,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    achievements: ['Varsity Track'],
    status: 'At-Risk',
    riskReason: 'Unexcused absences (8 days in July), failing Algebra II tests.',
    parentContact: 'd.brooks@domain.com (+1 555-0311)',
  },
  {
    id: 'STU-109',
    name: 'Maya Lin',
    grade: 'Grade 11',
    gpa: 2.38,
    attendancePct: 86.0,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    achievements: ['Art Club'],
    status: 'At-Risk',
    riskReason: 'Physics grade dropped from B+ to D-. Missing lab submission.',
    parentContact: 'h.lin@domain.com (+1 555-0377)',
  },
];

export const teachersSummary: TeacherPerformance[] = [
  {
    id: 'TCH-01',
    name: 'Dr. Marcus Thorne',
    department: 'STEM & Tech',
    classesTaught: ['Grade 11 Computer Science', 'Grade 12 AP Robotics'],
    studentRating: 4.9,
    attendancePct: 99.2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'Active',
  },
  {
    id: 'TCH-02',
    name: 'Mrs. Claire Bennett',
    department: 'Humanities',
    classesTaught: ['Grade 9 World Literature', 'Grade 10 AP English'],
    studentRating: 4.8,
    attendancePct: 98.5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    status: 'Active',
  },
  {
    id: 'TCH-03',
    name: 'Mr. Robert Vance',
    department: 'Science',
    classesTaught: ['Grade 11 Physics', 'Grade 12 AP Physics C'],
    studentRating: 4.7,
    attendancePct: 94.0,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'Substitute Assigned',
  },
];

export const busRoutesData: BusRoute[] = [
  {
    id: 'BUS-01',
    routeName: 'Route #01 - North Hills & Pine Crest',
    busNumber: 'Bus #12',
    driverName: 'Samuel Jackson',
    driverPhone: '+1 (555) 234-5678',
    status: 'On-Time',
    studentsCount: 42,
    capacity: 48,
    currentLat: 40.7128,
    currentLng: -74.006,
    speedKmH: 34,
    eta: '8:22 AM (On Schedule)',
    stops: [
      { name: 'North Hills Community Center', time: '7:45 AM', passed: true },
      { name: 'Pine Crest Ave & 4th', time: '8:00 AM', passed: true },
      { name: 'West Gate Entrance', time: '8:15 AM', passed: true },
      { name: 'Main Campus Drop-off', time: '8:22 AM', passed: false },
    ],
  },
  {
    id: 'BUS-02',
    routeName: 'Route #04 - South Bay Express',
    busNumber: 'Bus #04',
    driverName: 'Maria Rodriguez',
    driverPhone: '+1 (555) 345-6789',
    status: 'Delayed',
    studentsCount: 38,
    capacity: 48,
    currentLat: 40.728,
    currentLng: -73.992,
    speedKmH: 12,
    eta: '8:31 AM (+6 mins traffic)',
    stops: [
      { name: 'South Bay Plaza', time: '7:40 AM', passed: true },
      { name: 'Harbor Drive', time: '7:55 AM', passed: true },
      { name: 'Pine Street Junction (Traffic)', time: '8:15 AM', passed: true },
      { name: 'Main Campus Drop-off', time: '8:31 AM', passed: false },
    ],
  },
  {
    id: 'BUS-03',
    routeName: 'Route #07 - Eastside & College Park',
    busNumber: 'Bus #07',
    driverName: 'David Chen',
    driverPhone: '+1 (555) 456-7890',
    status: 'On-Time',
    studentsCount: 45,
    capacity: 48,
    currentLat: 40.735,
    currentLng: -73.98,
    speedKmH: 40,
    eta: '8:20 AM (Arriving)',
    stops: [
      { name: 'College Park Station', time: '7:35 AM', passed: true },
      { name: 'Eastside Mall', time: '7:50 AM', passed: true },
      { name: 'Oak Avenue', time: '8:05 AM', passed: true },
      { name: 'Main Campus Drop-off', time: '8:20 AM', passed: false },
    ],
  },
];

export const todayLunchMenu: LunchItem[] = [
  { id: 'L-1', category: 'Main', name: 'Herb Roasted Chicken breast with Wild Rice', calories: 520, allergens: ['Gluten-Free'], servedCount: 740 },
  { id: 'L-2', category: 'Vegetarian', name: 'Artisanal Veg Penne Arrabbiata with Garlic Bread', calories: 480, allergens: ['Dairy', 'Gluten'], servedCount: 520 },
  { id: 'L-3', category: 'Soup/Salad', name: 'Fresh Garden Cobb Salad & Tomato Basil Soup', calories: 290, allergens: ['Egg', 'Vegan option available'], servedCount: 260 },
  { id: 'L-4', category: 'Dessert', name: 'Organic Fresh Fruit Bowl & Frozen Yogurt', calories: 140, allergens: ['Dairy-Free available'], servedCount: 1620 },
];

export const upcomingEvents: SchoolEvent[] = [
  {
    id: 'EVT-1',
    title: 'Annual STEM & Robotics Expo 2026',
    date: 'Friday, 24 July 2026',
    time: '9:00 AM - 3:00 PM',
    location: 'Main Auditorium & STEM Hall',
    category: 'Academic',
    organizer: 'Dr. Marcus Thorne',
    attendeesCount: 450,
  },
  {
    id: 'EVT-2',
    title: 'Term 1 Parent-Teacher Strategy Conference',
    date: 'Tuesday, 28 July 2026',
    time: '2:00 PM - 6:30 PM',
    location: 'Gymnasium & Classrooms',
    category: 'Administrative',
    organizer: 'Academic Committee',
    attendeesCount: 820,
  },
  {
    id: 'EVT-3',
    title: 'Inter-School Swimming Championship',
    date: 'Saturday, 1 August 2026',
    time: '8:30 AM - 1:00 PM',
    location: 'Aquatic Center',
    category: 'Sports',
    organizer: 'Coach David Miller',
    attendeesCount: 310,
  },
];

export const urgentNotices: NoticeItem[] = [
  {
    id: 'NOT-1',
    title: 'West Gate Road Construction Traffic Advisory',
    author: 'Principal Dr. Sarah Johnson',
    date: 'Today, 7:15 AM',
    category: 'Transport',
    content: 'City municipal roadwork on Pine Street near West Gate may cause 5-8 minute delays for Buses #04 and #09. Traffic monitors deployed.',
    pinned: true,
  },
  {
    id: 'NOT-2',
    title: 'Mid-Term Exam Schedule Published',
    author: 'Academic Office',
    date: '20 July 2026',
    category: 'Academic',
    content: 'The official Term 1 examination timetable for Grades 9-12 is now available on the SchoolOS student portal. Exam week commences Aug 10.',
    pinned: false,
  },
];

export const actionCenterItemsData = [
  {
    id: 'AC-01',
    severity: 'red' as const,
    title: '12 Students absent for 3 consecutive days',
    category: 'Student Attendance Alert',
    time: '8:15 AM Today',
    actionRequired: 'Automated SMS sent to parents. Counselor review pending.',
  },
  {
    id: 'AC-02',
    severity: 'orange' as const,
    title: 'Bus #7 delayed by 25 mins',
    category: 'Transport Incident',
    time: '8:05 AM Today',
    actionRequired: 'Driver reported minor radiator check. Backup Bus #14 standing by.',
  },
  {
    id: 'AC-03',
    severity: 'red' as const,
    title: 'Fee collection below target (Grade 9 Section B)',
    category: 'Financial Alert',
    time: 'Yesterday',
    actionRequired: '14 installment reminders pending email dispatch.',
  },
  {
    id: 'AC-04',
    severity: 'yellow' as const,
    title: 'Science Lead Mr. Vance absent today',
    category: 'Faculty Coverage',
    time: '7:30 AM Today',
    actionRequired: 'Substitute Ms. Henderson assigned for Grade 11 AP Physics.',
  },
  {
    id: 'AC-05',
    severity: 'green' as const,
    title: 'Annual Fire Drill completed successfully',
    category: 'Campus Safety',
    time: 'Yesterday, 2:15 PM',
    actionRequired: 'Campus evacuated in 3 min 40 sec. Safety Auditor score: 100%.',
  },
  {
    id: 'AC-06',
    severity: 'red' as const,
    title: '2 Smart Boards Offline (Room 204 & Room 308)',
    category: 'IT Infrastructure',
    time: '8:00 AM Today',
    actionRequired: 'IT helpdesk ticket #409 generated for firmware reset.',
  },
];

export const principalCalendarEventsData = [
  {
    id: 'CAL-1',
    time: '09:00 AM',
    title: 'Executive Staff & HOD Coordination Meeting',
    location: 'Main Board Room',
    day: 'Today' as const,
    type: 'Meeting' as const,
  },
  {
    id: 'CAL-2',
    time: '10:30 AM',
    title: 'Parent Advisory Council Representative Briefing',
    location: 'Principal Suite',
    day: 'Today' as const,
    type: 'Meeting' as const,
  },
  {
    id: 'CAL-3',
    time: '01:00 PM',
    title: 'Classroom Quality Observation (Grade 10 AP Physics)',
    location: 'Science Building Room 204',
    day: 'Today' as const,
    type: 'Observation' as const,
  },
  {
    id: 'CAL-4',
    time: '03:00 PM',
    title: 'Term 1 Budget & Infrastructure Review',
    location: 'Conference Room B',
    day: 'Today' as const,
    type: 'Review' as const,
  },
  {
    id: 'CAL-5',
    time: '09:30 AM',
    title: 'Science & STEM Fair Final Walkthrough',
    location: 'Auditorium',
    day: 'Tomorrow' as const,
    type: 'Inspection' as const,
  },
  {
    id: 'CAL-6',
    time: '11:00 AM',
    title: 'Sports Facility & Aquatic Center Review',
    location: 'Sports Complex',
    day: 'Tomorrow' as const,
    type: 'Inspection' as const,
  },
  {
    id: 'CAL-7',
    time: '02:15 PM',
    title: 'State Education Department Quality Audit',
    location: 'Principal Conference Room',
    day: 'Tomorrow' as const,
    type: 'Review' as const,
  },
];

export const schoolAlertsData = [
  {
    id: 'ALT-1',
    severity: 'red' as const,
    title: 'Attendance below 90% in Grade 8',
    detail: 'Overall attendance in Grade 8 dropped to 88.4% today due to seasonal flu cases.',
    category: 'Attendance' as const,
  },
  {
    id: 'ALT-2',
    severity: 'orange' as const,
    title: 'Two Buses Delayed (Bus #04 & Bus #07)',
    detail: 'Traffic bottleneck near Pine Street & West Gate crossing causing 10-15 min delays.',
    category: 'Transport' as const,
  },
  {
    id: 'ALT-3',
    severity: 'yellow' as const,
    title: 'Cafeteria Inventory Low',
    detail: 'Fresh organic dairy & bakery supplies low. Restock delivery expected by 11:30 AM.',
    category: 'Inventory' as const,
  },
  {
    id: 'ALT-4',
    severity: 'green' as const,
    title: 'CCTV Surveillance Network Healthy',
    detail: 'All 128 campus HD cameras operational with 30-day encrypted Cloud NVR storage.',
    category: 'Facility' as const,
  },
  {
    id: 'ALT-5',
    severity: 'green' as const,
    title: 'High-Speed Campus Internet Online',
    detail: 'Primary 1 Gbps Fiber connection active at 100% bandwidth capacity with failover ready.',
    category: 'Network' as const,
  },
];

export const activityLogsData = [
  {
    id: 'ACT-01',
    time: '10:45 AM',
    title: 'Mid-Term Exam Schedule Approved',
    actor: 'Dr. Sarah Johnson (Principal)',
    type: 'Approval' as const,
  },
  {
    id: 'ACT-02',
    time: '10:20 AM',
    title: 'Grade 10 New Admission Candidate Approved',
    actor: 'Admissions Office',
    type: 'Admission' as const,
  },
  {
    id: 'ACT-03',
    time: '09:55 AM',
    title: 'Medical Leave Approved (Mr. Robert Vance)',
    actor: 'Dr. Sarah Johnson (Principal)',
    type: 'Leave' as const,
  },
  {
    id: 'ACT-04',
    time: '09:40 AM',
    title: 'Term Fee Payment Collected ($18,000)',
    actor: 'Finance Department',
    type: 'Finance' as const,
  },
  {
    id: 'ACT-05',
    time: '09:15 AM',
    title: 'Morning Attendance Submitted (100% Homerooms)',
    actor: 'Faculty Portal',
    type: 'Attendance' as const,
  },
];

export const academicHealthData = {
  avgGPA: 3.76,
  assignmentsSubmittedPct: 94,
  syllabusCompletionPct: 89,
  weakSubjects: ['Physics AP', 'Chemistry Honors'],
};

export const departmentPerformanceData = [
  { department: 'Mathematics AP & IB', performancePct: 95, headName: 'Dr. Elena Rostova', teachersCount: 18 },
  { department: 'Physical Sciences', performancePct: 91, headName: 'Mr. Robert Vance', teachersCount: 22 },
  { department: 'Languages & Literature', performancePct: 93, headName: 'Mrs. Claire Bennett', teachersCount: 16 },
  { department: 'Commerce & Humanities', performancePct: 97, headName: 'Dr. Arthur Pendelton', teachersCount: 14 },
  { department: 'Athletics & Physical Ed', performancePct: 99, headName: 'Coach David Miller', teachersCount: 12 },
];

export const classroomStatusData = {
  total: 72,
  active: 70,
  maintenance: 1,
  closed: 1,
  smartBoardsOffline: 2,
};

export const infrastructureData = [
  { name: 'Electricity Grid', status: 'Normal' as const, badgeColor: 'emerald' as const, detail: 'Main Grid + Solar Backup (85 kW)', icon: 'Zap' },
  { name: 'Fiber Internet', status: 'Online' as const, badgeColor: 'emerald' as const, detail: '1 Gbps Primary Symmetrical Fiber', icon: 'Wifi' },
  { name: 'CCTV Network', status: '100%' as const, badgeColor: 'emerald' as const, detail: '128 / 128 Cameras Operational', icon: 'Video' },
  { name: 'Diesel Generator', status: 'Ready' as const, badgeColor: 'emerald' as const, detail: 'Auto Switch • Fuel level 95%', icon: 'Power' },
  { name: 'Water Storage Tank', status: '80%' as const, badgeColor: 'emerald' as const, detail: '40,000 Liters Clean Storage', icon: 'Droplets' },
];

export const admissionSummaryData = {
  pending: 24,
  approved: 182,
  rejected: 7,
  waitingList: 15,
};

export const inventorySummaryData = {
  labEquipment: 'Healthy (98% Calibrated)',
  libraryBooks: '12 Missing / Overdue',
  sportsEquipment: 'Need Approval (3 Nets)',
  itAssets: '98% Functional (310 Laptops)',
};

export const staffSummaryData = {
  teachers: 115,
  adminStaff: 28,
  supportStaff: 42,
  tempStaff: 7,
};

export const parentEngagementData = {
  appActivePct: 96,
  unreadNotices: 214,
  meetingsScheduled: 34,
};

