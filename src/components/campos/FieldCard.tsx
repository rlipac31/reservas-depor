'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Clock, CalendarDays } from 'lucide-react';
import { getFieldIdReservations } from '@/actions/fields';
import dayjs, { TIMEZONE } from '@/lib/dayjs/dayjs';

export default function FieldCard({ field,  }: { field: any }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmSlot, setConfirmSlot] = useState<any>(null);

  const todayStr = dayjs().format('YYYY-MM-DD');
  const maxDateStr = dayjs().add(15, 'day').format('YYYY-MM-DD');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const res = await getFieldIdReservations(field.id, selectedDate);
      if (res.status === "success") setBookings(res.data);
      setIsLoading(false);
    };
    load();
  }, [selectedDate, field.id]);

  const getSlots = () => {
    const slots = [];
    const now = dayjs().tz(TIMEZONE);
    const isToday = selectedDate === todayStr;

    for (let h = 8; h <= 24; h++) {
      const label = `${h.toString().padStart(2, '0')}:00`;
      const isPast = isToday && h <= now.hour();
      const isOccupied = bookings.some(b => dayjs(b.start_time).tz(TIMEZONE).hour() === h);

      slots.push({
        hour: h,
        label,
        state: isOccupied ? 'OCCUPIED' : (isPast ? 'PAST' : 'FREE')
      });
    }
    return slots;
  };

  return (
    <div className="w-[92vw]  lg:w-[28rem] bg-white rounded-[2.5rem] border lg:border-brand-primary/5 shadow-xl overflow-hidden flex flex-col h-full group transition-all hover:shadow-2xl">
      <div className="p-8 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black text-brand-primary uppercase italic tracking-tighter group-hover:text-brand-accent transition-colors">
            {field.name}
          </h3>
          <span className="bg-brand-accent/10 text-brand-accent text-[10px] font-black px-3 py-1 rounded-full">
            S/ {Number(field.price_per_hour).toFixed(2)} / hr
          </span>
        </div>

        {/* Info Rapida */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary/40">
            <Users size={14} className="text-brand-accent" /> {field.capacity} Pers.
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary/40">
            <MapPin size={14} className="text-brand-accent" /> {field.location || 'Sede Principal'}
          </div>
        </div>

        {/* Date Picker Local */}
        <div className="flex items-center justify-between mb-4 bg-brand-secondary/30 p-3 rounded-2xl">
          <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest flex items-center gap-2">
            <CalendarDays size={14} /> Agenda
          </span>
          <input 
            type="date" 
            min={todayStr} 
            max={maxDateStr}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-black text-brand-primary outline-none cursor-pointer"
          />
        </div>

        {/* Grid de Horarios */}
        <div className="grid grid-cols-4 gap-2">
          {isLoading ? (
             [...Array(12)].map((_, i) => <div key={i} className="h-9 bg-gray-100 animate-pulse rounded-xl" />)
          ) : (
            getSlots().map((slot) => (
              <button
                key={slot.label}
                disabled={slot.state !== 'FREE'}
                onClick={() => setConfirmSlot(slot)}
                className={`py-2 rounded-xl text-[10px] font-black transition-all border text-center 
                  ${slot.state === 'FREE' ? 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent hover:bg-brand-accent hover:text-white' : 
                    slot.state === 'OCCUPIED' ? 'bg-brand-primary text-white border-transparent' : 
                    'bg-gray-50 text-gray-300 border-transparent opacity-50 cursor-not-allowed'}`}
              >
                {slot.label}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Modal de Confirmación Estilo Pukllay */}
      {confirmSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl scale-in-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-brand-accent" size={32} />
              </div>
              <h4 className="text-2xl font-black text-brand-primary italic uppercase tracking-tighter">¿Reservar ahora?</h4>
              <p className="text-brand-primary/50 font-medium mb-6 mt-2">Cancha: {field.name} <br/> {dayjs(selectedDate).format('DD MMMM')} • {confirmSlot.label}</p>
              
              <div className="flex flex-col gap-3">
                <button 
                 onClick={() => {
                      const hourParam = confirmSlot.hour.toString().padStart(2, '0') + ':00';
                      // Eliminamos ${user?.slug} y nos aseguramos de que empiece con /dashboard
                      const url = `/dashboard/reservas/save?fieldId=${field.id}&name=${field.name}&date=${selectedDate}&time=${hourParam}`;
                      
                      console.log("Navegando a:", url); // Para verificar en consola
                      router.push(url);
                  }}
                  className="bg-brand-accent text-brand-primary font-black py-4 rounded-2xl uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Confirmar e Ir al Pago
                </button>
                <button onClick={() => setConfirmSlot(null)} className="text-brand-primary/40 font-bold text-sm">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}