import React, { useState } from 'react';
import {
  AlertOctagon,
  Clock,
  Calendar as CalendarIcon,
  Bell,
  Activity,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Radio,
  MapPin,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  actionCenterItemsData,
  principalCalendarEventsData,
  schoolAlertsData,
  activityLogsData,
} from '../data/mockData';

interface ActionCenterAndAlertsProps {
  onQuickAction?: (actionName: string) => void;
}

export const ActionCenterAndAlerts: React.FC<ActionCenterAndAlertsProps> = ({
  onQuickAction,
}) => {
  const [calendarDay, setCalendarDay] = useState<'Today' | 'Tomorrow'>('Today');
  const [items, setItems] = useState(actionCenterItemsData);

  const filteredCalendar = principalCalendarEventsData.filter(
    (evt) => evt.day === calendarDay
  );

  const handleResolveAction = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Priority 1 Row 1: Action Center & Principal Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Action Center (2 Cols on LG) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Action Center
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black">
                    {items.length} Active
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Urgent operational items requiring immediate principal oversight or decision
                </p>
              </div>
            </div>

            <button
              onClick={() => onQuickAction && onQuickAction('View All Action Items')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => {
              const dotColor =
                item.severity === 'red'
                  ? 'bg-rose-500 text-rose-500'
                  : item.severity === 'orange'
                  ? 'bg-orange-500 text-orange-500'
                  : item.severity === 'yellow'
                  ? 'bg-amber-500 text-amber-500'
                  : 'bg-emerald-500 text-emerald-500';

              const badgeStyle =
                item.severity === 'red'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50'
                  : item.severity === 'orange'
                  ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/50'
                  : item.severity === 'yellow'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border ${badgeStyle} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:shadow-xs`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${dotColor.split(' ')[0]} animate-pulse`} />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          • {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        {item.category}
                        {item.actionRequired && (
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                            ↳ {item.actionRequired}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleResolveAction(item.id)}
                    className="self-end sm:self-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-slate-700 shrink-0 transition-all"
                  >
                    Resolve / Dismiss
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Principal Calendar Widget (1 Col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Principal Calendar
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Schedule & Observations</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setCalendarDay('Today')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  calendarDay === 'Today'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setCalendarDay('Tomorrow')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  calendarDay === 'Tomorrow'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredCalendar.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {evt.time}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                    {evt.type}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {evt.title}
                </h4>
                {evt.location && (
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {evt.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority 1 Row 2: School Alerts Panel & Recent Activities Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. School Alerts Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  School Alerts Panel
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Critical operational health, transportation & network indicators
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
              5 Telemetry Streams
            </span>
          </div>

          <div className="space-y-2.5">
            {schoolAlertsData.map((alt) => {
              const dot =
                alt.severity === 'red'
                  ? '🔴'
                  : alt.severity === 'orange'
                  ? '🟠'
                  : alt.severity === 'yellow'
                  ? '🟡'
                  : '🟢';

              return (
                <div
                  key={alt.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
                >
                  <span className="text-sm shrink-0 mt-0.5">{dot}</span>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {alt.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {alt.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {alt.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Recent Activities Timeline (Audit Log) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Activities Timeline
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Audit log of administrative approvals, payments, and submissions
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">Live Campus Feed</span>
          </div>

          <div className="relative border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-3 pl-4 space-y-4 my-2">
            {activityLogsData.map((act) => (
              <div key={act.id} className="relative group">
                {/* Node Bullet */}
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-900" />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {act.title}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Executed by: <strong className="text-slate-700 dark:text-slate-300">{act.actor}</strong> • Type:{' '}
                    <span className="font-semibold">{act.type}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
