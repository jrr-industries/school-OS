import React, { useState } from 'react';
import { X, AlertOctagon, Radio, ShieldAlert, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSendEmergencyAlert: (title: string, details: string) => void;
}

export const EmergencyAlertModal: React.FC<Props> = ({ isOpen, onClose, onSendEmergencyAlert }) => {
  const [alertType, setAlertType] = useState('Severe Weather Warning');
  const [customDetails, setCustomDetails] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;

    onSendEmergencyAlert(alertType, customDetails || 'Immediate administrative attention requested.');
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setConfirmed(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950 border border-red-500/50 rounded-2xl shadow-2xl p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-red-400">Campus Emergency Alert System</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full uppercase tracking-wider">
                  Priority 1
                </span>
              </div>
              <p className="text-xs text-slate-400">High-priority broadcast to all school personnel & PA system</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-10 text-center space-y-3">
            <Radio className="w-12 h-12 text-red-500 mx-auto animate-ping" />
            <h4 className="text-base font-bold text-red-400">EMERGENCY ALERT BROADCAST ACTIVE</h4>
            <p className="text-xs text-slate-300">Sent to security desk, all classroom smartboards, PA speaker systems, and staff mobile apps.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            
            {/* Alert Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Emergency Protocol</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-red-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Severe Weather Warning">Severe Weather / High Rain Shelter Order</option>
                <option value="Campus Perimeter Lockdown">Campus Perimeter Lockdown / Gate Closure</option>
                <option value="Power Outage & Facility Alert">Power Substation Outage Protocol</option>
                <option value="Bus Fleet Route Emergency">Bus Fleet Delay / Transportation Lockdown</option>
                <option value="Custom Urgent Administrative Broadcast">Custom Urgent VP Broadcast</option>
              </select>
            </div>

            {/* Details */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Instructions & Location Notes</label>
              <textarea
                rows={3}
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Specify exact location or instructions (e.g., All students remain in Period 4 classrooms until further notice)."
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Confirmation Checkbox */}
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                />
                <span>
                  <strong>I confirm Vice Principal Authorization:</strong> This will trigger real-time audio PA alerts and lock high-priority notification channels across campus.
                </span>
              </label>
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
                disabled={!confirmed}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-40 rounded-xl transition-all shadow-lg shadow-red-600/30"
              >
                <ShieldAlert className="w-4 h-4" /> BROADCAST EMERGENCY ALERT
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
