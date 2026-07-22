import React, { useState } from "react";
import { Megaphone, X } from "lucide-react";

interface CreateAnnouncementModalProps {
  onClose: () => void;
  onCreated: (title: string) => void;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState("Mid-Term Exam Practice Schedule & Review Session");
  const [audience, setAudience] = useState("Grade 10A Students & Parents");
  const [message, setMessage] = useState(
    "Please note that an optional Mathematics review session will be held this Thursday at 03:30 PM in Room 302."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreated(title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Megaphone size={18} className="text-cyan-400" />
            Broadcast School Announcement
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-200">
          <div>
            <label className="block font-semibold mb-1">Announcement Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Audience Group</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Message Content</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
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
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg"
            >
              Broadcast Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
