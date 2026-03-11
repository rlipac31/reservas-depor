"use client";

import { useState } from 'react';
import { 
  Clock, MapPin, User, Calendar, 
  Trash2, Edit2, Loader2, AlertTriangle, X, CheckCircle, Smartphone 
} from 'lucide-react';
import dayjs from '@/lib/dayjs/dayjs';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
//import { cancelBookingAction } from '@/actions/booking';

export default function BookingCard({ booking }: { booking: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mapeo de estados con estética Pukllay (Negro y Naranja)
  const stateStyles: any = {
    CONFIRMED: 'bg-brand-primary text-brand-accent border-brand-accent/20',
    PENDING: 'bg-brand-accent text-brand-primary border-brand-primary/10',
    CANCELLED: 'bg-red-500 text-white border-red-200',
    COMPLETED: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const stateLabels: any = {
    CONFIRMED: '● Confirmada',
    PENDING: '○ Pendiente',
    CANCELLED: '✕ Cancelada',
    COMPLETED: '✓ Finalizada',
  };

  // const handleCancel = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await cancelBookingAction(booking.id);
  //     if (res.success) {
  //       setShowCancelModal(false);
  //       router.refresh();
  //     } else {
  //       alert(res.error);
  //     }
  //   } catch (error) {
  //     alert("Error al cancelar");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

 const { user} = useUser();
//console.table(booking)

  return (
    <>
      <div className="w-[90vw] md:w-[16rem] lg:w-[18rem] group bg-white rounded-[0.7rem] border border-brand-primary/5 shadow-sm hover:shadow-xl hover:border-brand-accent/30 transition-all duration-300 overflow-hidden flex flex-col h-full ">
        
        {/* Header de Estado */}
        <div className={`text-[10px]  font-black py-3 px-6 border-b uppercase tracking-[0.2em] transition-colors ${stateStyles[booking.status]} `}>
          {stateLabels[booking.status] || booking.status}
        </div>

        <div className="p-6 flex-1 space-y-4">
          {/* Info Cancha */}
          <div className="flex justify-between items-start">
            <div className="max-w-[70%]">
              <h3 className="font-black italic text-brand-primary text-[18px] md:text-[14px] lg:text-[16px] uppercase tracking-tighter leading-none group-hover:text-brand-accent transition-colors">
                {booking.fields?.name || "Cancha"}
              </h3>
              <p className="flex items-center gap-1 text-brand-primary/40 text-[10px] font-bold uppercase mt-1">
                <MapPin size={10} /> {booking.field?.location || "Sede Principal"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[14px] font-black text-brand-primary italic">
                S/ {Number(booking.total_price).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Fecha y Hora (snake_case) */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed border-brand-primary/10">
            <div className="space-y-1">
              <span className="text-[9px] text-brand-primary/30 font-black uppercase flex items-center gap-1">
                <Calendar size={10} className="text-brand-accent" /> Fecha
              </span>
              <p className="text-xs font-bold text-brand-primary/80">
                {dayjs(booking.start_time).format('DD MMM, YYYY')}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[9px] text-brand-primary/30 font-black uppercase flex items-center gap-1 justify-end">
                <Clock size={10} className="text-brand-accent" /> Horario
              </span>
              <p className="text-xs font-bold text-brand-primary/80">
                {dayjs(booking.start_time).format('HH:mm')} - {dayjs(booking.end_time).format('HH:mm')}
              </p>
            </div>
          </div>

          {/* Cliente Info (snake_case) */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-secondary/30 flex items-center justify-center text-brand-primary">
                <User size={14} />
              </div>
              <div>
                <p className="text-[10px] font-black text-brand-primary uppercase leading-none">
                  {booking.manual_customer_name || "Consumidor Final"}
                </p>
                <p className="text-[9px] font-bold text-brand-primary/40 mt-1">
                  DNI: {booking.manual_customer_dni || "---"}
                </p>
              </div>
            </div>
            {booking.manual_customer_phone && (
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-brand-secondary/30 flex items-center justify-center text-brand-primary">
                   <Smartphone size={14} />
                 </div>
                 <p className="text-[10px] font-bold text-brand-primary/60 italic">
                   {booking.manual_customer_phone}
                 </p>
               </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="p-4 bg-brand-secondary/10 flex gap-2 ">
          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
            <>
              {/* <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 py-3 rounded-xl border-2 border-transparent hover:bg-brand-primary hover:text-red-500 text-brand-primary/30 font-black text-[10px] uppercase transition-all"
              >
                <Trash2 size={20} className="mx-auto" />
              </button> */}
              <button
                onClick={() => router.push(`/dashboard/reservas/${booking.id}`)}
                className="flex-[3] bg-brand-primary text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-accent hover:text-brand-primary transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Edit2 size={12} /> Gestionar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de Cancelación (Simplificado) */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-brand-primary/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-sm w-full p-8 text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase text-brand-primary tracking-tighter">¿Anular Reserva?</h3>
              <p className="text-xs font-medium text-brand-primary/50 mt-2">Esta acción liberará la cancha inmediatamente.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button onClick={() => setShowCancelModal(false)} className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-primary/40 border border-brand-primary/5">Cerrar</button>
              <button 
               // onClick={handleCancel} 
                disabled={loading}
                className="py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Sí, Anular"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}