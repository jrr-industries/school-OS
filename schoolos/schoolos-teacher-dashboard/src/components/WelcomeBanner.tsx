import React from "react";
import { TeacherProfile } from "../types";
import {
  CheckCircle2,
  Play,
  PlusCircle,
  Megaphone,
  Sparkles,
  Clock,
  BookOpen,
} from "lucide-react";

interface WelcomeBannerProps {
  profile: TeacherProfile;
  onTakeAttendance: () => void;
  onOpenCurrentClass: () => void;
  onCreateAssignment: () => void;
  onCreateAnnouncement: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  profile,
  onTakeAttendance,
  onOpenCurrentClass,
  onCreateAssignment,
  onCreateAnnouncement,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800/80 p-6 md:p-8 shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Welcome Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles size={13} className="text-emerald-400" />
            Teaching Command Center • Live Period 3
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Good Morning,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              {profile.name}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-300 font-medium pt-1">
            <span className="flex items-center gap-1.5 text-slate-200">
              <BookOpen size={15} className="text-emerald-400" />
              {profile.title}
            </span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-emerald-300 border border-slate-700/60 font-semibold">
              Class Teacher - {profile.classTeacherOf}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={14} className="text-slate-500" />
              Academic Year {profile.academicYear}
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-xl pt-1">
            You have 6 classes scheduled today. Your next active session is{" "}
            <strong className="text-slate-200">Grade 10B Mathematics</strong> in{" "}
            <span className="text-emerald-400 font-semibold">Room 304</span>.
          </p>
        </div>

        {/* Right Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onTakeAttendance}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition transform active:scale-95"
          >
            <CheckCircle2 size={16} />
            Take Attendance
          </button>

          <button
            onClick={onOpenCurrentClass}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-xs transition active:scale-95 shadow-md"
          >
            <Play size={15} className="text-emerald-400 fill-emerald-400" />
            Open Current Class
          </button>

          <button
            onClick={onCreateAssignment}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-xs transition active:scale-95 shadow-md"
          >
            <PlusCircle size={15} className="text-teal-400" />
            Create Assignment
          </button>

          <button
            onClick={onCreateAnnouncement}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-xs transition active:scale-95 shadow-md"
          >
            <Megaphone size={15} className="text-cyan-400" />
            Create Announcement
          </button>
        </div>
      </div>
    </div>
  );
};
