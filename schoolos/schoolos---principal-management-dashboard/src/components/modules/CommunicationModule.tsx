import React, { useState } from 'react';
import {
  Megaphone,
  Bell,
  MessageSquare,
  AlertTriangle,
  Smartphone,
  Mail,
  Send,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { urgentNotices } from '../../data/mockData';

export const CommunicationModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('Announcements');

  const subTabs = [
    { id: 'Announcements', label: 'School Circulars' },
    { id: 'Notifications', label: 'App Notifications' },
    { id: 'ParentMessages', label: 'Parent Portal Inquiries' },
    { id: 'EmergencyAlerts', label: 'Emergency Broadcasts', badge: 1 },
    { id: 'SMS', label: 'SMS Gateway Log' },
    { id: 'Email', label: 'Email Newsletters' },
    { id: 'Push', label: 'Mobile Push Center' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Communication & Media Hub
                <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold">
                  96% Parent Engagement
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dispatch official circulars, emergency SMS/Email broadcasts, parent portal messaging & push notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Opening Emergency Broadcast Console')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" /> Emergency Campus Broadcast
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
                  ? 'bg-teal-600 text-white shadow-sm'
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

      {/* Main Notice Board */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Official Circulars & Executive Notices
          </h3>
          <button
            onClick={() => alert('New Circular Dispatch Dialog')}
            className="px-3 py-1 rounded-xl bg-teal-500/10 text-teal-600 font-bold text-xs hover:bg-teal-500/20"
          >
            + Create New Circular
          </button>
        </div>

        <div className="space-y-3">
          {urgentNotices.map((nc) => (
            <div
              key={nc.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{nc.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    {nc.category}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{nc.date}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{nc.content}</p>
              <p className="text-[10px] text-slate-400">Author: <strong>{nc.author}</strong></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
