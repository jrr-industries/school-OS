import React from "react";
import {
  CalendarDays,
  Users,
  FileText,
  AlertCircle,
  Award,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

interface TodaySummaryProps {
  onCardClick?: (section: string) => void;
}

export const TodaySummary: React.FC<TodaySummaryProps> = ({ onCardClick }) => {
  const summaryCards = [
    {
      id: "timetable",
      title: "Today's Classes",
      value: "6",
      subtext: "2 Completed • 1 Active • 3 Next",
      icon: CalendarDays,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
      accent: "emerald",
    },
    {
      id: "students",
      title: "Students Today",
      value: "214",
      subtext: "Across 5 teaching blocks",
      icon: Users,
      iconColor: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
      accent: "cyan",
    },
    {
      id: "assignments",
      title: "Assignments Pending Review",
      value: "28",
      subtext: "Problem Set 4 (Grade 10A)",
      icon: FileText,
      iconColor: "text-indigo-400",
      bgColor: "bg-indigo-500/10 border-indigo-500/20",
      accent: "indigo",
    },
    {
      id: "attendance",
      title: "Attendance Pending",
      value: "1 Class",
      subtext: "Grade 9B Foundation Math",
      icon: AlertCircle,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20",
      accent: "amber",
      highlight: true,
    },
    {
      id: "exams",
      title: "Upcoming Exams",
      value: "2",
      subtext: "Mid-Term Invigilation scheduled",
      icon: Award,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/20",
      accent: "purple",
    },
    {
      id: "communication",
      title: "Unread Messages",
      value: "8",
      subtext: "2 Parents • 1 Principal Notice",
      icon: MessageSquare,
      iconColor: "text-rose-400",
      bgColor: "bg-rose-500/10 border-rose-500/20",
      accent: "rose",
    },
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          Today's Summary
          <span className="text-xs font-normal text-slate-400">
            Real-time daily status overview
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onCardClick?.(card.id)}
              className={`p-4 rounded-2xl bg-slate-900/90 border hover:border-slate-700 transition duration-200 cursor-pointer group relative overflow-hidden shadow-lg ${
                card.highlight ? "ring-1 ring-amber-500/40" : "border-slate-800/80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${card.bgColor} border`}>
                  <Icon size={20} className={card.iconColor} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-slate-600 group-hover:text-slate-200 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              <div className="mt-3">
                <div className="text-2xl font-black text-slate-100 tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">
                  {card.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {card.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
