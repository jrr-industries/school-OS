import React, { useState } from 'react';
import {
  Calendar,
  Trophy,
  Compass,
  Award,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { upcomingEvents } from '../../data/mockData';

export const ActivitiesModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('Events');

  const subTabs = [
    { id: 'Events', label: 'School Events' },
    { id: 'Sports', label: 'Inter-School Sports' },
    { id: 'Clubs', label: 'Extracurricular Clubs (24)' },
    { id: 'Competitions', label: 'Academic Competitions' },
    { id: 'FieldTrips', label: 'Excursions & Field Trips' },
    { id: 'Calendar', label: 'Activities Master Calendar' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Co-Curricular & Student Life Activities
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-bold">
                  24 Active Student Clubs
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sports leagues, robotics tournaments, field trips, drama, debate & house competition calendar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Add Event Dialog')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule New Event
            </button>
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
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Upcoming Calendar Highlights & Events
          </h3>
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Term 1 Events</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 uppercase">
                  {ev.category}
                </span>
                <span className="text-[11px] font-extrabold text-cyan-600 dark:text-cyan-400">{ev.date}</span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{ev.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ev.time} • {ev.attendeesCount} Expected Attendees</p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs text-slate-500 flex justify-between">
                <span>📍 {ev.location}</span>
                <span>In-charge: <strong>{ev.organizer}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
