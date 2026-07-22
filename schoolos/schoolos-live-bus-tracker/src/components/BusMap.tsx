import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SchoolBus } from '../types';

interface BusMapProps {
  bus: SchoolBus;
  isGpsOffline: boolean;
  onSelectStop?: (stopName: string) => void;
}

export const BusMap: React.FC<BusMapProps> = ({ bus, isGpsOffline, onSelectStop }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const polylineRemainingRef = useRef<L.Polyline | null>(null);
  const polylinePassedRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map if not already done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [bus.currentLat, bus.currentLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers/layers when rerendering
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    if (isGpsOffline) {
      // Map view stays on last known location or route center
      map.setView([bus.currentLat, bus.currentLng], 13);
      return;
    }

    // --- 1. ROUTE POLYLINES ---
    const allCoords = bus.routeCoordinates;
    
    // Find closest index of current bus position along route
    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;
    allCoords.forEach((coord, idx) => {
      const dist = Math.hypot(coord[0] - bus.currentLat, coord[1] - bus.currentLng);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    const passedCoords = [...allCoords.slice(0, closestIndex + 1), [bus.currentLat, bus.currentLng] as [number, number]];
    const remainingCoords = [[bus.currentLat, bus.currentLng] as [number, number], ...allCoords.slice(closestIndex + 1)];

    // Passed polyline (dimmed gray line)
    polylinePassedRef.current = L.polyline(passedCoords, {
      color: '#475569',
      weight: 4,
      opacity: 0.6,
      dashArray: '6, 8',
    }).addTo(map);

    // Remaining polyline (glowing blue/cyan route line)
    polylineRemainingRef.current = L.polyline(remainingCoords, {
      color: '#38BDF8',
      weight: 5,
      opacity: 0.9,
    }).addTo(map);

    // --- 2. SCHOOL MARKER ---
    const schoolIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="flex items-center gap-2 group cursor-pointer">
          <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/90 border border-blue-400/50 shadow-lg shadow-blue-500/30 text-white backdrop-blur-md">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-blue-500/30 text-blue-300 font-semibold text-xs shadow-md whitespace-nowrap">
            🏫 ${bus.schoolLocation.name}
          </div>
        </div>
      `,
      iconSize: [160, 40],
      iconAnchor: [20, 20],
    });

    const schoolMarker = L.marker([bus.schoolLocation.lat, bus.schoolLocation.lng], { icon: schoolIcon }).addTo(map);
    schoolMarker.bindPopup(`
      <div class="p-2 text-slate-100 font-sans">
        <div class="font-bold text-sm text-blue-400">🏫 ${bus.schoolLocation.name}</div>
        <div class="text-xs text-slate-300 mt-1">${bus.schoolLocation.address}</div>
        <div class="text-[11px] text-slate-400 mt-1">Final Destination • Drop-off ~ 9:00 AM</div>
      </div>
    `);

    // --- 3. STUDENT HOME MARKER ---
    const homeIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="flex items-center gap-2 group cursor-pointer">
          <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/90 border border-emerald-300/60 shadow-lg shadow-emerald-500/30 text-slate-950 font-bold backdrop-blur-md">
            <svg class="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div class="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-md whitespace-nowrap">
            🏠 Your Home Stop
          </div>
        </div>
      `,
      iconSize: [150, 40],
      iconAnchor: [20, 20],
    });

    const homeMarker = L.marker([bus.homeLocation.lat, bus.homeLocation.lng], { icon: homeIcon }).addTo(map);
    homeMarker.bindPopup(`
      <div class="p-2 text-slate-100 font-sans">
        <div class="font-bold text-sm text-emerald-400">🏠 ${bus.homeLocation.name}</div>
        <div class="text-xs text-slate-200 mt-0.5">Assigned for: <span class="font-semibold text-emerald-300">${bus.homeLocation.studentName}</span></div>
        <div class="text-[11px] text-slate-400 mt-1">Scheduled Pickup: <span class="text-white font-medium">${bus.estimatedArrival}</span></div>
      </div>
    `);

    // --- 4. ROUTE STOPS MARKERS ---
    bus.stops.forEach((stop) => {
      const isNextStop = stop.name === bus.nextStopName;
      if (stop.name === bus.schoolLocation.name || stop.name.includes('Your Home')) return;

      const stopIcon = L.divIcon({
        className: 'custom-map-icon',
        html: isNextStop
          ? `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full bg-amber-500/30 animate-ping"></div>
              <div class="w-5 h-5 rounded-full bg-amber-500 border-2 border-slate-900 shadow-md shadow-amber-500/50 flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
              </div>
            </div>
          `
          : `
            <div class="w-3.5 h-3.5 rounded-full ${stop.isPassed ? 'bg-slate-600' : 'bg-slate-400'} border-2 border-slate-900 shadow-sm"></div>
          `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const stopMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon }).addTo(map);
      stopMarker.bindPopup(`
        <div class="p-1.5 text-slate-100 font-sans">
          <div class="font-semibold text-xs ${isNextStop ? 'text-amber-400 font-bold' : 'text-slate-200'}">
            ${isNextStop ? '🛑 NEXT STOP: ' : '📍 Stop: '}${stop.name}
          </div>
          <div class="text-[11px] text-slate-400 mt-0.5">ETA: ${stop.scheduledTime}</div>
        </div>
      `);
      if (onSelectStop) {
        stopMarker.on('click', () => onSelectStop(stop.name));
      }
    });

    // --- 5. CURRENT BUS MARKER ---
    const busIcon = L.divIcon({
      className: 'bus-marker-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="pulsing-ring"></div>
          <div class="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/40 border-2 border-slate-950 transform hover:scale-110 transition-transform">
            <span class="text-2xl leading-none" role="img" aria-label="School Bus">🚌</span>
            <div class="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-slate-950 border border-amber-400/60 text-amber-300 font-extrabold text-[10px] tracking-wider">
              ${bus.busNumber.replace('Bus ', '#')}
            </div>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    busMarkerRef.current = L.marker([bus.currentLat, bus.currentLng], { icon: busIcon }).addTo(map);
    busMarkerRef.current.bindPopup(`
      <div class="p-2 text-slate-100 font-sans">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
            ${bus.busNumber}
          </span>
          <span class="text-xs text-slate-300 font-medium">${bus.driverName}</span>
        </div>
        <div class="text-xs text-slate-300 mt-2 flex items-center justify-between gap-4">
          <span>Speed: <strong class="text-white">${bus.currentSpeedKmH} km/h</strong></span>
          <span>Next: <strong class="text-amber-400">${bus.nextStopName}</strong></span>
        </div>
      </div>
    `);

    // Fit map bounds to encompass bus, home, and school
    const bounds = L.latLngBounds([
      [bus.currentLat, bus.currentLng],
      [bus.homeLocation.lat, bus.homeLocation.lng],
      [bus.schoolLocation.lat, bus.schoolLocation.lng],
    ]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });

  }, [bus, isGpsOffline]);

  return (
    <div className="relative w-full h-full min-h-[260px] md:min-h-[310px] rounded-xl overflow-hidden border border-slate-800/80 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* GPS Offline Overlay */}
      {isGpsOffline && (
        <div className="absolute inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 animate-pulse">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m10.607 2.121a6 6 0 010 8.485m-8.485 0a6 6 0 010-8.485m4.243 2.122a2 2 0 100 2.828" />
            </svg>
          </div>
          <div className="text-rose-400 font-bold text-base md:text-lg flex items-center gap-2">
            <span>🔴</span> Bus location unavailable.
          </div>
          <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
            GPS signal from <strong class="text-slate-300">{bus.busNumber}</strong> was temporarily disconnected. Displaying last cached location.
          </p>
          <div className="mt-3 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            Last ping received: {bus.lastGpsUpdate}
          </div>
        </div>
      )}

      {/* Map floating overlay controls */}
      {!isGpsOffline && (
        <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE GPS
          </div>
        </div>
      )}
    </div>
  );
};
