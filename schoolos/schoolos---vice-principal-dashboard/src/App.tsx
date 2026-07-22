import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { TodaySchoolOperations } from './components/TodaySchoolOperations';
import { UrgentActionCenter } from './components/UrgentActionCenter';
import { LiveSchoolOperations } from './components/LiveSchoolOperations';
import { TeacherOperations } from './components/TeacherOperations';
import { StudentOperations } from './components/StudentOperations';
import { AcademicOperations } from './components/AcademicOperations';
import { ExaminationOperations } from './components/ExaminationOperations';
import { CampusMonitoring } from './components/CampusMonitoring';
import { CommunicationCenter } from './components/CommunicationCenter';
import { ActivityTimeline } from './components/ActivityTimeline';
import { Footer } from './components/Footer';

// Modals
import { MorningBriefingModal } from './components/modals/MorningBriefingModal';
import { AssignSubstituteModal } from './components/modals/AssignSubstituteModal';
import { AnnouncementModal } from './components/modals/AnnouncementModal';
import { EmergencyAlertModal } from './components/modals/EmergencyAlertModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { IncidentDetailModal } from './components/modals/IncidentDetailModal';

// Initial Mock Data
import {
  INITIAL_STATS,
  INITIAL_URGENT_ACTIONS,
  INITIAL_TEACHERS,
  INITIAL_STUDENT_ALERTS,
  INITIAL_FACILITIES,
  INITIAL_TIMELINE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SYLLABUS_PROGRESS,
  INITIAL_EXAM_DATA,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

import { UrgentActionItem, TeacherRecord, NotificationItem, Announcement } from './types';

export default function App() {
  // Navigation State
  const [activeSection, setActiveSection] = useState('operations');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Data States
  const [stats, setStats] = useState(INITIAL_STATS);
  const [urgentItems, setUrgentItems] = useState<UrgentActionItem[]>(INITIAL_URGENT_ACTIONS);
  const [teachers, setTeachers] = useState<TeacherRecord[]>(INITIAL_TEACHERS);
  const [studentAlerts, setStudentAlerts] = useState(INITIAL_STUDENT_ALERTS);
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modal States
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isSubstituteOpen, setIsSubstituteOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<UrgentActionItem | null>(null);
  const [targetSubstituteTeacher, setTargetSubstituteTeacher] = useState<TeacherRecord | undefined>();

  // Global Ctrl/Cmd + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleResolveUrgent = (id: string) => {
    setUrgentItems(prev => prev.map(item => item.id === id ? { ...item, status: 'resolved' } : item));
  };

  const handleAssignSubstitute = (teacherId: string, substituteName: string) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, status: 'Substitute Assigned', substituteName } : t));
    
    // Auto-resolve corresponding urgent item
    setUrgentItems(prev => prev.map(u => u.category === 'absence' ? { ...u, status: 'resolved' } : u));

    // Log in timeline
    const newAct = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      title: 'Substitute Assigned',
      description: `${substituteName} assigned to cover class.`,
      category: 'leave' as const,
      actor: 'David Miller (VP)',
      statusTag: 'Resolved'
    };
    setTimeline(prev => [newAct, ...prev]);
  };

  const handleAddAnnouncement = (
    title: string,
    content: string,
    targetAudience: 'All Staff' | 'Teachers' | 'Parents' | 'Students' | 'Emergency'
  ) => {
    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      title,
      content,
      date: '22 July 2026',
      targetAudience,
      author: 'Vice Principal Office',
      isUrgent: targetAudience === 'Emergency'
    };
    setAnnouncements(prev => [newAnc, ...prev]);
  };

  const handleSendEmergencyAlert = (title: string, details: string) => {
    const emergencyAnc: Announcement = {
      id: `anc-emg-${Date.now()}`,
      title: `🚨 EMERGENCY: ${title}`,
      content: details,
      date: '22 July 2026',
      targetAudience: 'Emergency',
      author: 'Vice Principal Office (Priority 1)',
      isUrgent: true
    };
    setAnnouncements(prev => [emergencyAnc, ...prev]);

    // Add unread priority notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Emergency Broadcast: ${title}`,
      message: details,
      time: 'Just now',
      unread: true,
      type: 'urgent'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddTimelineActivity = (title: string, description: string, category: any) => {
    const newAct = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      title,
      description,
      category,
      actor: 'David Miller (VP)',
      statusTag: 'Logged'
    };
    setTimeline(prev => [newAct, ...prev]);
  };

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B0F17] text-slate-100 font-sans' : 'bg-slate-100 text-slate-900 font-sans'} transition-colors duration-200 antialiased selection:bg-emerald-500 selection:text-slate-950`}>
      
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        notifications={notifications}
        onClearNotification={handleClearNotification}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
      />

      {/* Main Layout Shell */}
      <div className="flex">
        
        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          urgentCount={urgentItems.filter(i => i.status === 'pending').length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center Dashboard Workspace */}
        <main className="flex-1 p-4 lg:p-6 space-y-8 max-w-[1600px] mx-auto overflow-x-hidden">
          
          {/* Welcome Banner */}
          <WelcomeBanner
            onOpenBriefing={() => setIsBriefingOpen(true)}
            onOpenAnnouncement={() => setIsAnnouncementOpen(true)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onOpenAssignSubstitute={() => {
              setTargetSubstituteTeacher(undefined);
              setIsSubstituteOpen(true);
            }}
          />

          {/* Section 1: Today's School Operations */}
          <TodaySchoolOperations stats={stats} />

          {/* Section 2: Urgent Action Center */}
          <UrgentActionCenter
            urgentItems={urgentItems}
            onResolveUrgent={handleResolveUrgent}
            onOpenSubstituteModal={(teacher) => {
              setTargetSubstituteTeacher(teacher);
              setIsSubstituteOpen(true);
            }}
            onOpenAnnouncementModal={() => setIsAnnouncementOpen(true)}
            onOpenIncidentModal={(item) => setSelectedIncident(item)}
          />

          {/* Section 3: Live School Operations */}
          <LiveSchoolOperations />

          {/* Section 4: Teacher Operations */}
          <TeacherOperations
            teachers={teachers}
            onOpenSubstituteModal={(teacher) => {
              setTargetSubstituteTeacher(teacher);
              setIsSubstituteOpen(true);
            }}
          />

          {/* Section 5: Student Operations */}
          <StudentOperations
            studentAlerts={studentAlerts}
            onOpenIncidentModal={(item) => setSelectedIncident(item)}
          />

          {/* Section 6: Academic Operations */}
          <AcademicOperations syllabusData={INITIAL_SYLLABUS_PROGRESS} />

          {/* Section 7: Examination Operations */}
          <ExaminationOperations examData={INITIAL_EXAM_DATA} />

          {/* Section 8: Campus Operations & Monitoring */}
          <CampusMonitoring facilities={facilities} />

          {/* Section 9: Communication Center */}
          <CommunicationCenter
            announcements={announcements}
            onOpenAnnouncementModal={() => setIsAnnouncementOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
          />

          {/* Section 10: Activity Timeline */}
          <ActivityTimeline
            activities={timeline}
            onAddActivity={handleAddTimelineActivity}
          />

        </main>

      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <MorningBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />

      <AssignSubstituteModal
        isOpen={isSubstituteOpen}
        onClose={() => setIsSubstituteOpen(false)}
        teachers={teachers}
        onAssignSubstitute={handleAssignSubstitute}
        targetTeacher={targetSubstituteTeacher}
      />

      <AnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        onAddAnnouncement={handleAddAnnouncement}
      />

      <EmergencyAlertModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSendEmergencyAlert={handleSendEmergencyAlert}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        urgentItems={urgentItems}
        teachers={teachers}
        studentAlerts={studentAlerts}
        onSelectUrgent={(item) => {
          setSelectedIncident(item);
        }}
      />

      <IncidentDetailModal
        isOpen={selectedIncident !== null}
        onClose={() => setSelectedIncident(null)}
        item={selectedIncident}
        onResolve={handleResolveUrgent}
      />

    </div>
  );
}
