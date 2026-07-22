import React, { useState, useMemo } from "react";
import { NavSection, TimetablePeriod, ClassAttendanceSummary } from "./types";
import {
  initialTeacherProfile,
  initialTimetable,
  initialClassAttendance,
  generateYearlyHeatmapData,
  atRiskStudentsList,
  assignmentsList,
  lessonPlansList,
} from "./data/mockData";

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { WelcomeBanner } from "./components/WelcomeBanner";
import { TodaySummary } from "./components/TodaySummary";
import { LiveTimetable } from "./components/LiveTimetable";
import { AttendanceCenter } from "./components/AttendanceCenter";
import { AssignmentsModule } from "./components/AssignmentsModule";
import { LessonPlansModule } from "./components/LessonPlansModule";
import { ClassPerformanceModule } from "./components/ClassPerformanceModule";
import { ExamManagementModule } from "./components/ExamManagementModule";
import { StudentInsightsModule } from "./components/StudentInsightsModule";
import { ClassroomToolsModule } from "./components/ClassroomToolsModule";
import { CommunicationModule } from "./components/CommunicationModule";
import { AIAssistantModule } from "./components/AIAssistantModule";
import { ReportsModule } from "./components/ReportsModule";
import { CalendarModule } from "./components/CalendarModule";
import { RecentActivity } from "./components/RecentActivity";
import { BottomBar } from "./components/BottomBar";

import { TakeAttendanceModal } from "./components/Modals/TakeAttendanceModal";
import { CreateAssignmentModal } from "./components/Modals/CreateAssignmentModal";
import { CreateAnnouncementModal } from "./components/Modals/CreateAnnouncementModal";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core Data States
  const [profile] = useState(initialTeacherProfile);
  const [timetable, setTimetable] = useState<TimetablePeriod[]>(initialTimetable);
  const [classSummaries, setClassSummaries] = useState<ClassAttendanceSummary[]>(
    initialClassAttendance
  );
  const heatmapDays = useMemo(() => generateYearlyHeatmapData(), []);
  const [atRiskStudents] = useState(atRiskStudentsList);
  const [assignments, setAssignments] = useState(assignmentsList);
  const [lessonPlans] = useState(lessonPlansList);

  // Modal States
  const [attendanceModalClass, setAttendanceModalClass] = useState<string | null>(
    null
  );
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Attendance update callback from modal
  const handleSaveAttendance = (
    className: string,
    stats: { present: number; absent: number; late: number; pct: number }
  ) => {
    setClassSummaries((prev) =>
      prev.map((c) =>
        c.className === className
          ? {
              ...c,
              present: stats.present,
              absent: stats.absent,
              late: stats.late,
              percentage: stats.pct,
              status: "completed",
            }
          : c
      )
    );

    setTimetable((prev) =>
      prev.map((p) =>
        p.className === className ? { ...p, presentCount: stats.present } : p
      )
    );

    showToast(`Attendance updated for ${className}: ${stats.pct}% Present (${stats.present} students)`);
  };

  // Handler for creating a new assignment
  const handleAssignmentCreated = (title: string, className: string) => {
    const newAss = {
      id: `a-${Date.now()}`,
      title,
      className,
      subject: "Mathematics",
      dueDate: "2026-07-28",
      assignedDate: "2026-07-21",
      submittedCount: 0,
      totalStudents: 41,
      reviewedCount: 0,
      avgScore: 0,
      status: "Active" as const,
    };
    setAssignments([newAss, ...assignments]);
    showToast(`Assignment Published: ${title} (${className})`);
  };

  const handleAnnouncementCreated = (title: string) => {
    showToast(`Announcement Broadcasted: ${title}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Container Layout */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Top Navigation Header */}
        <Header
          profile={profile}
          onOpenSearch={() => showToast("Global Search Bar Focused (Cmd+K)")}
          onQuickAction={(action) => {
            if (action === "profile") setActiveSection("profile");
            if (action === "settings") setActiveSection("settings");
          }}
        />

        {/* Dynamic Toast Alert Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={16} />
            {toast}
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Welcome Banner */}
          <WelcomeBanner
            profile={profile}
            onTakeAttendance={() => setAttendanceModalClass("Grade 10A")}
            onOpenCurrentClass={() => setActiveSection("classroom")}
            onCreateAssignment={() => setShowAssignmentModal(true)}
            onCreateAnnouncement={() => setShowAnnouncementModal(true)}
          />

          {/* Render Active View or All Views on Dashboard */}
          {activeSection === "dashboard" && (
            <div className="space-y-10">
              <TodaySummary onCardClick={(sec) => setActiveSection(sec as NavSection)} />

              <LiveTimetable
                periods={timetable}
                onStartClass={() => setActiveSection("classroom")}
                onTakeAttendance={(p) => setAttendanceModalClass(p.className)}
                onCreateAssignment={() => setShowAssignmentModal(true)}
                onAddLessonNotes={() => setActiveSection("lessons")}
              />

              <AttendanceCenter
                classSummaries={classSummaries}
                heatmapDays={heatmapDays}
                atRiskStudents={atRiskStudents}
                onMarkAttendance={(cls) => setAttendanceModalClass(cls)}
                onRunAIRecommendations={() => setActiveSection("attendance")}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AssignmentsModule
                  assignments={assignments}
                  onCreateAssignment={() => setShowAssignmentModal(true)}
                />

                <RecentActivity />
              </div>

              <AIAssistantModule />
            </div>
          )}

          {activeSection === "timetable" && (
            <LiveTimetable
              periods={timetable}
              onStartClass={() => setActiveSection("classroom")}
              onTakeAttendance={(p) => setAttendanceModalClass(p.className)}
              onCreateAssignment={() => setShowAssignmentModal(true)}
              onAddLessonNotes={() => setActiveSection("lessons")}
            />
          )}

          {activeSection === "attendance" && (
            <AttendanceCenter
              classSummaries={classSummaries}
              heatmapDays={heatmapDays}
              atRiskStudents={atRiskStudents}
              onMarkAttendance={(cls) => setAttendanceModalClass(cls)}
              onRunAIRecommendations={() => {}}
            />
          )}

          {activeSection === "assignments" && (
            <AssignmentsModule
              assignments={assignments}
              onCreateAssignment={() => setShowAssignmentModal(true)}
            />
          )}

          {activeSection === "lessons" && (
            <LessonPlansModule
              lessonPlans={lessonPlans}
              onCreateLessonPlan={() =>
                showToast("Lesson Plan Creator Opened")
              }
            />
          )}

          {activeSection === "grading" && <ClassPerformanceModule />}

          {activeSection === "exams" && <ExamManagementModule />}

          {activeSection === "students" && <StudentInsightsModule />}

          {activeSection === "classroom" && (
            <ClassroomToolsModule
              onTakeAttendance={() => setAttendanceModalClass("Grade 10B")}
              onCreateAnnouncement={() => setShowAnnouncementModal(true)}
            />
          )}

          {activeSection === "communication" && <CommunicationModule />}

          {activeSection === "reports" && <ReportsModule />}

          {activeSection === "calendar" && <CalendarModule />}

          {activeSection === "classes" && (
            <div className="space-y-6">
              <ClassPerformanceModule />
              <StudentInsightsModule />
            </div>
          )}

          {activeSection === "resources" && (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
              <Sparkles size={28} className="text-emerald-400 mx-auto" />
              <h2 className="text-base font-bold text-slate-100">SchoolOS Curriculum Resource Hub</h2>
              <p className="text-xs text-slate-400">
                Mathematics textbooks, past question papers, and interactive GeoGebra applets.
              </p>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-slate-100">{profile.name}</h2>
              <p className="text-xs text-slate-400">{profile.title} • {profile.department}</p>
              <div className="text-xs text-emerald-400 font-mono">Class Teacher: {profile.classTeacherOf}</div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-slate-100">Teacher Account Settings</h2>
              <p className="text-xs text-slate-400">Configure notifications, gradebook preferences, and dark theme defaults.</p>
            </div>
          )}
        </main>

        {/* Bottom Bar */}
        <BottomBar />
      </div>

      {/* Modals */}
      {attendanceModalClass && (
        <TakeAttendanceModal
          className={attendanceModalClass}
          onClose={() => setAttendanceModalClass(null)}
          onSave={(stats) => handleSaveAttendance(attendanceModalClass, stats)}
        />
      )}

      {showAssignmentModal && (
        <CreateAssignmentModal
          onClose={() => setShowAssignmentModal(false)}
          onCreated={handleAssignmentCreated}
        />
      )}

      {showAnnouncementModal && (
        <CreateAnnouncementModal
          onClose={() => setShowAnnouncementModal(false)}
          onCreated={handleAnnouncementCreated}
        />
      )}
    </div>
  );
}
