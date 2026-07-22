import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StickyKPIBar } from './components/StickyKPIBar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { ActionCenterAndAlerts } from './components/ActionCenterAndAlerts';
import { SchoolOverview } from './components/SchoolOverview';
import { PendingApprovals } from './components/PendingApprovals';
import { SchoolKPIs } from './components/SchoolKPIs';
import { AcademicAndDepartments } from './components/AcademicAndDepartments';
import { InfrastructureAndInventory } from './components/InfrastructureAndInventory';
import { ChartsSection } from './components/ChartsSection';
import { PerformanceSection } from './components/PerformanceSection';
import { FinanceTransportLunch } from './components/FinanceTransportLunch';
import { EventsAndNotices } from './components/EventsAndNotices';

// Phase 2 Principal Modules
import { AcademicsModule } from './components/modules/AcademicsModule';
import { StudentsModule } from './components/modules/StudentsModule';
import { TeachersModule } from './components/modules/TeachersModule';
import { ExamsModule } from './components/modules/ExamsModule';
import { TransportModule } from './components/modules/TransportModule';
import { LunchModule } from './components/modules/LunchModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { CommunicationModule } from './components/modules/CommunicationModule';
import { ActivitiesModule } from './components/modules/ActivitiesModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { ApprovalCenterModule } from './components/modules/ApprovalCenterModule';

import { AIBriefingModal } from './components/AIBriefingModal';
import { BusMapModal } from './components/BusMapModal';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';

import {
  initialSchoolInfo,
  initialApprovals,
  initialKPIs,
  busRoutesData,
} from './data/mockData';
import { PendingApproval, SchoolKPI, BusRoute } from './types';

export default function App() {
  const [schoolInfo, setSchoolInfo] = useState(initialSchoolInfo);
  const [approvals, setApprovals] = useState<PendingApproval[]>(initialApprovals);
  const [kpis, setKpis] = useState<SchoolKPI[]>(initialKPIs);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('Today');

  // Modals
  const [showAIBriefingModal, setShowAIBriefingModal] = useState<boolean>(false);
  const [selectedMapBus, setSelectedMapBus] = useState<BusRoute | null>(null);

  // Approval Handlers
  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Approved' } : a))
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Rejected' } : a))
    );
  };

  const handleRequestInfo = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'InfoRequested' } : a))
    );
  };

  const handleQuickAction = (actionName: string) => {
    alert(`Principal Executive Command Issued: ${actionName}`);
  };

  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-colors duration-200 relative`}>
      {/* Top Bar Header */}
      <Header
        schoolInfo={schoolInfo}
        pendingCount={pendingCount}
        onOpenAIBriefing={() => setShowAIBriefingModal(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeSection={activeTab}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* Sticky KPI Bar (Small UI Improvement 1) */}
      <StickyKPIBar
        schoolInfo={schoolInfo}
        pendingApprovalsCount={pendingCount}
        alertsCount={2}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingCount={pendingCount}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Section 1 — Welcome Banner (~140px) */}
          <WelcomeBanner
            schoolInfo={schoolInfo}
            onOpenAIBriefing={() => setShowAIBriefingModal(true)}
          />

          {/* Render Active Principal Module */}
          {activeTab === 'academics' && <AcademicsModule />}
          {activeTab === 'students' && <StudentsModule />}
          {activeTab === 'teachers' && <TeachersModule />}
          {activeTab === 'exams' && <ExamsModule />}
          {activeTab === 'transport' && <TransportModule />}
          {activeTab === 'lunch' && <LunchModule />}
          {activeTab === 'finance' && <FinanceModule />}
          {activeTab === 'communication' && <CommunicationModule />}
          {activeTab === 'activities' && <ActivitiesModule />}
          {activeTab === 'reports' && <ReportsModule />}
          {activeTab === 'approvals' && <ApprovalCenterModule />}

          {/* Executive Dashboard Layout (Default View) */}
          {activeTab === 'dashboard' && (
            <>
              {/* Priority 1 Section: Action Center, Principal Calendar, School Alerts & Audit Activities */}
              <ActionCenterAndAlerts onQuickAction={handleQuickAction} />

              {/* Core Overview Summary Cards */}
              <SchoolOverview onQuickAction={handleQuickAction} />

              {/* Priority 2 Section: Academic Health, Department Performance, Classroom Status & Staff Breakdown */}
              <AcademicAndDepartments />

              {/* Priority 2 & 3 Section: Infrastructure Telemetry, Admission Overview, Inventory Overview & Parent Engagement */}
              <InfrastructureAndInventory />

              {/* Pending Approvals Quick Widget */}
              <PendingApprovals
                approvals={approvals}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestInfo={handleRequestInfo}
              />

              {/* KPI Analytics */}
              <SchoolKPIs kpis={kpis} />

              {/* Charts & Trends */}
              <ChartsSection />

              {/* Performance Dashboard */}
              <PerformanceSection />

              {/* Finance, Transport & Cafeteria */}
              <FinanceTransportLunch
                onOpenBusMapModal={(bus) => setSelectedMapBus(bus)}
              />

              {/* Events & Notices */}
              <EventsAndNotices />
            </>
          )}
        </main>
      </div>

      {/* Floating Speed Dial FAB (Small UI Improvement 2) */}
      <FloatingActions
        onTriggerAction={handleQuickAction}
        onOpenAIBriefing={() => setShowAIBriefingModal(true)}
      />

      {/* System Info Footer (Priority 6) */}
      <Footer />

      {/* AI Briefing Modal */}
      <AIBriefingModal
        schoolInfo={schoolInfo}
        isOpen={showAIBriefingModal}
        onClose={() => setShowAIBriefingModal(false)}
      />

      {/* Bus Telemetry Map Modal */}
      <BusMapModal
        bus={selectedMapBus}
        onClose={() => setSelectedMapBus(null)}
      />
    </div>
  );
}

