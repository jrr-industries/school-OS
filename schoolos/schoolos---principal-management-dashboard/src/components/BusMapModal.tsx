import React, { useEffect, useRef } from 'react';
import { BusRoute } from '../types';
import { X, Bus, MapPin, Phone, ShieldCheck, Clock } from 'lucide-react';
import L from 'leaflet';

interface BusMapModalProps {
  bus: BusRoute | null;
  onClose: () => void;
}

export const BusMapModal: React.FC<BusMapModalProps> = ({ bus, onClose }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!bus || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map around bus coordinates
    const map = L.map(mapContainerRef.current, {
      center: [bus.currentLat, bus.currentLng],
      zoom: 14,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom Bus Marker
    const busIcon = L.divIcon({
      className: 'custom-bus-icon',
      html: `<div style="background-color: #10b981; color: white; padding: 6px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
        🚌 ${bus.busNumber}
      </div>`,
      iconSize: [80, 30],
      iconAnchor: [40, 15],
    });

    L.marker([bus.currentLat, bus.currentLng], { icon: busIcon })
      .addTo(map)
      .bindPopup(`<b>${bus.routeName}</b><br>Speed: ${bus.speedKmH} km/h<br>Driver: ${bus.driverName}`)
      .openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [bus]);

  if (!bus) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 relative overflow-hidden flex flex-col h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Live Transport Telemetry
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {bus.routeName} ({bus.busNumber})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs shrink-0">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 text-[10px]">Driver</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{bus.driverName}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{bus.driverPhone}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 text-[10px]">Speed & Status</span>
            <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {bus.speedKmH} km/h • {bus.status}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 text-[10px]">Students Onboard</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {bus.studentsCount} / {bus.capacity}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 text-[10px]">ETA Campus</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{bus.eta}</p>
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>
      </div>
    </div>
  );
};
