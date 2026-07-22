import {
  LayoutDashboard, Users, GraduationCap, HeartHandshake,
  Briefcase, UserPlus, BookOpen, ClipboardCheck, CalendarClock, FileEdit,
  ClipboardList, FileSpreadsheet, Trophy, IndianRupee, Calculator,
  Bus, Library, Building2, Package, MessageSquare, Calendar,
  BarChart3, LineChart, Settings, LogOut,
  UserCheck, UserCog, Notebook, Route,
  School, ChevronDown, Monitor, HeadphonesIcon,
  Shirt, BusFront, BedDouble, ClipboardPen,
  UserRoundCog, Megaphone
} from 'lucide-react';

export const NAV_ICONS = {
  LayoutDashboard, Users, GraduationCap, HeartHandshake,
  Briefcase, UserPlus, BookOpen, ClipboardCheck, CalendarClock, FileEdit,
  ClipboardList, FileSpreadsheet, Trophy, IndianRupee, Calculator,
  Bus, Library, Building2, Package, MessageSquare, Calendar,
  BarChart3, LineChart, Settings, LogOut,
  UserCheck, UserCog, Notebook, Route,
  School, ChevronDown, Monitor, HeadphonesIcon,
  Shirt, BusFront, BedDouble, ClipboardPen,
  UserRoundCog, Megaphone
} as const;

export type NavIconName = keyof typeof NAV_ICONS;

export interface NavItem {
  name: string;
  href?: string;
  icon: NavIconName;
  permission?: string;
  badge?: string;
  children?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  { name: 'Dashboard', href: '/school-admin/dashboard', icon: 'LayoutDashboard' },
  {
    name: 'Admissions',
    href: '/school-admin/admissions',
    icon: 'ClipboardCheck',
  },
  {
    name: 'Students',
    icon: 'GraduationCap',
    children: [
      { name: 'All Students', href: '/school-admin/students', icon: 'Users' },
      { name: 'Add New', href: '/school-admin/students/new', icon: 'UserPlus' },
      { name: 'Promotions', href: '/school-admin/students/promotions', icon: 'UserCheck' },
      { name: 'Transfers', href: '/school-admin/students/transfers', icon: 'Route' },
    ],
  },
  {
    name: 'Parents',
    icon: 'HeartHandshake',
    children: [
      { name: 'All Parents', href: '/school-admin/parents', icon: 'Users' },
      { name: 'Guardians', href: '/school-admin/parents/guardians', icon: 'UserCog' },
    ],
  },
  {
    name: 'Staff Management',
    icon: 'Briefcase',
    children: [
      { name: 'All Staff', href: '/school-admin/staff', icon: 'Users' },
      { name: 'Add Staff', href: '/school-admin/staff/create', icon: 'UserPlus' },
      { name: 'Teachers', href: '/school-admin/teachers', icon: 'Monitor' },
      { name: 'Principals', href: '/school-admin/principals', icon: 'UserRoundCog' },
      { name: 'HR', href: '/school-admin/hr', icon: 'Users' },
      { name: 'Accountants', href: '/school-admin/accountants', icon: 'Calculator' },
      { name: 'Librarians', href: '/school-admin/librarians', icon: 'Library' },
      { name: 'Transport', href: '/school-admin/transport-staff', icon: 'Bus' },
      { name: 'Hostel', href: '/school-admin/hostel-staff', icon: 'BedDouble' },
    ],
  },
  {
    name: 'Academic',
    icon: 'BookOpen',
    children: [
      { name: 'Academic Years', href: '/school-admin/academics/years', icon: 'Calendar' },
      { name: 'Classes', href: '/school-admin/classes', icon: 'BookOpen' },
      { name: 'Sections', href: '/school-admin/sections', icon: 'Notebook' },
      { name: 'Subjects', href: '/school-admin/subjects', icon: 'FileEdit' },
      { name: 'Class Teachers', href: '/school-admin/academics/class-teachers', icon: 'UserCog' },
    ],
  },
  { name: 'Attendance', href: '/school-admin/attendance', icon: 'ClipboardCheck' },
  { name: 'Timetable', href: '/school-admin/timetable', icon: 'CalendarClock' },
  { name: 'Homework', href: '/school-admin/homework', icon: 'FileEdit' },
  { name: 'Assignments', href: '/school-admin/assignments', icon: 'ClipboardList' },
  {
    name: 'Examinations',
    icon: 'FileSpreadsheet',
    children: [
      { name: 'Exams', href: '/school-admin/examinations', icon: 'FileSpreadsheet' },
      { name: 'Results', href: '/school-admin/results', icon: 'Trophy' },
    ],
  },
  { name: 'Fees', href: '/school-admin/fees', icon: 'IndianRupee' },
  { name: 'Accounting', href: '/school-admin/accounting', icon: 'Calculator' },
  { name: 'Library', href: '/school-admin/library', icon: 'Library' },
  { name: 'Transport', href: '/school-admin/transport', icon: 'Bus' },
  { name: 'Hostel', href: '/school-admin/hostel', icon: 'Building2' },
  { name: 'Inventory', href: '/school-admin/inventory', icon: 'Package' },
  {
    name: 'Communication',
    icon: 'MessageSquare',
    children: [
      { name: 'Announcements', href: '/school-admin/communication', icon: 'Megaphone' },
      { name: 'Chat', href: '/school-admin/communication/chat', icon: 'MessageSquare' },
    ],
  },
  { name: 'Reports', href: '/school-admin/reports', icon: 'BarChart3' },
  { name: 'Analytics', href: '/school-admin/analytics', icon: 'LineChart' },
  { name: 'School Settings', href: '/school-admin/settings', icon: 'Settings' },
];

export const bottomNavConfig: NavItem[] = [
  { name: 'School Settings', href: '/school-admin/settings', icon: 'Settings' },
  { name: 'Profile', href: '/school-admin/profile', icon: 'Users' },
  { name: 'Logout', href: '/login', icon: 'LogOut' },
];
