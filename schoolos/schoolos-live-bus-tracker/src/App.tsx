import React, { useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { BusLiveTrackerWidget } from './components/BusLiveTrackerWidget';
import { SidebarWidgets } from './components/SidebarWidgets';
import { DriverCallModal } from './components/DriverCallModal';
import { mockBusData, secondaryBusData } from './mockData';
import { SchoolBus } from './types';

export default function App() {
  const [selectedBus, setSelectedBus] = useState<SchoolBus>(mockBusData);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState<boolean>(false);

  const availableBuses = [mockBusData, secondaryBusData];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <DashboardHeader
        currentBus={selectedBus}
        availableBuses={availableBuses}
        onSelectBus={(bus) => setSelectedBus(bus)}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Primary View: Compact "School Bus Live Tracking" Widget */}
          <div className="lg:col-span-2">
            <BusLiveTrackerWidget
              key={selectedBus.id}
              initialBusData={selectedBus}
            />
          </div>

          {/* Secondary Dashboard Context Sidebar */}
          <div className="lg:col-span-1">
            <SidebarWidgets
              bus={selectedBus}
              onCallDriver={() => setIsDriverModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Driver Call Modal */}
      <DriverCallModal
        bus={selectedBus}
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
      />

      {/* Enterprise Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 glass-card mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-400">SchoolOS</span>
            <span>• Student & Parent Live Transit Portal</span>
          </div>
          <div className="text-[11px] text-slate-500">
            🔒 View-Only Mode • Real-Time GPS Tracking Protocol
          </div>
        </div>
      </footer>
    </div>
  );
}
