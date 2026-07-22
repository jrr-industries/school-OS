import {
  TeacherProfile,
  TimetablePeriod,
  ClassAttendanceSummary,
  HeatmapDay,
  StudentAtRisk,
  Assignment,
  LessonPlan,
  ExamDuty,
  StudentInsight,
  CommunicationMessage,
  RecentActivityItem,
} from "../types";

export const initialTeacherProfile: TeacherProfile = {
  name: "Mrs. Emily Carter",
  title: "Senior Mathematics Teacher",
  classTeacherOf: "Grade 10A",
  academicYear: "2026-27",
  department: "Department of Mathematics",
  schoolName: "St. Xavier International School • SchoolOS",
};

export const initialTimetable: TimetablePeriod[] = [
  {
    id: "p1",
    period: 1,
    subject: "Mathematics",
    className: "Grade 10A",
    room: "Room 302",
    time: "08:30 AM - 09:20 AM",
    status: "completed",
    topic: "Quadratic Equations: Quadratic Formula & Discriminants",
    totalStudents: 41,
    presentCount: 39,
  },
  {
    id: "p2",
    period: 2,
    subject: "Advanced Algebra",
    className: "Grade 11A",
    room: "Lab 201",
    time: "09:25 AM - 10:15 AM",
    status: "completed",
    topic: "Logarithmic Functions & Exponential Decay Models",
    totalStudents: 36,
    presentCount: 35,
  },
  {
    id: "p3",
    period: 3,
    subject: "Mathematics",
    className: "Grade 10B",
    room: "Room 304",
    time: "10:30 AM - 11:20 AM",
    status: "active", // GLOWING LIVE CLASS
    topic: "Polynomial Factoring & Synthetic Division",
    totalStudents: 40,
    presentCount: 40,
  },
  {
    id: "p4",
    period: 4,
    subject: "Mathematics",
    className: "Grade 9A",
    room: "Room 108",
    time: "11:25 AM - 12:15 PM",
    status: "upcoming",
    topic: "Linear Inequalities & Coordinate Geometry",
    totalStudents: 40,
  },
  {
    id: "p5",
    period: 5,
    subject: "Faculty Mentorship / Planning",
    className: "Staff Block B",
    room: "Faculty Hub",
    time: "01:00 PM - 01:50 PM",
    status: "break",
    topic: "Curriculum Alignment & Standardized Exam Prep",
    totalStudents: 0,
  },
  {
    id: "p6",
    period: 6,
    subject: "Applied Geometry",
    className: "Grade 10A",
    room: "Room 302",
    time: "01:55 PM - 02:45 PM",
    status: "upcoming",
    topic: "Circle Theorems, Chords & Tangents Applications",
    totalStudents: 41,
  },
];

export const initialClassAttendance: ClassAttendanceSummary[] = [
  {
    className: "Grade 10A",
    subject: "Mathematics (Class Teacher)",
    totalStudents: 41,
    present: 38,
    absent: 2,
    late: 1,
    percentage: 95,
    status: "completed",
  },
  {
    className: "Grade 10B",
    subject: "Mathematics",
    totalStudents: 40,
    present: 40,
    absent: 0,
    late: 0,
    percentage: 100,
    status: "completed",
  },
  {
    className: "Grade 9A",
    subject: "Mathematics",
    totalStudents: 40,
    present: 35,
    absent: 4,
    late: 1,
    percentage: 89,
    status: "completed",
  },
  {
    className: "Grade 11A",
    subject: "Advanced Algebra",
    totalStudents: 36,
    present: 34,
    absent: 1,
    late: 1,
    percentage: 94,
    status: "completed",
  },
  {
    className: "Grade 9B",
    subject: "Foundation Math",
    totalStudents: 38,
    present: 36,
    absent: 2,
    late: 0,
    percentage: 95,
    status: "pending",
  },
];

// Generate 120 days of teaching heatmap data for GitHub style grid
export const generateYearlyHeatmapData = (): HeatmapDay[] => {
  const days: HeatmapDay[] = [];
  const classes = ["Grade 10A", "Grade 10B", "Grade 9A", "Grade 11A"];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  let startDate = new Date(2026, 0, 5); // Jan 5, 2026

  for (let i = 0; i < 140; i++) {
    const cur = new Date(startDate);
    cur.setDate(startDate.getDate() + i);

    const dayOfWeekNum = cur.getDay();
    if (dayOfWeekNum === 0 || dayOfWeekNum === 6) continue; // Skip weekends

    const dayOfWeek = dayLabels[(dayOfWeekNum - 1) % 5];
    const dateStr = cur.toISOString().split("T")[0];
    const randomClass = classes[i % classes.length];

    // Seed realistic attendance pattern
    let pct = 96;
    if (i % 17 === 0) pct = 78; // Red below 80%
    else if (i % 11 === 0) pct = 88; // Orange 80-89%
    else if (i % 7 === 0) pct = 92; // Yellow 90-94%
    else if (i % 3 === 0) pct = 98; // Light Green 95-99%
    else pct = 100; // Green 100%

    let level: 0 | 1 | 2 | 3 | 4 = 4;
    if (pct < 80) level = 0;
    else if (pct < 90) level = 1;
    else if (pct < 95) level = 2;
    else if (pct < 100) level = 3;
    else level = 4;

    const total = 40;
    const present = Math.round((pct / 100) * total);
    const absent = Math.max(0, total - present - (i % 2));
    const late = total - present - absent;

    days.push({
      date: dateStr,
      dayOfWeek,
      className: randomClass,
      present,
      absent,
      late: Math.max(0, late),
      percentage: pct,
      level,
    });
  }

  return days;
};

export const atRiskStudentsList: StudentAtRisk[] = [
  {
    id: "s1",
    name: "Alex Rivera",
    rollNumber: "10A-14",
    className: "Grade 10A",
    attendancePct: 71,
    daysAbsent: 14,
    lastPresent: "2026-07-18",
    riskReason: "Unexcused morning tardiness & frequent Friday absences",
    parentContact: "+1 (555) 382-9102 • m.rivera@email.com",
    status: "Critical",
  },
  {
    id: "s2",
    name: "Sarah Jenkins",
    rollNumber: "10A-22",
    className: "Grade 10A",
    attendancePct: 68,
    daysAbsent: 16,
    lastPresent: "2026-07-16",
    riskReason: "Medical leave pending doctor note validation",
    parentContact: "+1 (555) 492-1049 • d.jenkins@email.com",
    status: "Critical",
  },
  {
    id: "s3",
    name: "Marcus Vance",
    rollNumber: "9A-09",
    className: "Grade 9A",
    attendancePct: 73,
    daysAbsent: 12,
    lastPresent: "2026-07-20",
    riskReason: "Bus route delay conflicts during 1st period",
    parentContact: "+1 (555) 831-2940 • h.vance@email.com",
    status: "Warning",
  },
  {
    id: "s4",
    name: "Chloe Zhao",
    rollNumber: "11A-31",
    className: "Grade 11A",
    attendancePct: 74,
    daysAbsent: 11,
    lastPresent: "2026-07-21",
    riskReason: "Consecutive Monday morning absenteeism",
    parentContact: "+1 (555) 201-9481 • k.zhao@email.com",
    status: "Improving",
  },
];

export const assignmentsList: Assignment[] = [
  {
    id: "a1",
    title: "Problem Set 4: Quadratic Formula Applications",
    className: "Grade 10A",
    subject: "Mathematics",
    dueDate: "2026-07-24",
    assignedDate: "2026-07-18",
    submittedCount: 38,
    totalStudents: 41,
    reviewedCount: 22,
    avgScore: 84.5,
    status: "Pending Review",
  },
  {
    id: "a2",
    title: "Lab Report 2: Synthetic Division & Roots",
    className: "Grade 10B",
    subject: "Mathematics",
    dueDate: "2026-07-22",
    assignedDate: "2026-07-15",
    submittedCount: 40,
    totalStudents: 40,
    reviewedCount: 40,
    avgScore: 91.2,
    status: "Graded",
  },
  {
    id: "a3",
    title: "Weekly Quiz 5: Logarithmic Transformation",
    className: "Grade 11A",
    subject: "Advanced Algebra",
    dueDate: "2026-07-26",
    assignedDate: "2026-07-20",
    submittedCount: 28,
    totalStudents: 36,
    reviewedCount: 10,
    avgScore: 88.0,
    status: "Active",
  },
  {
    id: "a4",
    title: "Coordinate Geometry Fundamentals Worksheet",
    className: "Grade 9A",
    subject: "Mathematics",
    dueDate: "2026-07-23",
    assignedDate: "2026-07-19",
    submittedCount: 35,
    totalStudents: 40,
    reviewedCount: 15,
    avgScore: 79.8,
    status: "Pending Review",
  },
];

export const lessonPlansList: LessonPlan[] = [
  {
    id: "lp1",
    title: "Quadratic Real-World Modeling & Motion Vectors",
    className: "Grade 10A",
    subject: "Mathematics",
    date: "2026-07-22 (Today)",
    status: "Today",
    objectives: [
      "Derive quadratic equations from projectile motion data.",
      "Identify vertex, axis of symmetry, and roots in contextual problems.",
      "Use graphing technology to solve optimization problems.",
    ],
    duration: "50 mins",
    hasResources: true,
  },
  {
    id: "lp2",
    title: "Circle Geometry: Inscribed Angle Theorem & Proofs",
    className: "Grade 10A",
    subject: "Applied Geometry",
    date: "2026-07-23 (Tomorrow)",
    status: "Upcoming",
    objectives: [
      "Prove that the measure of an inscribed angle is half its intercepted arc.",
      "Construct cyclic quadrilaterals using dynamic geometry tools.",
    ],
    duration: "50 mins",
    hasResources: true,
  },
  {
    id: "lp3",
    title: "Polynomial Long Division vs. Synthetic Shortcuts",
    className: "Grade 10B",
    subject: "Mathematics",
    date: "2026-07-21 (Yesterday)",
    status: "Completed",
    objectives: [
      "Master synthetic division algorithm for linear divisors.",
      "Apply the Remainder and Factor theorems to identify polynomial roots.",
    ],
    duration: "50 mins",
    hasResources: true,
  },
  {
    id: "lp4",
    title: "Exponential Decay & Radioactive Half-Life Calculus",
    className: "Grade 11A",
    subject: "Advanced Algebra",
    date: "2026-07-25",
    status: "Pending Review",
    objectives: [
      "Formulate exponential decay formulas for biological and financial models.",
      "Solve for time using natural logarithms.",
    ],
    duration: "50 mins",
    hasResources: false,
  },
];

export const examDutiesList: ExamDuty[] = [
  {
    id: "ex1",
    title: "Mid-Term Mathematics Paper 1",
    subject: "Mathematics",
    className: "Grade 10A & 10B",
    date: "2026-08-04",
    time: "09:00 AM - 11:30 AM",
    room: "Main Auditorium Hall A",
    role: "Chief Examiner",
    marksStatus: "Pending",
    questionPaperStatus: "Ready",
  },
  {
    id: "ex2",
    title: "Grade 11 STEM Diagnostic Evaluation",
    subject: "Advanced Mathematics",
    className: "Grade 11A",
    date: "2026-08-08",
    time: "01:00 PM - 03:00 PM",
    room: "Exam Center 102",
    role: "Invigilator",
    marksStatus: "Pending",
    questionPaperStatus: "Draft",
  },
];

export const studentInsightsList: StudentInsight[] = [
  {
    id: "i1",
    name: "David Chen",
    className: "Grade 10A",
    type: "Top Performer",
    note: "Scored 100% on 4 consecutive math assessments. Recommended for National Olympiad.",
    gpa: 4.0,
    attendancePct: 99,
    avatar: "DC",
  },
  {
    id: "i2",
    name: "Alex Rivera",
    className: "Grade 10A",
    type: "Needs Improvement",
    note: "Struggles with factoring polynomials. Requires 1-on-1 tutoring during Period 5 break.",
    gpa: 2.3,
    attendancePct: 71,
    avatar: "AR",
  },
  {
    id: "i3",
    name: "Sarah Jenkins",
    className: "Grade 10A",
    type: "Frequent Absentee",
    note: "16 days absent this term. AI Attendance risk alert issued to parent portal.",
    gpa: 2.5,
    attendancePct: 68,
    avatar: "SJ",
  },
  {
    id: "i4",
    name: "Ethan Wright",
    className: "Grade 10B",
    type: "Discipline Alert",
    note: "Repeated phone usage during independent problem-solving time.",
    gpa: 3.1,
    attendancePct: 93,
    avatar: "EW",
  },
  {
    id: "i5",
    name: "Maya Lin",
    className: "Grade 9A",
    type: "Special Needs",
    note: "IEP Accommodation: 50% extra time on written examinations and large font worksheets.",
    gpa: 3.6,
    attendancePct: 97,
    avatar: "ML",
  },
];

export const communicationMessagesList: CommunicationMessage[] = [
  {
    id: "m1",
    senderName: "Dr. Arthur Vance (Principal)",
    senderRole: "Principal",
    avatar: "AV",
    subject: "Faculty Curriculum Review & Board Inspection",
    preview: "Dear Mrs. Carter, please ensure all Grade 10 lesson plans and attendance logs are updated prior to Friday's inspection...",
    timestamp: "10:15 AM",
    unread: true,
    category: "Principal Notices",
  },
  {
    id: "m2",
    senderName: "Mrs. Maria Rivera (Parent)",
    senderRole: "Parent",
    avatar: "MR",
    subject: "Alex Rivera Absence Reason & Homework Catchup",
    preview: "Good morning Mrs. Carter, Alex had a fever yesterday. I have attached the medical note and would like to ask about...",
    timestamp: "09:40 AM",
    unread: true,
    category: "Parent Messages",
  },
  {
    id: "m3",
    senderName: "Mr. Robert Sterling (Physics Head)",
    senderRole: "Teacher",
    avatar: "RS",
    subject: "Joint Math-Physics STEM Project Proposal",
    preview: "Hi Emily, can we align our vectors and quadratic projectile lessons with Physics Lab 3 next week?",
    timestamp: "Yesterday",
    unread: false,
    category: "Teacher Messages",
  },
  {
    id: "m4",
    senderName: "Samantha Miller (Grade 10A)",
    senderRole: "Student",
    avatar: "SM",
    subject: "Question regarding Problem Set 4 #7",
    preview: "Hello Mrs. Carter, I am stuck on the optimization question in Problem Set 4. Is the discriminant supposed to be negative?",
    timestamp: "Yesterday",
    unread: true,
    category: "Student Queries",
  },
];

export const recentActivitiesList: RecentActivityItem[] = [
  {
    id: "rc1",
    type: "attendance",
    title: "Period 1 Attendance Submitted",
    description: "39 Present, 2 Absent, 1 Late recorded for Grade 10A Mathematics.",
    timeAgo: "2 hours ago",
    iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "rc2",
    type: "assignment",
    title: "Problem Set 4 Created",
    description: "Assigned Quadratic Formula Applications to Grade 10A (41 students).",
    timeAgo: "3 hours ago",
    iconBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "rc3",
    type: "homework",
    title: "Grade 10B Homework Reviewed",
    description: "Graded 40 submissions for Synthetic Division Lab Report (Avg 91.2%).",
    timeAgo: "5 hours ago",
    iconBg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "rc4",
    type: "marks",
    title: "Quiz 3 Marks Published",
    description: "Published grades for Grade 11A Advanced Algebra Quiz to Student Portal.",
    timeAgo: "1 day ago",
    iconBg: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "rc5",
    type: "message",
    title: "Parent Message Received",
    description: "New inquiry from Mrs. Rivera regarding Alex Rivera's attendance.",
    timeAgo: "1 day ago",
    iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
];

// Attendance Chart Datasets for Recharts
export const dailyAttendanceTrendData = [
  { day: "Mon", attendance: 97, target: 95, late: 4 },
  { day: "Tue", attendance: 98, target: 95, late: 2 },
  { day: "Wed", attendance: 96, target: 95, late: 8 },
  { day: "Thu", attendance: 94, target: 95, late: 6 },
  { day: "Fri", attendance: 92, target: 95, late: 12 },
  { day: "Today", attendance: 96, target: 95, late: 8 },
];

export const classWiseAttendanceData = [
  { className: "10A", present: 38, absent: 2, late: 1, pct: 95 },
  { className: "10B", present: 40, absent: 0, late: 0, pct: 100 },
  { className: "9A", present: 35, absent: 4, late: 1, pct: 89 },
  { className: "11A", present: 34, absent: 1, late: 1, pct: 94 },
  { className: "9B", present: 36, absent: 2, late: 0, pct: 95 },
];

export const presentVsAbsentPieData = [
  { name: "Present", value: 183, color: "#10b981" },
  { name: "Late", value: 8, color: "#f59e0b" },
  { name: "Absent (Excused)", value: 9, color: "#3b82f6" },
  { name: "Absent (Unexcused)", value: 5, color: "#ef4444" },
];

export const monthlyAttendanceTrendData = [
  { month: "Jan", avgPct: 96.2, forecast: 96.5 },
  { month: "Feb", avgPct: 95.8, forecast: 96.0 },
  { month: "Mar", avgPct: 94.5, forecast: 95.2 },
  { month: "Apr", avgPct: 96.0, forecast: 96.3 },
  { month: "May", avgPct: 97.1, forecast: 97.0 },
  { month: "Jun", avgPct: 95.4, forecast: 96.0 },
  { month: "Jul", avgPct: 96.0, forecast: 96.5 },
];

export const classPerformanceData = [
  { topic: "Algebra", avg: 86, highest: 100, lowest: 58, passPct: 94 },
  { topic: "Geometry", avg: 82, highest: 98, lowest: 52, passPct: 90 },
  { topic: "Trigonometry", avg: 79, highest: 96, lowest: 48, passPct: 86 },
  { topic: "Calculus", avg: 88, highest: 100, lowest: 64, passPct: 96 },
  { topic: "Statistics", avg: 91, highest: 100, lowest: 70, passPct: 100 },
];
