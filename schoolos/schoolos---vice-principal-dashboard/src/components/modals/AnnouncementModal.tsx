import React, { useState } from 'react';
import { X, Megaphone, Send, CheckCircle, Smartphone, Mail, Bell } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddAnnouncement: (title: string, content: string, audience: 'All Staff' | 'Teachers' | 'Parents' | 'Students' | 'Emergency') => void;
}

export const AnnouncementModal: React.FC<Props> = ({ isOpen, onClose, onAddAnnouncement }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<'All Staff' | 'Teachers' | 'Parents' | 'Students' | 'Emergency'>('All Staff');
  const [sendSMS, setSendSMS] = useState(true);
  const [sendPush, setSendPush] = useState(true);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onAddAnnouncement(title, content, audience);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setTitle('');
      setContent('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Broadcast Announcement</h3>
              <p className="text-xs text-slate-400">Dispatch official notice across SchoolOS channels</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-semibold text-white">Announcement Broadcast Sent!</h4>
            <p className="text-xs text-slate-400">Dispatched to {audience} via SchoolOS App Push & SMS notification channels.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Staff Meeting at 03:30 PM"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Recipient Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All Staff">All Faculty & Administrative Staff</option>
                <option value="Teachers">Teaching Staff Only</option>
                <option value="Parents">Parents & Guardians</option>
                <option value="Students">Student Portal Broadcast</option>
              </select>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message Content</label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write detailed announcement message..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Channels */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Channels</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={sendPush}
                    onChange={(e) => setSendPush(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <Bell className="w-3.5 h-3.5 text-emerald-400" /> Mobile Push
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={sendSMS}
                    onChange={(e) => setSendSMS(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" /> SMS Text
                </label>
              </div>
            </div>

            {/* Actions */}
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
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast Now
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
