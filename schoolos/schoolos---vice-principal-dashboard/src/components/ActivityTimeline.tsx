import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  UserCheck,
  Eye,
  Bus,
  ShieldCheck,
  Plus,
  Filter
} from 'lucide-react';
import { TimelineActivity } from '../types';

interface Props {
  activities: TimelineActivity[];
  onAddActivity: (title: string, desc: string, category: any) => void;
}

export const ActivityTimeline: React.FC<Props> = ({ activities, onAddActivity }) => {
  const [filter, setFilter] = useState('All');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredActivities = activities.filter(a => filter === 'All' || a.category === filter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onAddActivity(newTitle, newDesc || 'Log entry added by Vice Principal David Miller.', 'inspection');
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const getCategoryBadge = (cat: TimelineActivity['category']) => {
    switch (cat) {
      case 'attendance':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'leave':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'parent':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'inspection':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'transport':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'counseling':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <section id="reports" className="space-y-4 scroll-mt-20">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Activity Timeline</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full animate-pulse">
              Live Audit Log
            </span>
          </h3>
          <p className="text-xs text-slate-400">Chronological feed of today's school operations, submissions, and inspections</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-300 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-xl transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Activity</span>
        </button>
      </div>

      {/* Optional Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 animate-fade-in">
          <h4 className="text-xs font-bold text-white">Log Operational Inspection or Event</h4>
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Event title (e.g. Science Wing Fire Safety Inspection Passed)"
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          />
          <textarea
            rows={2}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Event details..."
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl"
            >
              Add Entry
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        
        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
          {filteredActivities.map((act) => (
            <div key={act.id} className="relative group">
              
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-sky-400 group-hover:scale-125 transition-transform"></div>

              <div className="p-3.5 bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 rounded-xl transition-all space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">{act.title}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${getCategoryBadge(act.category)}`}>
                      {act.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-sky-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {act.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Logged by: <strong>{act.actor}</strong></span>
                  {act.statusTag && (
                    <span className="text-emerald-400 font-semibold">{act.statusTag}</span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
