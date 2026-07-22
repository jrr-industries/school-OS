import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  AlertTriangle,
  UserCheck,
  Clock,
  Wrench,
  Navigation,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { busRoutesData } from '../../data/mockData';

export const TransportModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('LiveMap');
  const [selectedRoute, setSelectedRoute] = useState<string>('All');

  const subTabs = [
    { id: 'LiveMap', label: 'Live GPS Map' },
    { id: 'BusRoutes', label: 'Bus Routes (14 Fleets)' },
    { id: 'Drivers', label: 'Drivers & Personnel' },
    { id: 'Attendance', label: 'Student Bus Attendance' },
    { id: 'Incidents', label: 'Incident Logs', badge: 1 },
    { id: 'Maintenance', label: 'Fleet Maintenance' },
    { id: 'GPSHistory', label: 'GPS Speed & Route History' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Transport & Fleet Management
                <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-xs font-bold">
                  14 Active Buses
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live GPS telemetry, driver contact roster, delay incident handling & preventive maintenance scheduling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Fleet On-Time Rate:</span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm shadow-xs">
              92.8% (12 Buses On-Time)
            </span>
          </div>
        </div>

        {/* Subtabs bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bus Routes List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Live Fleet Monitor & Driver Communications
          </h3>
          <span className="text-xs font-bold text-slate-400">Telemetry Active • 30-Sec Refresh</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {busRoutesData.map((bus) => (
            <div
              key={bus.id}
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                bus.status === 'Delayed'
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {bus.busNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    bus.status === 'Delayed' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {bus.status}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">{bus.studentsCount} / {bus.capacity} seats</span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <p>Route: <strong>{bus.routeName}</strong></p>
                <p>Driver: <strong>{bus.driverName}</strong> ({bus.driverPhone})</p>
                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-emerald-500" /> ETA: {bus.eta}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700 text-xs">
                <button
                  onClick={() => alert(`Calling Driver ${bus.driverName} at ${bus.driverPhone}`)}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100"
                >
                  📞 Call Driver
                </button>
                <button
                  onClick={() => alert(`Tracking GPS history for ${bus.busNumber}`)}
                  className="px-2.5 py-1 rounded bg-orange-600 text-white font-bold hover:bg-orange-500"
                >
                  GPS Live Track
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
