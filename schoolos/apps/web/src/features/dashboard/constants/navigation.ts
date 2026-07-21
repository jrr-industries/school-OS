import {
  LayoutDashboard, Users, GraduationCap, HeartHandshake,
  Briefcase, BookOpen, ClipboardCheck, CalendarClock, FileEdit,
  ClipboardList, FileSpreadsheet, Trophy, IndianRupee, Calculator,
  Bus, Library, Building2, Package, MessageSquare, Calendar,
  PartyPopper, BarChart3, LineChart, Settings, HeadphonesIcon, LogOut,
  ChevronDown, UserPlus, Notebook, FileCheck, Route,
  UserCheck, UserCog, UserCircle, Monitor
} from 'lucide-react';

export const NAV_ICONS = {
  LayoutDashboard, Users, GraduationCap, HeartHandshake,
  Briefcase, BookOpen, ClipboardCheck, CalendarClock, FileEdit,
  ClipboardList, FileSpreadsheet, Trophy, IndianRupee, Calculator,
  Bus, Library, Building2, Package, MessageSquare, Calendar,
  PartyPopper, BarChart3, LineChart, Settings, HeadphonesIcon, LogOut,
  ChevronDown, UserPlus, Notebook, FileCheck, Route,
  UserCheck, UserCog, UserCircle, Monitor
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
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  {
    name: 'Students',
    icon: 'GraduationCap',
    children: [
      { name: 'All Students', href: '/students', icon: 'Users' },
      { name: 'Add New', href: '/students/new', icon: 'UserPlus', permission: 'students:create' },
      { name: 'Promotions', href: '/students/promotions', icon: 'UserCheck', permission: 'students:promote' },
      { name: 'Transfers', href: '/students/transfers', icon: 'Route', permission: 'students:transfer' },
      { name: 'Graduated', href: '/students/graduated', icon: 'Trophy' },
    ],
  },
  { name: 'Admissions', href: '/admissions', icon: 'ClipboardCheck', permission: 'students:create' },
  {
    name: 'Parents',
    icon: 'HeartHandshake',
    children: [
      { name: 'All Parents', href: '/parents', icon: 'Users', permission: 'parents:read' },
      { name: 'Guardians', href: '/parents/guardians', icon: 'UserCircle', permission: 'parents:read' },
      { name: 'Communications', href: '/parents/communications', icon: 'MessageSquare', permission: 'communication:send' },
    ],
  },
  { name: 'Teachers', href: '/teachers', icon: 'Monitor', permission: 'users:read' },
  { name: 'Employees', href: '/employees', icon: 'Briefcase', permission: 'users:read' },
  {
    name: 'Academics',
    icon: 'BookOpen',
    permission: 'academic_years:read',
    children: [
      { name: 'Academic Years', href: '/academics/years', icon: 'Calendar', permission: 'academic_years:read' },
      { name: 'Classes', href: '/classes', icon: 'BookOpen', permission: 'classes:read' },
      { name: 'Sections', href: '/academics/sections', icon: 'Notebook', permission: 'sections:read' },
      { name: 'Subjects', href: '/subjects', icon: 'FileEdit', permission: 'subjects:read' },
      { name: 'Class Teachers', href: '/academics/class-teachers', icon: 'UserCog', permission: 'classes:read' },
    ],
  },
  { name: 'Attendance', href: '/attendance', icon: 'ClipboardCheck', permission: 'attendance:read' },
  { name: 'Timetable', href: '/timetable', icon: 'CalendarClock', permission: 'schedule:read' },
  { name: 'Homework', href: '/homework', icon: 'FileEdit', permission: 'grades:read' },
  { name: 'Assignments', href: '/assignments', icon: 'ClipboardList', permission: 'grades:read' },
  { name: 'Examinations', href: '/examinations', icon: 'FileSpreadsheet', permission: 'grades:read' },
  { name: 'Results', href: '/results', icon: 'Trophy', permission: 'grades:read' },
  { name: 'Fees', href: '/fees', icon: 'IndianRupee', permission: 'fees:read' },
  { name: 'Accounting', href: '/accounting', icon: 'Calculator', permission: 'fees:read' },
  { name: 'Transport', href: '/transport', icon: 'Bus', permission: 'fees:read' },
  { name: 'Library', href: '/library', icon: 'Library', permission: 'fees:read' },
  { name: 'Hostel', href: '/hostel', icon: 'Building2', permission: 'fees:read' },
  { name: 'Inventory', href: '/inventory', icon: 'Package' },
  { name: 'Communication Hub', href: '/communication', icon: 'MessageSquare', permission: 'communication:read' },
  { name: 'Calendar', href: '/calendar', icon: 'Calendar' },
  { name: 'Events', href: '/events', icon: 'PartyPopper' },
  { name: 'Reports', href: '/reports', icon: 'BarChart3', permission: 'reports:read' },
  { name: 'Analytics', href: '/analytics', icon: 'LineChart', permission: 'reports:read' },
  { name: 'Settings', href: '/settings', icon: 'Settings', permission: 'settings:read' },
  { name: 'Support', href: '/support', icon: 'HeadphonesIcon' },
];

export const bottomNavConfig: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: 'Settings', permission: 'settings:read' },
  { name: 'Support', href: '/support', icon: 'HeadphonesIcon' },
];
