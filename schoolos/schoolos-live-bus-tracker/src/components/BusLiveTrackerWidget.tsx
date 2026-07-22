import React, { useState, useEffect, useCallback } from 'react';
import { SchoolBus, BusStatus } from '../types';
import { BusMap } from './BusMap';
import { DriverCallModal } from './DriverCallModal';

interface BusLiveTrackerWidgetProps {
  initialBusData: SchoolBus;
}

export const BusLiveTrackerWidget: React.FC<BusLiveTrackerWidgetProps> = ({ initialBusData }) => {
  const [bus, setBus] = useState<SchoolBus>(initialBusData);
  const [isGpsOffline, setIsGpsOffline] = useState<boolean>(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(20); // 20s refresh cycle (15-30s range)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);
  const [selectedStopInfo, setSelectedStopInfo] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Auto-refresh timer logic (Refreshes every 20s)
  useEffect(() => {
    if (isGpsOffline) return;

    const interval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          handleManualRefresh();
          return 20; // reset to 20 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGpsOffline]);

  // Simulate subtle real-time bus movement along route during auto-refresh
  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);

    setTimeout(() => {
      setBus((prev) => {
        if (isGpsOffline) return prev;

        // Move bus slightly forward along route
        const currentCoords = prev.routeCoordinates;
        let newLat = prev.currentLat;
        let newLng = prev.currentLng;
        let newSpeed = Math.floor(28 + Math.random() * 12); // Speed variance 28-40 km/h
        let newDistance = Math.max(0.4, Number((prev.distanceRemainingKm - 0.1).toFixed(1)));

        // Advance waypoint if possible
        const pointIdx = currentCoords.findIndex(
          (c) => Math.abs(c[0] - prev.currentLat) < 0.001 && Math.abs(c[1] - prev.currentLng) < 0.001
        );

        if (pointIdx >= 0 && pointIdx < currentCoords.length - 1) {
          const nextPoint = currentCoords[pointIdx + 1];
          newLat = Number((prev.currentLat * 0.7 + nextPoint[0] * 0.3).toFixed(5));
          newLng = Number((prev.currentLng * 0.7 + nextPoint[1] * 0.3).toFixed(5));
        }

        return {
          ...prev,
          currentLat: newLat,
          currentLng: newLng,
          currentSpeedKmH: newSpeed,
          distanceRemainingKm: newDistance,
          lastGpsUpdate: 'Just now',
        };
      });

      setIsRefreshing(false);
      setRefreshCountdown(20);

      // Trigger temporary subtle refresh toast
      setNotificationToast('⚡ GPS location synchronized');
      setTimeout(() => setNotificationToast(null), 3000);
    }, 600);
  }, [isGpsOffline]);

  // Toggle GPS Offline simulation
  const toggleGpsStatus = () => {
    setIsGpsOffline((prev) => !prev);
    if (!isGpsOffline) {
      setNotificationToast('🔴 GPS connection lost');
    } else {
      setNotificationToast('🟢 GPS reconnected - Bus on route');
    }
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // Helper for status badge rendering
  const renderStatusBadge = (status: BusStatus, offline: boolean) => {
    if (offline) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs glow-rose">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>🔴 Bus location unavailable</span>
        </div>
      );
    }

    switch (status) {
      case 'ON_ROUTE':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs glow-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🟢 On Route</span>
          </div>
        );
      case 'STOPPED_AT_STOP':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs glow-amber">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>🟡 Stopped at Stop</span>
          </div>
        );
      case 'ARRIVED_AT_SCHOOL':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold text-xs glow-blue">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>🔵 Arrived at School</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full rounded-2xl glass-card p-5 md:p-6 border border-slate-800 shadow-2xl transition-all duration-300">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[2000] px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-slate-700 text-xs font-semibold text-slate-100 shadow-xl backdrop-blur-md animate-bounce">
          {notificationToast}
        </div>
      )}

      {/* --- WIDGET TOP BAR HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="School Bus">🚌</span> My School Bus
            </h2>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono font-semibold text-xs">
              SchoolOS Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Student & Parent Real-Time Location View</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">Assigned Route #4</span>
          </p>
        </div>

        {/* Status Badge & Simulation Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {renderStatusBadge(bus.status, isGpsOffline)}

          {/* Test GPS Simulator Button */}
          <button
            onClick={toggleGpsStatus}
            title="Toggle GPS Offline state for testing"
            className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span>{isGpsOffline ? 'Re-connect GPS' : 'Simulate Offline'}</span>
          </button>
        </div>
      </div>

      {/* --- BUS INFO ROW (Bus Number, Driver, Current Status Summary) --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4">
        {/* Bus Number */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8m-8 4h8m-8 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Bus Number</div>
            <div className="text-base font-extrabold text-white tracking-wide">{bus.busNumber}</div>
          </div>
        </div>

        {/* Driver */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
          <img
            src={bus.driverPhoto}
            alt={bus.driverName}
            className="w-10 h-10 rounded-xl object-cover border border-amber-400/40 shrink-0"
          />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Driver</div>
            <div className="text-base font-extrabold text-white truncate">{bus.driverName}</div>
          </div>
        </div>

        {/* Current Status */}
        <div className="col-span-2 md:col-span-1 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Current Status</div>
            <div className="text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              {isGpsOffline ? (
                <span className="text-rose-400">🔴 Offline</span>
              ) : (
                <span className="text-emerald-400">🟢 On Route</span>
              )}
            </div>
          </div>

          {/* Refresh Countdown indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing || isGpsOffline}
              title="Manual Refresh GPS"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 disabled:opacity-40 transition-all active:scale-95 border border-slate-700"
            >
              <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="text-[10px] text-slate-400 font-mono text-right hidden sm:block">
              Auto in <span className="text-slate-200 font-bold">{refreshCountdown}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- LIVE LOCATION MAP CONTAINER --- */}
      <div className="relative my-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Live Location Map</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Bus
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Home Stop
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> School
            </span>
          </div>
        </div>

        {/* Map View */}
        <div className="w-full h-[300px] md:h-[360px]">
          <BusMap
            bus={bus}
            isGpsOffline={isGpsOffline}
            onSelectStop={(stopName) => setSelectedStopInfo(stopName)}
          />
        </div>
      </div>

      {/* --- METRICS BELOW THE MAP (Speed, ETA, Distance, Next Stop, Students Onboard, Driver Contact) --- */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Current Speed */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Current Speed</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {isGpsOffline ? '--' : `${bus.currentSpeedKmH} km/h`}
          </div>
        </div>

        {/* Estimated Arrival */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Est. Arrival</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {bus.estimatedArrival}
          </div>
        </div>

        {/* Distance Remaining */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>Distance Left</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {bus.distanceRemainingKm} km
          </div>
        </div>

        {/* Next Stop */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
            <span>Next Stop</span>
          </div>
          <div className="text-base font-extrabold text-amber-300 mt-1 truncate" title={bus.nextStopName}>
            {bus.nextStopName}
          </div>
        </div>

        {/* Students Onboard */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Onboard</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1 flex items-baseline gap-1">
            <span>{bus.studentsOnboard}</span>
            <span className="text-xs text-slate-500 font-normal">/ {bus.totalCapacity}</span>
          </div>
        </div>

        {/* Driver Contact Button */}
        <div className="col-span-2 sm:col-span-1 p-1">
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="w-full h-full min-h-[64px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.02] active:scale-95 border border-emerald-400/30 cursor-pointer"
          >
            <span className="text-lg">📞</span>
            <span>Call Driver</span>
          </button>
        </div>
      </div>

      {/* --- ROUTE PROGRESS TIMELINE MINI BAR --- */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span className="uppercase tracking-wider">Route Progress & Stop Sequence</span>
          <span className="text-slate-500">View-Only Student Schedule</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {bus.stops.map((stop) => {
            const isNext = stop.name === bus.nextStopName;
            const isHome = stop.name.includes('Your Home');
            const isSchool = stop.name.includes('High School');

            return (
              <div
                key={stop.id}
                onClick={() => setSelectedStopInfo(stop.name)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isNext
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-md shadow-amber-500/10'
                    : stop.isPassed
                    ? 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                    : isHome
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : isSchool
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-200'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>{stop.scheduledTime}</span>
                  {stop.isPassed && <span className="text-slate-500">✓ Passed</span>}
                  {isNext && <span className="text-amber-400 font-bold animate-pulse">NEXT</span>}
                </div>
                <div className="text-xs font-bold truncate mt-1">
                  {isHome ? '🏠 ' + stop.name.replace(' (Your Home)', '') : isSchool ? '🏫 School' : stop.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Call Modal */}
      <DriverCallModal
        bus={bus}
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </div>
  );
};
