import React, { useState } from 'react';
import { X, UserCheck, ShieldAlert, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { TeacherRecord } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teachers: TeacherRecord[];
  onAssignSubstitute: (teacherId: string, substituteName: string) => void;
  targetTeacher?: TeacherRecord;
}

export const AssignSubstituteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  teachers,
  onAssignSubstitute,
  targetTeacher
}) => {
  const [selectedSubstitute, setSelectedSubstitute] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  if (!isOpen) return null;

  const availableTeachers = [
    { name: 'Mr. Alan Turing', dept: 'Mathematics', freePeriods: 'Period 3, 4', status: 'Free Now' },
    { name: 'Mrs. Sarah Connor', dept: 'Computer Science', freePeriods: 'Period 4, 6', status: 'Free Now' },
    { name: 'Mr. Marcus Brody', dept: 'History', freePeriods: 'Period 4', status: 'Free Now' },
    { name: 'Ms. Clara Vance', dept: 'Mathematics', freePeriods: 'Period 5, 7', status: 'In Class' }
  ];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubstitute) return;
    
    if (targetTeacher) {
      onAssignSubstitute(targetTeacher.id, selectedSubstitute);
    } else if (teachers.length > 0) {
      onAssignSubstitute(teachers[0].id, selectedSubstitute);
    }

    setAssignedSuccess(true);
    setTimeout(() => {
      setAssignedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 border border-sky-500/30 rounded-xl text-sky-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Substitute Teacher Assignment</h3>
              <p className="text-xs text-slate-400">Reassign unstaffed period classes instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {assignedSuccess ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-semibold text-white">Substitute Assigned Successfully!</h4>
            <p className="text-xs text-slate-400">Class timetable updated & teacher notified via SchoolOS mobile app.</p>
          </div>
        ) : (
          <form onSubmit={handleAssign} className="space-y-4">
            
            {/* Class Requiring Cover */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> High Priority Unstaffed Period</span>
                <span>Period 3 & 4 Today</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {targetTeacher ? targetTeacher.name : 'Dr. Robert Harrison'} — {targetTeacher ? targetTeacher.department : 'Science & Physics'}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-slate-500" /> {targetTeacher ? targetTeacher.currentClass : 'Grade 11 AP Physics'}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {targetTeacher ? targetTeacher.room : 'Room 204'}</span>
              </div>
            </div>

            {/* Select Available Substitute */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Available Faculty Member (Free Period Match)
              </label>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {availableTeachers.map((sub, i) => (
                  <label
                    key={i}
                    onClick={() => setSelectedSubstitute(sub.name)}
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                      selectedSubstitute === sub.name
                        ? 'bg-sky-500/15 border-sky-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="substitute"
                        checked={selectedSubstitute === sub.name}
                        onChange={() => setSelectedSubstitute(sub.name)}
                        className="text-sky-500 focus:ring-sky-500"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">{sub.name}</div>
                        <div className="text-[11px] text-slate-400">{sub.dept} • {sub.freePeriods}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      sub.status === 'Free Now' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {sub.status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instructions for Substitute (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please conduct Chapter 4 Review Worksheet on Google Classroom."
                rows={2}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedSubstitute}
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-40 disabled:hover:bg-sky-400 rounded-xl transition-all shadow-lg shadow-sky-500/20"
              >
                Confirm Substitute Assignment
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
