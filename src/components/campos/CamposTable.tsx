'use client';

import { useState } from 'react';
import {
    CheckCircle, Smartphone, Banknote, CreditCard,Plus, Search, Filter, AlertTriangle,
    Loader2, Trash2, Info, ReceiptText, User, BanknoteArrowUp,FilePenLine
} from 'lucide-react';
import { confirmPaymentAction, cancelPaymentAction } from '@/actions/payments';
import dayjs from '@/lib/dayjs/dayjs';
import Link from 'next/link';
import { SoccerField} from '@/types/field'
import { deletedFieldIdAction, toggleStateFieldAction } from '@/actions/fields';
                                                      

// Estilos de Badge para el estado (SQL: status)
// const statusStyles: any = {
//     PENDING: "bg-amber-50 text-amber-600 border-amber-200",
//     COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200",
//     CANCELLED: "bg-red-50 text-red-600 border-red-200",
// };

// // Estilos de Badge para el método (SQL: payment_method)
// const methodStyles: any = {
//     MOVIL: "bg-purple-50 text-purple-600 border-purple-200",
//     CASH: "bg-emerald-50 text-emerald-600 border-emerald-200",
//     CARD_CREDIT: "bg-blue-50 text-blue-600 border-blue-200",
//     CARD_DEBIT: "bg-blue-50 text-amber-600 border-amber-700",
//     TRANFER: "bg-sky-50 text-sky-600 border-sky-200",
// };

export function CamposTable({ datos }: { datos: any[] }) {
    const [loading, setLoading] = useState(false);
  //  const [pagoSeleccionado, setPagoSeleccionado] = useState<any | null>(null);
//const [tipoAccion, setTipoAccion] = useState<'CONFIRMAR' | 'CANCELAR' | null>(null);
    const [error , setError ]= useState(false)

  const [isLoading, setIsLoading] = useState(true);
  const [fieldToDelete, setFieldToDelete] = useState<SoccerField | null>(null);
  const [updateState, setUpdateState] = useState<SoccerField | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActivo, setIsActivo] = useState(false);
 const [campos, setCampos] = useState<SoccerField[]>([]); 


    // const handleProcessAction = async () => {
    //     if (!pagoSeleccionado || !tipoAccion) return;

    //     setLoading(true);
    //     const res = tipoAccion === 'CONFIRMAR'
    //         ? await confirmPaymentAction(pagoSeleccionado.id)
    //         : await cancelPaymentAction(pagoSeleccionado.id);

    //     if (res.success) {
    //         setPagoSeleccionado(null);
    //         setTipoAccion(null);
    //     } else {
    //         alert(res.error || "Error al procesar el pago");
    //     }
    //     setLoading(false);
    // };

    // const isTooLateToCancel = (paymentDate: string) => {
    //   const now = dayjs();
    //   const start = dayjs(paymentDate);
    //   return start.diff(now, 'hour', true) < 2;
    // };


    //{Number(field.price_per_hour).toFixed(2)}
    console.log("Datos recibidos en CamposTable:", datos);


const handleDelete = async () => {
    if (!fieldToDelete) return;
    setIsDeleting(true);

    try {
      const res:any = await deletedFieldIdAction(fieldToDelete.id);
      if (res.success) {
        setCampos(prev => prev.filter(c => c.id !== fieldToDelete.id));
        setFieldToDelete(null);
      } else {
        alert(res.error || "No se pudo eliminar el campo");
      }
    } catch (err) {
      console.error("Error al eliminar", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateState = async () => {
    if (!updateState?.id) return;
    setIsActivo(true);

   try {
      const res = await toggleStateFieldAction(updateState.id);
      if (res?.success) {
        setCampos((prevCampos) =>
          prevCampos.map((c) =>
            c.id === updateState.id ? { ...c, state: !c.state } : c
          )
        );
        setUpdateState(null);
      } else {
        alert(res.error || "Error al cambiar el estado");
      }
    } catch (err) {
      console.error("Error en handleUpdateState:", err);
    } finally {
      setIsActivo(false);
    }
  };

    return (
     
        <div className="relative">
            {/* --- MODAL DE ACCIÓN --- */}
            {/* {pagoSeleccionado && (
                <div className="fixed inset-0   bg-brand-primary/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
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
            )} */}

            {/* --- TABLA --- */}
            {/* TABLA RESPONSIVA */}
            <div className="w-full max-w-7xl mx-auto overflow-hidden bg-white  border border-brand-secondary shadow-sm">
                <div className="block w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead className=''>
                            <tr className="bg-brand-primary text-white">
                                <th className="px-6 py-4 text-xs font-bold uppercase">Campo</th>
                                <th className="px-4 py-4 text-xs font-bold uppercase">Ubicación</th>
                                <th className="px-4 py-4 text-xs font-bold uppercase text-center">Descripcion</th>
                                <th className="px-4 py-4 text-xs font-bold uppercase text-center">Precio</th>
                                <th className="px-4 py-4 text-xs font-bold uppercase text-center">Estado</th>
                                <th className="px-4 py-4 text-xs font-bold uppercase text-right">Acciones</th>
                            </tr>
                        </thead>
                        {error ? (
                            <div className='bg-red-200 text-red-800 p-2 rounded-[6px] m-4'><span>{error}</span></div>
                        ) : (

                            <tbody className="divide-y divide-brand-secondary">
                                {/* Si _id es objeto usa campo._id.$oid // si tiene que parsear a un id.toString() */}
                                {datos && datos?.map((campo) => (
                                    <tr key={campo.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-brand-primary uppercase text-[12px]">{campo.name}</div>
                                            <div className="text-[11px] text-gray-400 font-mono uppercase">ID: {campo.id.slice(0,12)}</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{campo.location}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{campo.description}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="font-semibold text-brand-black">{  'S/'} {campo.price_per_hour}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span
                                                onClick={() => setUpdateState(campo)} // Activamos el modal
                                                title='cambiar de estado'
                                                className={` inline-block px-4 py-2 rounded-xl  text-[10px] hover:text-[10.1px] transition-all cursor-pointer font-bold ${campo.state ? 'bg-brand-accent-hover text-brand-primary hover:bg-brand-accent hover:text-brand-white cursor-pointer transition duration-300' : 'bg-brand-primary text-brand-accent-hover hover:bg-blue-950 hover:text-brand-secondary'
                                                    }`}>
                                                {campo.state ? 'ACTIVO' : 'INACTIVO'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/dashboard/campos/admin/${campo.id}`}>
                                                    <button title="Editar" className="p-2 text-brand-gold hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer">
                                                        <FilePenLine size={22} />
                                                    </button>
                                                </Link>
                                                <button
                                                   onClick={() => setFieldToDelete(campo)} // Activamos el modal
                                                    title="Eliminar"
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Trash2 size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        )}

                    </table>
                </div>
            </div>

 {/* --- MODAL DE CONFIRMACIÓN (Se renderiza solo si hay algo que borrar) --- */}
      {fieldToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-black">¿Estás seguro?</h3>
              <p className="text-gray-500 text-sm mt-2">
                Vas a eliminar <strong className='text-brand-black font-medium text-base'>{fieldToDelete.name}</strong>. Esta acción no se puede deshacer y podrias eliminar las reservas vinculadas a este campo.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setFieldToDelete(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}




             {/* --- MODAL DE CONFIRMACIÓN UPDATE STATE (Se renderiza solo si se va acambniar el estado) --- */}
      {updateState && (
        <div className="fixed inset-0 bg-brand-primary/70  z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-primary text-brand-accent rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-primary">¿Estás seguro?</h3>
              <p className="text-gray-500 text-sm mt-2">
                Vas a cambiar de estado de este campo <strong className='text-brand-primary font-semibold uppercase text-base'>{updateState.name}</strong>.
                Esta acción no se puede deshacer y podrias eliminar las reservas vinculadas a este campo.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setUpdateState(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateState}
                disabled={isActivo}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                 ${updateState?.state
                    ? 'bg-red-600 hover:bg-red-700 text-white' // Si está activo, el botón es para desactivar (rojo)
                    : 'bg-brand-primary hover:bg-brand-primary/70 text-brand-secondary' // Si está inactivo, es para activar (dorado)
                  }`}
              >
                {isActivo ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    {updateState?.state ? 'Sí, desactivar' : 'Sí, activar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
      
    );
}