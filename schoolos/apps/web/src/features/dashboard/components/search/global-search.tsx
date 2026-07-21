'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, Users, GraduationCap, HeartHandshake, BookOpen, IndianRupee, BarChart3, MessageSquare, FileText, type LucideIcon } from 'lucide-react';
import { cn } from '@schoolos/ui';

interface SearchItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  url: string;
  keywords?: string[];
}

const searchItems: SearchItem[] = [
  { id: 'students', label: 'Students', description: 'View all students', icon: GraduationCap, url: '/students', keywords: ['pupils', 'learners'] },
  { id: 'add-student', label: 'Add New Student', description: 'Register a new student', icon: Users, url: '/students/new', keywords: ['create', 'register', 'enroll'] },
  { id: 'teachers', label: 'Teachers', description: 'View all teachers', icon: Users, url: '/teachers', keywords: ['staff', 'faculty'] },
  { id: 'parents', label: 'Parents', description: 'View all parents', icon: HeartHandshake, url: '/parents', keywords: ['guardians'] },
  { id: 'classes', label: 'Classes', description: 'Manage classes', icon: BookOpen, url: '/classes', keywords: ['grades', 'rooms'] },
  { id: 'attendance', label: 'Attendance', description: 'Take and view attendance', icon: BookOpen, url: '/attendance', keywords: ['present', 'absent'] },
  { id: 'fees', label: 'Fees', description: 'Manage fee collection', icon: IndianRupee, url: '/fees', keywords: ['payments', 'tuition', 'finance'] },
  { id: 'reports', label: 'Reports', description: 'Generate reports', icon: BarChart3, url: '/reports', keywords: ['analytics', 'statistics'] },
  { id: 'announcements', label: 'Announcements', description: 'Send announcements', icon: MessageSquare, url: '/communication', keywords: ['notifications', 'broadcast'] },
  { id: 'timetable', label: 'Timetable', description: 'View class schedule', icon: FileText, url: '/timetable', keywords: ['schedule', 'periods'] },
  { id: 'examinations', label: 'Examinations', description: 'Manage exams', icon: FileText, url: '/examinations', keywords: ['tests', 'assessments'] },
  { id: 'results', label: 'Results', description: 'View exam results', icon: BarChart3, url: '/results', keywords: ['grades', 'scores', 'marks'] },
  { id: 'homework', label: 'Homework', description: 'Manage homework', icon: FileText, url: '/homework', keywords: ['assignments'] },
  { id: 'library', label: 'Library', description: 'Library management', icon: BookOpen, url: '/library', keywords: ['books', 'resources'] },
  { id: 'transport', label: 'Transport', description: 'Manage transport', icon: Users, url: '/transport', keywords: ['bus', 'vehicles', 'routes'] },
  { id: 'calendar', label: 'Calendar', description: 'View school calendar', icon: BookOpen, url: '/calendar', keywords: ['events', 'schedule'] },
  { id: 'settings', label: 'Settings', description: 'School settings', icon: Users, url: '/settings', keywords: ['configuration', 'preferences'] },
  { id: 'support', label: 'Support', description: 'Get help', icon: Users, url: '/support', keywords: ['help', 'contact'] },
];

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);

  useEffect(() => {
    if (!search.trim()) {
      setResults(searchItems.slice(0, 8));
      return;
    }
    const query = search.toLowerCase();
    const filtered = searchItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.keywords?.some((k) => k.includes(query)),
    );
    setResults(filtered);
  }, [search]);

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      router.push(item.url);
      onOpenChange(false);
    },
    [router, onOpenChange],
  );

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        open ? 'visible' : 'invisible',
      )}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'fixed left-1/2 top-[10%] z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border bg-popover text-popover-foreground shadow-lg',
          open ? 'animate-in fade-in zoom-in-95' : 'animate-out fade-out zoom-out-95',
        )}
      >
        <Command className="rounded-lg" shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search students, teachers, classes..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-1">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            <Command.Group heading={search ? 'Search Results' : 'Quick Links'}>
              {results.map((item) => (
                <Command.Item
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <item.icon className="mr-3 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="border-t p-2">
            <p className="text-center text-[10px] text-muted-foreground">
              Type to search &middot; Enter to navigate &middot; Esc to close
            </p>
          </div>
        </Command>
      </div>
    </div>
  );
}
