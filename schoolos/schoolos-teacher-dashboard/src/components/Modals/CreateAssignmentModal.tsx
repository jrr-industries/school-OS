import React, { useState } from "react";
import { PlusCircle, X, Check } from "lucide-react";

interface CreateAssignmentModalProps {
  onClose: () => void;
  onCreated: (title: string, className: string) => void;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState("Problem Set 5: Quadratic Optimization");
  const [targetClass, setTargetClass] = useState("Grade 10A");
  const [dueDate, setDueDate] = useState("2026-07-28");
  const [desc, setDesc] = useState("Complete questions 1 to 12 in Chapter 4. Submit PDF scan.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreated(title, targetClass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <PlusCircle size={18} className="text-teal-400" />
            Create & Publish New Assignment
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-200">
          <div>
            <label className="block font-semibold mb-1">Assignment Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Target Class</label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500"
              >
                <option value="Grade 10A">Grade 10A</option>
                <option value="Grade 10B">Grade 10B</option>
                <option value="Grade 9A">Grade 9A</option>
                <option value="Grade 11A">Grade 11A</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Instructions & Problem Description</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
