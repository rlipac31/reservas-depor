'use client';

import { useState } from 'react';
import {
    CheckCircle, Smartphone, Banknote, CreditCard,
    Loader2, Trash2, Info, ReceiptText, User, BanknoteArrowUp,
    InfoIcon
} from 'lucide-react';
import { confirmPaymentAction, cancelPaymentAction  } from '@/actions/payments';
import dayjs from '@/lib/dayjs/dayjs';
import Link from 'next/link';

import { dataPaymentType } from '@/types/payment';

// Estilos de Badge para el estado (SQL: status)
const statusStyles: any = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

// Estilos de Badge para el método (SQL: payment_method)
const methodStyles: any = {
    MOVIL: "bg-purple-50 text-purple-600 border-purple-200",
    CASH: "bg-emerald-50 text-emerald-600 border-emerald-200",
    CARD_CREDIT: "bg-blue-50 text-blue-600 border-blue-200",
    CARD_DEBIT: "bg-blue-50 text-amber-600 border-amber-700",
    TRANFER: "bg-sky-50 text-sky-600 border-sky-200",
};

export function  PagosTable({ datos }: { datos: dataPaymentType[] }) {
    const [loading, setLoading] = useState(false);
    const [pagoSeleccionado, setPagoSeleccionado] = useState<any | null>(null);
    const [tipoAccion, setTipoAccion] = useState<'CONFIRMAR' | 'CANCELAR' | null>(null);

    const handleProcessAction = async () => {
        if (!pagoSeleccionado || !tipoAccion) return;

        setLoading(true);
        const res = tipoAccion === 'CONFIRMAR'
            ? await confirmPaymentAction(pagoSeleccionado.id)
            : await cancelPaymentAction(pagoSeleccionado.id);

        if (res.success) {
            setPagoSeleccionado(null);
            setTipoAccion(null);
        } else {
            alert(res.error || "Error al procesar el pago");
        }
        setLoading(false);
    };

    const isTooLateToCancel = (paymentDate: string) => {
  const now = dayjs();
  const start = dayjs(paymentDate);
  return start.diff(now, 'hour', true) < 2;
};
//console.log("Datos recibidos en PagosTable:", datos);

    return (
        <div className="">
            {/* --- MODAL DE ACCIÓN --- */}
            {pagoSeleccionado && (
                <div className="fixed inset-0   bg-brand-primary/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 ">
                    <div className="bg-white rounded-[2.5rem] max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className={`p-8 text-center ${tipoAccion === 'CONFIRMAR' ? 'bg-brand-primary' : 'bg-red-600'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 ${tipoAccion === 'CONFIRMAR' ? 'bg-brand-accent' : 'bg-white'}`}>
                                {tipoAccion === 'CONFIRMAR' ? <CheckCircle size={32} className="text-brand-primary" /> : <Trash2 size={32} className="text-red-600" />}
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                {tipoAccion === 'CONFIRMAR' ? 'Validar Ingreso' : 'Anular Pago'}
                            </h3>
                        </div>

                        <div className="p-8 text-center space-y-4">
                            <p className="text-brand-primary/60 text-xs font-medium px-4">
                                ¿Confirmas el pago de <span className="font-black text-brand-primary underline">S/ {Number(pagoSeleccionado.total).toFixed(2)}</span> a nombre de:
                                <span className="block font-black text-brand-primary text-lg mt-2 uppercase italic">{pagoSeleccionado.customer_name_snapshot || 'Cliente'}</span>
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button onClick={() => setPagoSeleccionado(null)} className="py-4 border border-brand-primary/10 rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-primary/30 hover:bg-gray-50 transition-all">
                                    Cerrar
                                </button>
                                <button
                                    onClick={handleProcessAction}
                                    disabled={loading}
                                    className={`py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${tipoAccion === 'CONFIRMAR' ? 'bg-brand-primary hover:bg-brand-accent hover:text-brand-primary' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TABLA --- */}
            {/* <div className="overflow-x-auto ">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-brand-primary text-brand-accent text-[10px] font-black uppercase tracking-[0.15em]">
                            <th className="px-4 md:px-6 py-5">Cliente & Fecha</th> */}
        <div className="w-full">
            {/* Contenedor con scroll lateral obligatorio en móviles */}
            <div className="overflow-x-auto w-full border-2 border-transparent">
                <table className="w-full text-left border-collapse min-w-[700px]"> {/* min-w asegura que no se amontone todo */}
                    <thead>
                        <tr className="bg-brand-primary text-brand-accent text-[10px] font-black uppercase tracking-[0.15em]">
                            <th className="px-4 md:px-6 py-5">Cliente & Fecha</th>                
                            <th className="px-4 md:px-6 py-5 text-center">Registrado por</th>
                            <th className="px-4 md:px-6 py-5 text-center">Detalle Monto</th>
                            <th className="px-4 md:px-6 py-5 text-center">Método</th>
                            <th className="px-4 md:px-6 py-5 text-center">Neto Recibido</th>
                            <th className="px-4 md:px-6 py-5 text-center">Estado</th>
                            <th className="px-4 md:px-6 py-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-primary/5">
                        {datos.map((row) => (
                            <tr key={row.id} className="hover:bg-brand-secondary/7  0 transition-colors group">
                                {/* Cliente / Fecha */}
                                <td className="px-4 md:px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-black text-brand-primary text-sm uppercase italic leading-none mb-1 group-hover:text-brand-accent-hover transition-colors">
                                            {row.customer_name_snapshot || 'Sin Nombre'}
                                        </span>
                                        <span className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-tighter">
                                            {dayjs(row.payment_date).format('DD MMM • hh:mm A')}
                                        </span>
                                    </div>
                                </td>

                                {/* User Creador */}
                                <td className="px-4 md:px-6 py-5 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary rounded-lg">
                                            <User size={12} className="text-brand-accent" />
                                            <span className="font-black text-[10px] text-brand-accent ">
                                                {row.users?.email?.split(' ')[0] || 'Sistema'}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Monto / Descuento */}
                                <td className="px-4 md:px-6 py-5 text-center">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-brand-primary/60 italic">S/ {Number(row.amount).toFixed(2)}</span>
                                        {Number(row.discount) > 0 && (
                                            <span className="text-[9px] font-black text-red-500 uppercase">Desc: - %   {Number(row.discount).toFixed(2)}</span>
                                        )}
                                    </div>
                                </td>

                                {/* Método de Pago */}
                                <td className="px-2 py-2 text-center">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-wider ${methodStyles[row.payment_method]}`}>
                                        {row.payment_method === 'MOVIL' && <Smartphone size={12} />}
                                        {row.payment_method === 'CASH' && <Banknote size={12} />}
                                        {/* {row.payment_method ==='CARD_CREDIT' &&  <CreditCard size={12} />}
                                          {row.payment_method ==='CARD_DEBIT ' &&  <BanknoteArrowUp size={12} />} */}
                                        {row.payment_method.replace('_', ' ')}
                                    </div>
                                </td>

                                {/* Total Final */}
                                <td className="px-4 md:px-6 py-5 text-center">
                                    <span className="text-sm font-black text-brand-primary italic">
                                        S/ {Number(row.total).toFixed(2)}
                                    </span>
                                </td>

                                {/* Estado */}
                                <td className="px-4 md:px-6 py-5 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${statusStyles[row.status]}`}>
                                        {row.status}
                                    </span>
                                </td>

                                {/* Acciones */}
                                <td className="px-4 md:px-6 py-5">
                                    <div className="flex justify-center items-center gap-1 md:gap-2">
                                        <Link
                                            href={`/dashboard/pagos/${row.id}`}
                                            
                                            className="p-2.5 text-brand-primary/20 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                                            title="Ver Recibo"
                                        >
                                        
                                            <InfoIcon size={26} />
                                        </Link>

                                        {row.status === 'PENDING' ? (
                                            <button
                                                onClick={() => { setPagoSeleccionado(row); setTipoAccion('CONFIRMAR'); }}
                                                className="bg-brand-primary text-brand-accent text-[9px] font-black px-4 py-2.5 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all shadow-sm uppercase tracking-widest"
                                            >
                                                
                                                Confirmar
                                            </button>
                                        ) : (
                                            <div className="w-8 h-8 flex items-center justify-center text-emerald-500/30">
                                                <CheckCircle size={22} />
                                            </div>
                                        )}
                                    </div>
                                    {row.status === 'PENDING' && (
                                        <button
                                            onClick={() => { 
                                            if(isTooLateToCancel(row.start_time)) {
                                                alert("Tiempo límite excedido para cancelar");
                                                return;
                                            }
                                            setPagoSeleccionado(row); 
                                            setTipoAccion('CANCELAR'); 
                                            }}
                                           disabled={isTooLateToCancel(row.start_time)}
                                            className={`p-2 rounded-xl transition-all ${
                                            isTooLateToCancel(row.start_time) 
                                            ? 'text-gray-200 cursor-not-allowed' 
                                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                            }`}
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                        )}
                                                                        </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
}