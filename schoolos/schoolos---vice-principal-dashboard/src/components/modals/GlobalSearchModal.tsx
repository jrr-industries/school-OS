import React, { useState } from 'react';
import { Search, X, User, ShieldAlert, Bus, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { UrgentActionItem, TeacherRecord, StudentAlertItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  urgentItems: UrgentActionItem[];
  teachers: TeacherRecord[];
  studentAlerts: StudentAlertItem[];
  onSelectUrgent: (item: UrgentActionItem) => void;
}

export const GlobalSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  urgentItems,
  teachers,
  studentAlerts,
  onSelectUrgent
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredUrgent = urgentItems.filter(u =>
    u.title.toLowerCase().includes(query.toLowerCase()) ||
    u.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.department.toLowerCase().includes(query.toLowerCase()) ||
    t.currentClass.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStudents = studentAlerts.filter(s =>
    s.studentName.toLowerCase().includes(query.toLowerCase()) ||
    s.gradeClass.toLowerCase().includes(query.toLowerCase()) ||
    s.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search operational status, teachers, students, bus routes, classrooms..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          
          {/* Urgent Actions Match */}
          {filteredUrgent.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Urgent Action Items ({filteredUrgent.length})
              </div>
              <div className="space-y-1.5">
                {filteredUrgent.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectUrgent(item);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-800/60 hover:border-slate-700 rounded-xl cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                          item.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teachers Match */}
          {filteredTeachers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" /> Faculty & Staff ({filteredTeachers.length})
              </div>
              <div className="space-y-1.5">
                {filteredTeachers.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 bg-slate-800/40 border border-slate-800/60 rounded-xl"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{t.name}</div>
                      <div className="text-[11px] text-slate-400">{t.department} • {t.currentClass} ({t.room})</div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      t.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Match */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Student Records ({filteredStudents.length})
              </div>
              <div className="space-y-1.5">
                {filteredStudents.map(s => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 bg-slate-800/40 border border-slate-800/60 rounded-xl"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{s.studentName} ({s.gradeClass})</div>
                      <div className="text-[11px] text-slate-400">{s.type} • {s.details}</div>
                    </div>
                    <span className="text-[10px] text-slate-400">{s.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredUrgent.length === 0 && filteredTeachers.length === 0 && filteredStudents.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching records or operational items found for "{query}".
            </div>
          )}

        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-slate-300">Esc</kbd> to exit search</span>
          <span>SchoolOS Command Index v4.2</span>
        </div>

      </div>
    </div>
  );
};
