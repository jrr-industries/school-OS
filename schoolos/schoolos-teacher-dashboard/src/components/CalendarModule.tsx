import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Award, Users, MapPin, Sparkles } from "lucide-react";

export const CalendarModule: React.FC = () => {
  const [filterTag, setFilterTag] = useState<string>("All");

  const calendarEvents = [
    {
      id: "1",
      title: "Grade 10A Period 1 Mathematics",
      category: "Today's Schedule",
      time: "08:30 AM - 09:20 AM",
      room: "Room 302",
      type: "class",
    },
    {
      id: "2",
      title: "Grade 10B Period 3 Mathematics (LIVE)",
      category: "Today's Schedule",
      time: "10:30 AM - 11:20 AM",
      room: "Room 304",
      type: "class",
    },
    {
      id: "3",
      title: "Faculty Departmental Meeting",
      category: "Meetings",
      time: "03:15 PM - 04:00 PM",
      room: "Conference Hall B",
      type: "meeting",
    },
    {
      id: "4",
      title: "Mid-Term Mathematics Paper 1 Exam",
      category: "Upcoming Exams",
      time: "Aug 4, 09:00 AM",
      room: "Main Auditorium",
      type: "exam",
    },
    {
      id: "5",
      title: "Parent-Teacher Conference (Alex Rivera)",
      category: "Parent Meetings",
      time: "July 24, 04:00 PM",
      room: "Faculty Hub",
      type: "parent",
    },
    {
      id: "6",
      title: "Annual STEM Exhibition & Olympiad Kickoff",
      category: "Events",
      time: "Aug 12, All Day",
      room: "School Ground",
      type: "event",
    },
  ];

  const filteredEvents =
    filterTag === "All"
      ? calendarEvents
      : calendarEvents.filter((e) => e.category === filterTag);

  return (
    <section className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <CalendarIcon size={20} className="text-cyan-400" />
          Academic Schedule & Calendar Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Unified timetable calendar, faculty meetings, parent conferences, and exam dates.
        </p>
      </div>

      {/* Filter Chips (Section 13 Requirement) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        {[
          "All",
          "Today's Schedule",
          "Upcoming Exams",
          "Meetings",
          "Events",
          "Parent Meetings",
        ].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterTag === tag
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                  {evt.category}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <Clock size={12} /> {evt.time}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-xs mt-2">{evt.title}</h3>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-2 border-t border-slate-800/80">
              <MapPin size={12} className="text-slate-500" />
              {evt.room}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
