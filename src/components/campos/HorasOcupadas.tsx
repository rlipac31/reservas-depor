'use client'
import { Clock, CalendarDays } from 'lucide-react';

interface Booking {
  _id: string;
  startTime: string;
  endTime: string;
}

interface HorasOcupadasProps {
  bookings: Booking[];
  selectedDate: string;
}

export default function HorasOcupadas({ bookings, selectedDate }: HorasOcupadasProps) {
  
  // Usamos la misma lógica de formateo que tu FieldCard2
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Como tu API ya filtra por "hoy" y ordena, solo verificamos que haya datos
  // Si en el futuro permites elegir otras fechas, este filtro asegura consistencia
  const filteredBookings = (bookings || []).filter(b => 
    b.startTime.startsWith(selectedDate)
  );

  if (!selectedDate) return null;

  return (
    <div className=" bg-brand-black rounded-xl border border-brand-gold/20 shadow-2xl overflow-hidden  mb-6 animate-in fade-in duration-500">
      <div className="p-4 border-2 ">
        {/* Encabezado con estética de FieldCard */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-gold/10">
          <CalendarDays size={16} className="text-brand-gold" />
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.15em]">
            Horarios Ocupados <span className="text-brand-gold">({selectedDate})</span>
          </h3>
        </div>
        
        <div className="flex justify-between flex-wrap gap-1  ">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <div 
                key={booking._id || index}
                className="flex items-center gap-2 bg-white/5 border border-brand-gold/30 px-3 py-2 rounded-lg group hover:border-brand-gold/60 transition-colors"
              >
                <Clock size={14} className="hidden md:inline-block text-brand-gold/70" />
                <div className="flex items-center gap-1 text-[7px] md:text-[9px] lg:text-[11px] font-bold text-brand-gold">
                  <span className="text-gray-500 text-[6px] lg:text-[9px] uppercase tracking-tighter p-0">Inicio</span>
                  <span>{formatTime(booking.startTime)}</span>
                  <span className="text-white/20 mx-1">-</span>
                  <span className="text-gray-500 text-[6px] lg:text-[9px] uppercase tracking-tighter">Fin</span>
                  <span>{formatTime(booking.endTime)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-6 text-center border-2 border-dashed border-white/5 rounded-xl">
              <p className="text-[11px] text-gray-500 font-bold uppercase italic tracking-widest">
                No hay reservas registradas para hoy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}