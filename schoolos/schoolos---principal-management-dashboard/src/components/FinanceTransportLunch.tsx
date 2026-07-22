import React, { useState } from 'react';
import {
  DollarSign,
  Bus,
  Utensils,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { busRoutesData, todayLunchMenu } from '../data/mockData';
import { BusRoute } from '../types';

interface FinanceTransportLunchProps {
  onOpenBusMapModal?: (bus: BusRoute) => void;
}

export const FinanceTransportLunch: React.FC<FinanceTransportLunchProps> = ({
  onOpenBusMapModal,
}) => {
  const [activeTab, setActiveTab] = useState<'transport' | 'finance' | 'lunch'>('transport');
  const [selectedBus, setSelectedBus] = useState<BusRoute>(busRoutesData[0]);

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6">
      {/* Top Header & Section Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Finance, Transport Fleet & Cafeteria Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live bus route telemetry, fee collection status and cafeteria meal logs
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('transport')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'transport'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Bus className="w-3.5 h-3.5 text-amber-500" />
            Live Bus Telemetry ({busRoutesData.length})
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'finance'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            Financial Collection
          </button>
          <button
            onClick={() => setActiveTab('lunch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lunch'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-orange-500" />
            Cafeteria & Lunch
          </button>
        </div>
      </div>

      {/* Tab 1: Transport Bus Fleet Telemetry */}
      {activeTab === 'transport' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bus List */}
          <div className="space-y-3 lg:col-span-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Bus Fleet Routes (18 Total)
            </p>
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {busRoutesData.map((bus) => {
                const isSelected = selectedBus.id === bus.id;
                return (
                  <div
                    key={bus.id}
                    onClick={() => setSelectedBus(bus)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {bus.busNumber} • {bus.routeName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          bus.status === 'On-Time'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {bus.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                      <span>Driver: {bus.driverName}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {bus.studentsCount}/{bus.capacity} Students
                      </span>
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-1.5">
                      <span>ETA: {bus.eta}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {bus.speedKmH} km/h
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Bus Telemetry & Stops Timeline */}
          <div className="lg:col-span-2 space-y-4 bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Live Route Monitor
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedBus.routeName} ({selectedBus.busNumber})
                </h3>
              </div>

              {onOpenBusMapModal && (
                <button
                  onClick={() => onOpenBusMapModal(selectedBus)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" /> Fullscreen Map View
                </button>
              )}
            </div>

            {/* Telemetry Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-400 text-[10px]">Driver Contact</span>
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-emerald-500" />
                  {selectedBus.driverPhone}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-400 text-[10px]">Current Speed</span>
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedBus.speedKmH} km/h
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-400 text-[10px]">Bus Capacity</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedBus.studentsCount} / {selectedBus.capacity} Onboard
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-400 text-[10px]">Expected Arrival</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedBus.eta}
                </p>
              </div>
            </div>

            {/* Route Stops Timeline */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Route Stops Sequence
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {selectedBus.stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs ${
                      stop.passed
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate">{stop.name}</span>
                      {stop.passed && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5 block">{stop.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Financial Collection & Budget Breakdown */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Term 1 Fee Collection Progress
              </h3>
              <span className="text-xs font-extrabold text-emerald-600">92.9% Collected</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Total Collected: $1,245,000</span>
                <span>Target: $1,340,000</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full w-[92.9%]" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Outstanding balance ($95,000) pertains to 14 installment agreements due by Aug 15.
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Departmental Budget Allocations
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="font-semibold text-slate-800 dark:text-slate-200">STEM & Robotics</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">$180,000 (84% spent)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Athletics & Sports</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">$120,000 (72% spent)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Arts & Performing Music</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">$95,000 (68% spent)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cafeteria & Today's Lunch Menu */}
      {activeTab === 'lunch' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-orange-50/50 dark:bg-orange-950/20 p-3 rounded-xl border border-orange-200/60 dark:border-orange-900/30">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-xs text-orange-900 dark:text-orange-200">
                Today's Fresh Lunch Menu & Nutrition Log
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              1,620 Meals Served Today
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {todayLunchMenu.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {item.category}
                </span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                  {item.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {item.calories} kcal • Served: {item.servedCount}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.allergens.map((alg, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    >
                      {alg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
