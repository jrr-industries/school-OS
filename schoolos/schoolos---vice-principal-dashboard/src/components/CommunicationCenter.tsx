import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  Smartphone,
  Mail,
  Bell,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Announcement } from '../types';

interface Props {
  announcements: Announcement[];
  onOpenAnnouncementModal: () => void;
  onOpenEmergencyModal: () => void;
}

export const CommunicationCenter: React.FC<Props> = ({
  announcements,
  onOpenAnnouncementModal,
  onOpenEmergencyModal
}) => {
  const [sentToast, setSentToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSentToast(msg);
    setTimeout(() => setSentToast(null), 2500);
  };

  return (
    <section id="communication" className="space-y-4 scroll-mt-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Communication Center</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
              Multichannel Broadcast
            </span>
          </h3>
          <p className="text-xs text-slate-400">Teacher circulars, parent advisory broadcasts, SMS/Email dispatch, and emergency notices</p>
        </div>
      </div>

      {sentToast && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{sentToast}</span>
        </div>
      )}

      {/* Top Quick Buttons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <button
          onClick={onOpenAnnouncementModal}
          className="flex items-center justify-center gap-2 p-3.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 group"
        >
          <Plus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>New Announcement</span>
        </button>

        <button
          onClick={() => triggerToast('App Push Notification Sent to 115 Staff & 1,900 Parents')}
          className="flex items-center justify-center gap-2 p-3.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-2xl text-sky-300 text-xs font-bold transition-all shadow-lg shadow-sky-950/40 group"
        >
          <Bell className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          <span>Send Push Notification</span>
        </button>

        <button
          onClick={() => triggerToast('Bulk SMS Dispatch Triggered (SchoolOS SMS Gateway Active)')}
          className="flex items-center justify-center gap-2 p-3.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-2xl text-purple-300 text-xs font-bold transition-all shadow-lg shadow-purple-950/40 group"
        >
          <Smartphone className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span>Send Bulk SMS</span>
        </button>

        <button
          onClick={() => triggerToast('Official Circular Email Sent to All Active Accounts')}
          className="flex items-center justify-center gap-2 p-3.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-2xl text-indigo-300 text-xs font-bold transition-all shadow-lg shadow-indigo-950/40 group"
        >
          <Mail className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Send Official Email</span>
        </button>

      </div>

      {/* Announcements List */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Recent Circulars & Announcements</h4>
          </div>
          <span className="text-xs text-slate-400">Live SchoolOS Portal Feed</span>
        </div>

        <div className="space-y-3">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-white">{anc.title}</h5>
                  {anc.isUrgent && (
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded uppercase">
                      Urgent Notice
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" /> {anc.date}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{anc.content}</p>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                <span>Audience: <strong className="text-emerald-400">{anc.targetAudience}</strong></span>
                <span>By: {anc.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
