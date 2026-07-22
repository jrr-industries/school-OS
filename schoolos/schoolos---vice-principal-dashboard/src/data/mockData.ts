import {
  UrgentActionItem,
  TeacherRecord,
  StudentAlertItem,
  CampusFacility,
  TimelineActivity,
  Announcement,
  SyllabusItem,
  ExamOperationData,
  NotificationItem,
  QuickStats
} from '../types';

export const INITIAL_STATS: QuickStats = {
  classesRunning: 72,
  totalClasses: 72,
  teachersPresent: 108,
  totalTeachers: 115,
  studentsPresent: 1842,
  totalStudents: 1900,
  lateStudents: 28,
  teacherLeaves: 3,
  substituteTeachers: 3,
  attendanceSubmittedCount: 68,
  totalAttendanceClasses: 72
};

export const INITIAL_URGENT_ACTIONS: UrgentActionItem[] = [
  {
    id: 'urg-1',
    title: 'Physics Teacher Absent (Period 3 & 4)',
    category: 'absence',
    severity: 'high',
    description: 'Dr. Robert Harrison called in sick at 09:15 AM. Grade 11 AP Physics (Room 204) needs an immediate substitute.',
    location: 'Room 204 • Science Block',
    timeReported: '09:15 AM',
    actionText: 'Assign Substitute',
    status: 'pending',
    relatedTeacherId: 'tch-1'
  },
  {
    id: 'urg-2',
    title: 'Grade 8 Discipline Case',
    category: 'discipline',
    severity: 'medium',
    description: 'Disruption during Mathematics in Room 302 involving two students. Teacher requested VP administrative review.',
    location: 'Room 302 • Middle Wing',
    timeReported: '10:05 AM',
    actionText: 'Review Incident',
    status: 'pending',
    relatedStudentId: 'std-201'
  },
  {
    id: 'urg-3',
    title: 'Bus #5 Delayed - Highway Traffic',
    category: 'transport',
    severity: 'high',
    description: 'Bus #5 delayed by 25 mins due to accident on North Expressway. 22 students affected, parents requesting updates.',
    location: 'North Route #5',
    timeReported: '08:45 AM',
    actionText: 'Notify Parents',
    status: 'pending',
    busNumber: 'Bus #5'
  },
  {
    id: 'urg-4',
    title: 'Attendance Missing (4 Teachers)',
    category: 'attendance',
    severity: 'low',
    description: 'Period 1 & 2 attendance not submitted for Math 9B, History 10A, Art 7C, and Bio 11C.',
    location: '4 Classrooms',
    timeReported: '09:30 AM',
    actionText: 'Send Reminder',
    status: 'pending'
  },
  {
    id: 'urg-5',
    title: 'Parent Complaint - Grade 10 Grading Inquiry',
    category: 'complaint',
    severity: 'high',
    description: 'Mrs. Jenkins submitted an urgent formal appeal regarding Grade 10 Chemistry term paper score.',
    location: 'Admin Office / Portal',
    timeReported: '09:50 AM',
    actionText: 'Review Appeal',
    status: 'pending'
  }
];

export const INITIAL_TEACHERS: TeacherRecord[] = [
  {
    id: 'tch-1',
    name: 'Dr. Robert Harrison',
    department: 'Science & Physics',
    currentClass: 'Grade 11 AP Physics',
    room: 'Room 204',
    status: 'On Leave',
    substituteName: 'Pending Assignment',
    workloadPeriods: 5,
    phone: '+1 (555) 234-5678',
    email: 'r.harrison@greenvalley.edu'
  },
  {
    id: 'tch-2',
    name: 'Ms. Clara Vance',
    department: 'Mathematics',
    currentClass: 'Grade 10 Calculus',
    room: 'Room 301',
    status: 'Substitute Assigned',
    substituteName: 'Mr. Alan Turing (Free P4)',
    workloadPeriods: 4,
    phone: '+1 (555) 345-6789',
    email: 'c.vance@greenvalley.edu'
  },
  {
    id: 'tch-3',
    name: 'Mr. Marcus Brody',
    department: 'Humanities & History',
    currentClass: 'Grade 9 World History',
    room: 'Room 112',
    status: 'Present',
    workloadPeriods: 5,
    phone: '+1 (555) 456-7890',
    email: 'm.brody@greenvalley.edu'
  },
  {
    id: 'tch-4',
    name: 'Dr. Evelyn Reed',
    department: 'Chemistry & Bio',
    currentClass: 'Grade 12 Bio Lab',
    room: 'Lab B',
    status: 'In Observation',
    workloadPeriods: 4,
    phone: '+1 (555) 567-8901',
    email: 'e.reed@greenvalley.edu'
  },
  {
    id: 'tch-5',
    name: 'Mr. James Sterling',
    department: 'English Literature',
    currentClass: 'Grade 8 Literature',
    room: 'Room 208',
    status: 'Late',
    workloadPeriods: 5,
    phone: '+1 (555) 678-9012',
    email: 'j.sterling@greenvalley.edu'
  },
  {
    id: 'tch-6',
    name: 'Mrs. Sarah Connor',
    department: 'Computer Science',
    currentClass: 'Grade 10 Robotics',
    room: 'CS Lab 1',
    status: 'Present',
    workloadPeriods: 6,
    phone: '+1 (555) 789-0123',
    email: 's.connor@greenvalley.edu'
  },
  {
    id: 'tch-7',
    name: 'Mr. David Hassel',
    department: 'Physical Education',
    currentClass: 'Grade 7 Outdoor Sports',
    room: 'Main Gymnasium',
    status: 'Present',
    workloadPeriods: 4,
    phone: '+1 (555) 890-1234',
    email: 'd.hassel@greenvalley.edu'
  }
];

export const INITIAL_STUDENT_ALERTS: StudentAlertItem[] = [
  {
    id: 'std-1',
    studentName: 'Ethan Carter',
    gradeClass: 'Grade 10-A',
    type: 'Late Arrival',
    details: 'Arrived at Gate A at 08:42 AM (32 mins late). 3rd late entry this week.',
    timestamp: '08:42 AM',
    severity: 'medium',
    status: 'Open',
    actionNeeded: 'Issue Detention Pass / Contact Parent'
  },
  {
    id: 'std-2',
    studentName: 'Maya Patel',
    gradeClass: 'Grade 8-C',
    type: 'Discipline',
    details: 'Disrupted Period 3 Math class. Refused teacher instructions.',
    timestamp: '10:05 AM',
    severity: 'high',
    status: 'Open',
    actionNeeded: 'VP Office Administrative Hearing'
  },
  {
    id: 'std-3',
    studentName: 'Lucas Thorne',
    gradeClass: 'Grade 11-B',
    type: 'Medical',
    details: 'Visited Medical Room with mild fever (38.1°C). Resting in infirmary.',
    timestamp: '09:50 AM',
    severity: 'medium',
    status: 'Addressed',
    actionNeeded: 'Parent Pick-up Requested'
  },
  {
    id: 'std-4',
    studentName: 'Sophia Lin',
    gradeClass: 'Grade 9-D',
    type: 'Counseling',
    details: 'Scheduled routine academic counseling session with Ms. Adams.',
    timestamp: '10:30 AM',
    severity: 'low',
    status: 'Addressed',
    actionNeeded: 'Counselor Follow-up'
  },
  {
    id: 'std-5',
    studentName: 'Benjamin Hayes',
    gradeClass: 'Grade 12-A',
    type: 'Parent Meeting',
    details: 'Parent meeting scheduled at 02:00 PM regarding AP Exam enrollment.',
    timestamp: '11:00 AM',
    severity: 'low',
    status: 'Open',
    actionNeeded: 'Confirm Room 102 Conference'
  }
];

export const INITIAL_FACILITIES: CampusFacility[] = [
  {
    id: 'fac-1',
    name: 'Weather',
    category: 'weather',
    statusText: '24°C • Mostly Sunny',
    isOperational: true,
    metric: 'Humidity 48%',
    details: 'Favorable conditions for outdoor PE and outdoor assembly.',
    iconName: 'Sun',
    lastChecked: '10:30 AM'
  },
  {
    id: 'fac-2',
    name: 'Perimeter Security',
    category: 'security',
    statusText: 'Perimeter Secure',
    isOperational: true,
    metric: '4 Guards Active',
    details: 'All 4 security check-points manned. RFID card scanners 100% active.',
    iconName: 'ShieldCheck',
    lastChecked: '10:40 AM'
  },
  {
    id: 'fac-3',
    name: 'CCTV Surveillance',
    category: 'cctv',
    statusText: '64 / 64 Cameras Online',
    isOperational: true,
    metric: '100% Signal',
    details: 'All corridors, gates, playgrounds, and labs feed live to command desk.',
    iconName: 'Camera',
    lastChecked: '10:42 AM'
  },
  {
    id: 'fac-4',
    name: 'Visitor Center',
    category: 'visitors',
    statusText: '14 Checked In',
    isOperational: true,
    metric: '3 Currently On-Site',
    details: 'All visitors wearing temporary RFID badges. Escorts assigned.',
    iconName: 'UserCheck',
    lastChecked: '10:35 AM'
  },
  {
    id: 'fac-5',
    name: 'School Gates',
    category: 'gates',
    statusText: 'Gates A & B Locked',
    isOperational: true,
    metric: 'Visitor Gate C Active',
    details: 'Main vehicular gates closed post-morning drop off. Pedestrian Gate C monitored.',
    iconName: 'DoorClosed',
    lastChecked: '09:00 AM'
  },
  {
    id: 'fac-6',
    name: 'Electricity & Backup',
    category: 'utility',
    statusText: 'Grid Power Normal',
    isOperational: true,
    metric: 'UPS 100% • Gen Standby',
    details: 'Main sub-station operating smoothly. Automatic backup generator primed.',
    iconName: 'Zap',
    lastChecked: '10:15 AM'
  },
  {
    id: 'fac-7',
    name: 'Network & Internet',
    category: 'utility',
    statusText: '1 Gbps Fiber Online',
    isOperational: true,
    metric: '99.9% Uptime',
    details: 'Main school Wi-Fi and Smartboard classroom networks operational.',
    iconName: 'Wifi',
    lastChecked: '10:40 AM'
  },
  {
    id: 'fac-8',
    name: 'Water Supply',
    category: 'utility',
    statusText: 'Tanks at 92%',
    isOperational: true,
    metric: 'RO Plant Active',
    details: 'Drinking water stations tested safe. Water pressure normal in all blocks.',
    iconName: 'Droplets',
    lastChecked: '08:00 AM'
  },
  {
    id: 'fac-9',
    name: 'Bus Transport Fleet',
    category: 'transport',
    statusText: '11 / 12 On Schedule',
    isOperational: false,
    metric: 'Bus #5 Delayed',
    details: '11 routes completed morning drop-off smoothly. Bus #5 delayed by 25m.',
    iconName: 'Bus',
    lastChecked: '10:20 AM'
  },
  {
    id: 'fac-10',
    name: 'Cafeteria & Kitchen',
    category: 'kitchen',
    statusText: 'Lunch Prep On Time',
    isOperational: true,
    metric: 'Serving at 11:45 AM',
    details: 'Food safety audit passed at 07:30 AM. Hot lunch prep in progress.',
    iconName: 'Utensils',
    lastChecked: '10:00 AM'
  }
];

export const INITIAL_TIMELINE: TimelineActivity[] = [
  {
    id: 'act-1',
    timestamp: '10:42 AM',
    title: 'Attendance Completed',
    description: 'Grade 10-B roll call submitted by Mr. Henderson. All 28 students accounted for.',
    category: 'attendance',
    actor: 'Mr. Henderson',
    statusTag: 'System Auto Log'
  },
  {
    id: 'act-2',
    timestamp: '10:25 AM',
    title: 'Teacher Leave Submitted',
    description: 'Ms. Clara Vance logged emergency leave for Period 5-7. Substitute request auto-generated.',
    category: 'leave',
    actor: 'Ms. Clara Vance',
    statusTag: 'Action Required'
  },
  {
    id: 'act-3',
    timestamp: '10:10 AM',
    title: 'Parent Meeting Scheduled',
    description: 'Conference arranged with Mr. & Mrs. Miller regarding Grade 9 Academic Progress.',
    category: 'parent',
    actor: 'Counseling Dept',
    statusTag: 'Confirmed'
  },
  {
    id: 'act-4',
    timestamp: '09:58 AM',
    title: 'Class Inspection Completed',
    description: 'VP David Miller performed routine walk-through of Science Lab 2 (Grade 12 Chemistry).',
    category: 'inspection',
    actor: 'David Miller (VP)',
    statusTag: 'Verified'
  },
  {
    id: 'act-5',
    timestamp: '09:40 AM',
    title: 'Bus 7 Arrived at Campus',
    description: 'Arrived 10 minutes past main bell due to wet road conditions. 18 late arrivals logged.',
    category: 'transport',
    actor: 'Transport Desk',
    statusTag: 'Resolved'
  },
  {
    id: 'act-6',
    timestamp: '09:20 AM',
    title: 'Counselor Assigned',
    description: 'Student Alex Rivera (Grade 8) assigned to Ms. Adams for emotional wellness follow-up.',
    category: 'counseling',
    actor: 'Ms. Adams',
    statusTag: 'Active'
  },
  {
    id: 'act-7',
    timestamp: '08:45 AM',
    title: 'Morning Assembly Concluded',
    description: 'All 1,842 attending students dismissed to Period 1 classes after Vice Principal briefing.',
    category: 'general',
    actor: 'School Management',
    statusTag: 'Completed'
  },
  {
    id: 'act-8',
    timestamp: '08:00 AM',
    title: 'Campus Gates Opened',
    description: 'Gates A & B opened for morning student arrival under security supervision.',
    category: 'general',
    actor: 'Security Operations',
    statusTag: 'Normal'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-1',
    title: 'Mid-Term Examination Invigilation Roster',
    content: 'All faculty members must inspect their invigilation assignments for the upcoming Mid-Term examinations in the Staff Portal by 04:00 PM today.',
    date: '22 July 2026',
    targetAudience: 'All Staff',
    author: 'Vice Principal Office',
    isUrgent: true
  },
  {
    id: 'anc-2',
    title: 'Inter-School Sports Meet Logistics',
    content: 'Bus departure schedules for the Athletics Team traveling to City Sports Complex tomorrow morning are posted on the PE noticeboard.',
    date: '21 July 2026',
    targetAudience: 'Teachers',
    author: 'Sports Department'
  },
  {
    id: 'anc-3',
    title: 'Parent-Teacher Conference Registration',
    content: 'Online appointment portal for Term 1 Parent-Teacher Conferences will open to parents starting Thursday at 09:00 AM.',
    date: '20 July 2026',
    targetAudience: 'Parents',
    author: 'Academic Office'
  }
];

export const INITIAL_SYLLABUS_PROGRESS: SyllabusItem[] = [
  { grade: 'Grade 9', subject: 'Core Curriculum', completionPercentage: 78, status: 'On Track' },
  { grade: 'Grade 10', subject: 'Core Curriculum', completionPercentage: 82, status: 'Ahead' },
  { grade: 'Grade 11', subject: 'Core & Electives', completionPercentage: 71, status: 'Slightly Behind' },
  { grade: 'Grade 12', subject: 'AP / Senior Track', completionPercentage: 85, status: 'Ahead' }
];

export const INITIAL_EXAM_DATA: ExamOperationData = {
  upcomingExamsCount: 3,
  nextExamName: 'Grade 10 & 12 Term 1 Mid-Terms',
  nextExamDate: '25 July 2026 (3 Days Away)',
  invigilatorsAssigned: '28 / 28 Ready',
  examRoomsReady: '14 / 14 Verified',
  pendingSeatingPlans: 0,
  malpracticeReportsToday: 0,
  questionPaperStatus: 'Locked & Verified'
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent: Physics Substitute Needed',
    message: 'Dr. Harrison called in sick. Period 3 & 4 class is currently unassigned.',
    time: '10m ago',
    unread: true,
    type: 'urgent'
  },
  {
    id: 'notif-2',
    title: 'Bus #5 Route Update',
    message: 'Bus #5 driver reported 25m delay due to highway accident.',
    time: '35m ago',
    unread: true,
    type: 'warning'
  },
  {
    id: 'notif-3',
    title: 'Gate Entry Summary Ready',
    message: '28 late students logged by Gate A RFID scanner.',
    time: '1h ago',
    unread: false,
    type: 'info'
  },
  {
    id: 'notif-4',
    title: 'Morning Assembly Concluded',
    message: 'All blocks safely dispersed to Period 1 classrooms.',
    time: '2h ago',
    unread: false,
    type: 'success'
  }
];
