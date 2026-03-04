import { Clock, Calendar} from 'lucide-react';

interface OccupiedListProps {
    bookings: any[];
    selectedDate: string;
}

export default function OccupiedList({ bookings, selectedDate }: OccupiedListProps) {
    if (!selectedDate) return null;
    //funcion axiliar para formatear efechas y hora

      const formatTime = (dateString: string) => {
         return new Date(dateString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
        });
  };

    // 1. Filtramos las reservas que coinciden con el día elegido
    const dayBookings = (bookings || []).filter((b: any) => 
        b.startTime.startsWith(selectedDate)
    );

    if (dayBookings.length === 0) {
        return (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
                <p className="text-[10px] text-green-700 font-bold text-center uppercase">
                    ✅ Todo libre para esta fecha
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-brand-gray mb-6">
            <h4 className="text-[10px] font-black uppercase text-gray-500 mb-3 flex items-center gap-2">
                <Calendar size={12} className="text-brand-gold" /> Horarios Ocupados Hoy
            </h4>
            
            <div className="grid grid-cols-1 gap-2">
                {dayBookings.map((b: any, index: number) => {
                    // Extraemos la hora de inicio del string ISO
                    const startRaw = b.startTime.split('T')[1].substring(0, 5);
                    
                    // Calculamos el fin sumando la duración
                    const [h, m] = startRaw.split(':').map(Number);
                    const endDate = new Date();
                    endDate.setHours(h, m + (b.durationInMinutes || 60));
                    const endRaw = endDate.toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });

                    return (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Clock size={14} className="text-gray-400" />
                                <div className="flex gap-2 text-[11px] font-bold">
                                    <span className="text-gray-500 uppercase">Inicio</span>
                                    <span className="text-brand-black">{startRaw}</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500 uppercase">Fin</span>
                                    <span className="text-brand-black">{endRaw}</span>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
// {formatTime(booking.startTime)} 