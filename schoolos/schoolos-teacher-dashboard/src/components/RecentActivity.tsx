import React from "react";
import { recentActivitiesList } from "../data/mockData";
import { Activity, Clock } from "lucide-react";

export const RecentActivity: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Activity size={18} className="text-emerald-400" />
          Recent Activities & Audit Trail
        </h2>
      </div>

      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-2xl space-y-3">
        {recentActivitiesList.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${item.iconBg}`}>
                {item.type.toUpperCase()}
              </span>
              <div>
                <div className="font-bold text-slate-100">{item.title}</div>
                <div className="text-slate-400 mt-0.5">{item.description}</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0 ml-2">
              <Clock size={12} /> {item.timeAgo}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
