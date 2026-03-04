"use client";
import { Clock } from "lucide-react";

interface TimeGridProps {
  selectedDate: string;
  currentStartTime: string;
  onSelectTime: (isoString: string) => void;
  busySlots: string[]; // Array de horas ocupadas que viene del back: ["17:00", "18:00"]
}

export function TimeGrid({ selectedDate, currentStartTime, onSelectTime, busySlots }: TimeGridProps) {
  // Generamos horas desde las 08:00 hasta las 22:00
  const hours = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
      {hours.map((hour) => {
        const fullISO = new Date(`${selectedDate}T${hour.padStart(5, '0')}:00`).toISOString();
        const isBusy = busySlots.includes(hour);
        const isSelected = currentStartTime === fullISO;

        return (
          <button
            key={hour}
            type="button"
            disabled={isBusy && !isSelected}
            onClick={() => onSelectTime(fullISO)}
            className={`py-3 rounded-xl text-xs font-black transition-all border-2 
              ${isSelected 
                ? 'bg-brand-gold border-brand-gold text-brand-black scale-105 shadow-lg' 
                : isBusy 
                  ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed opacity-50' 
                  : 'bg-white border-brand-gray text-brand-black hover:border-brand-gold'
              }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Clock size={12} />
              {hour}
            </div>
          </button>
        );
      })}
    </div>
  );
}