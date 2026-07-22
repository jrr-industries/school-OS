import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, Save, X, Search, Sparkles } from "lucide-react";

interface TakeAttendanceModalProps {
  className: string;
  onClose: () => void;
  onSave: (stats: { present: number; absent: number; late: number; pct: number }) => void;
}

export const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({
  className,
  onClose,
  onSave,
}) => {
  // Generate 20 students for the selected class
  const initialRoster = Array.from({ length: 20 }, (_, i) => ({
    id: `st-${i + 1}`,
    rollNumber: `${className.replace("Grade ", "")}-${(i + 1).toString().padStart(2, "0")}`,
    name: [
      "Alex Rivera", "David Chen", "Sarah Jenkins", "Marcus Vance", "Chloe Zhao",
      "Ethan Wright", "Maya Lin", "Tyler Durden", "Jessica Alba", "Brandon Roy",
      "Samantha Miller", "Leo Miller", "Sophia Martinez", "Lucas Kim", "Emma Watson",
      "Oliver Smith", "Ava Davis", "Liam Johnson", "Isabella Garcia", "Noah Wilson"
    ][i] || `Student ${i + 1}`,
    status: i === 2 ? "absent" : i === 7 ? "late" : "present", // Default realistic status
  }));

  const [roster, setRoster] = useState(initialRoster);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleStatus = (id: string, newStatus: "present" | "absent" | "late") => {
    setRoster(
      roster.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const presentCount = roster.filter((s) => s.status === "present").length;
  const absentCount = roster.filter((s) => s.status === "absent").length;
  const lateCount = roster.filter((s) => s.status === "late").length;
  const attendancePct = Math.round((presentCount / roster.length) * 100);

  const filteredRoster = roster.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      onSave({
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        pct: attendancePct,
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              Attendance Roster Marker
            </span>
            <h3 className="font-extrabold text-slate-100 text-base mt-1">
              Mark Attendance: {className}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Counters Banner */}
        <div className="grid grid-cols-4 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-xs shrink-0 font-mono">
          <div>
            <div className="text-slate-500 text-[10px]">Total</div>
            <div className="font-bold text-slate-100">{roster.length}</div>
          </div>
          <div>
            <div className="text-emerald-500 text-[10px]">Present</div>
            <div className="font-bold text-emerald-400">{presentCount}</div>
          </div>
          <div>
            <div className="text-rose-500 text-[10px]">Absent</div>
            <div className="font-bold text-rose-400">{absentCount}</div>
          </div>
          <div>
            <div className="text-amber-500 text-[10px]">Rate</div>
            <div className="font-bold text-cyan-400">{attendancePct}%</div>
          </div>
        </div>

        {/* Search */}
        <div className="shrink-0">
          <input
            type="text"
            placeholder="Search student name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Roster Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 sticky top-0 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Roll</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3 text-right">Attendance Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {filteredRoster.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{st.rollNumber}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-100">{st.name}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => toggleStatus(st.id, "present")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          st.status === "present"
                            ? "bg-emerald-500 text-slate-950 shadow"
                            : "bg-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => toggleStatus(st.id, "late")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          st.status === "late"
                            ? "bg-amber-500 text-slate-950 shadow"
                            : "bg-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => toggleStatus(st.id, "absent")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          st.status === "absent"
                            ? "bg-rose-500 text-white shadow"
                            : "bg-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => setRoster(roster.map((s) => ({ ...s, status: "present" })))}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Mark All Present
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg"
          >
            <Save size={15} /> Save & Submit Roster ({attendancePct}%)
          </button>
        </div>
      </div>
    </div>
  );
};
