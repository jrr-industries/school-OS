import React, { useState } from 'react';
import {
  Calendar,
  Bell,
  Sparkles,
  Send,
  Pin,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { upcomingEvents, urgentNotices } from '../data/mockData';
import { SchoolEvent, NoticeItem } from '../types';

export const EventsAndNotices: React.FC = () => {
  const [showAIDraftModal, setShowAIDraftModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('Parents & Staff');
  const [urgency, setUrgency] = useState('Standard');
  const [draftedNotice, setDraftedNotice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [postedNotices, setPostedNotices] = useState<NoticeItem[]>(urgentNotices);

  const handleGenerateNotice = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/draft-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, targetAudience, urgency }),
      });
      const data = await res.json();
      setDraftedNotice(data.notice || 'Generated announcement successfully.');
    } catch (e) {
      setDraftedNotice(
        `OFFICIAL ANNOUNCEMENT: ${topic.toUpperCase()}\n\nDear ${targetAudience},\n\nPlease be advised regarding ${topic}. We appreciate your cooperation.\n\nWarm regards,\nDr. Sarah Johnson\nPrincipal`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishNotice = () => {
    if (!draftedNotice) return;
    const newNotice: NoticeItem = {
      id: `NOT-${Date.now()}`,
      title: topic || 'Principal Announcement',
      author: 'Principal Dr. Sarah Johnson',
      date: 'Just Now',
      category: 'Urgent',
      content: draftedNotice,
      pinned: true,
    };
    setPostedNotices([newNotice, ...postedNotices]);
    setShowAIDraftModal(false);
    setDraftedNotice('');
    setTopic('');
  };

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Upcoming School Events & Official Notice Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Campus event calendar and principal broadcast communications feed
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAIDraftModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Draft Announcement with AI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events Calendar */}
        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-500" /> Term 1 Events Calendar
          </h3>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {evt.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {evt.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {evt.date} • {evt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {evt.location}
                  </span>
                </p>

                <p className="text-[10px] text-slate-400">
                  Organizer: {evt.organizer} • Expected Attendees: {evt.attendeesCount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Broadcast Feed */}
        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-500" /> Official Circulars & Notices
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {postedNotices.map((not) => (
              <div
                key={not.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    {not.pinned && <Pin className="w-3 h-3 text-rose-500 fill-rose-500" />}
                    {not.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{not.date}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {not.content}
                </p>

                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                  Issued by: {not.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Notice Builder Modal */}
      {showAIDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Principal Announcement Studio
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Draft Official Broadcast
                </h3>
              </div>
              <button
                onClick={() => setShowAIDraftModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Announcement Subject
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Parent-Teacher Strategy Conference schedule update"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Parents & Staff">Parents & Staff</option>
                    <option value="All Faculty">All Faculty</option>
                    <option value="High School Students">High School Students</option>
                    <option value="Entire Campus">Entire Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Standard">Standard</option>
                    <option value="High Priority">High Priority</option>
                    <option value="Urgent Emergency">Urgent Emergency</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateNotice}
                disabled={isGenerating || !topic.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                {isGenerating ? 'Generating Notice with Gemini AI...' : 'Draft Announcement Text'}
              </button>

              {draftedNotice && (
                <div className="space-y-2 pt-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Drafted Notice Preview
                  </label>
                  <textarea
                    value={draftedNotice}
                    onChange={(e) => setDraftedNotice(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono"
                  />
                  <button
                    onClick={handlePublishNotice}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Broadcast & Post Notice Immediately
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
