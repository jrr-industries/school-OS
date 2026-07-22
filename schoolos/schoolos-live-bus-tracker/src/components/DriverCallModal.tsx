import React from 'react';
import { SchoolBus } from '../types';

interface DriverCallModalProps {
  bus: SchoolBus;
  isOpen: boolean;
  onClose: () => void;
}

export const DriverCallModal: React.FC<DriverCallModalProps> = ({ bus, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md rounded-2xl glass-card p-6 border border-slate-700/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="relative">
            <img
              src={bus.driverPhoto}
              alt={bus.driverName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md shadow-amber-500/20"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900 text-[10px]">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{bus.driverName}</h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                {bus.busNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Assigned Route Driver • License {bus.licensePlate}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400 font-semibold">
              <span>★ {bus.driverRating}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Certified SchoolOS Driver</span>
            </div>
          </div>
        </div>

        {/* Call options */}
        <div className="mt-5 space-y-3">
          <a
            href={`tel:${bus.driverPhone}`}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Call Driver Now ({bus.driverPhone})</span>
          </a>

          <a
            href={`sms:${bus.driverPhone}`}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
          >
            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 8 9 8z" />
            </svg>
            <span>Send SMS Text Message</span>
          </a>
        </div>

        {/* Emergency Dispatch */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <div className="font-semibold text-slate-200 flex items-center justify-between">
            <span>🏫 School Dispatch Center</span>
            <a href="tel:+15559008800" className="text-sky-400 hover:underline font-bold">+1 (555) 900-8800</a>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            For urgent route inquiries or student absence notifications, contact dispatch directly.
          </p>
        </div>

        {/* Safety Disclaimer */}
        <p className="mt-4 text-[11px] text-slate-500 text-center leading-normal">
          🔒 Safety First: Drivers will only answer calls using approved hands-free equipment or while vehicle is parked.
        </p>
      </div>
    </div>
  );
};
