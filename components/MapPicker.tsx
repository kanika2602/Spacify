
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, LocateFixed, Users } from 'lucide-react';
import translations from '../translations';
import { Language } from '../types';

interface MapPickerProps {
  lang: Language;
  onSelect: (lat: number, lng: number, address: string) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ lang, onSelect }) => {
  const t = translations[lang];
  const [pinned, setPinned] = useState<{ x: number, y: number } | null>(null);
  const [nearbyCount, setNearbyCount] = useState(0);

  useEffect(() => {
    if (pinned) {
      // Simulate intellectual nearby count logic
      setNearbyCount(Math.floor(Math.random() * 45) + 5);
    }
  }, [pinned]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinned({ x, y });
    onSelect(y, x, `Location ${Math.round(x)}, ${Math.round(y)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{t.mapHint}</label>
        {pinned && (
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 dark:text-indigo-400 animate-in fade-in zoom-in">
            <Users size={12} /> {nearbyCount} Exporters active nearby
          </div>
        )}
      </div>
      
      <div 
        className="h-72 bg-slate-100 dark:bg-slate-800 rounded-[32px] border-4 border-white dark:border-slate-700 shadow-inner relative overflow-hidden cursor-crosshair group transition-colors"
        onClick={handleMapClick}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none dark:opacity-10">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-slate-300 dark:border-slate-600"></div>
            ))}
          </div>
        </div>

        {pinned && (
          <div 
            className="absolute transition-all duration-300 animate-bounce"
            style={{ left: `${pinned.x}%`, top: `${pinned.y}%`, transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-red-500 p-2 rounded-full shadow-2xl text-white">
              <MapPin size={24} />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-500 rounded-full animate-ping opacity-25"></div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
           <div className="flex-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 dark:border-slate-700 shadow-lg flex items-center gap-3">
              <Navigation className="text-indigo-600 dark:text-indigo-400" size={20} />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {pinned ? `Validated Hub Point: ${Math.round(pinned.x)}°N, ${Math.round(pinned.y)}°E` : 'Select Cargo Pick-up Point'}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
