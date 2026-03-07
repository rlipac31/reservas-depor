'use client'
import { SearchX, CalendarOff } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border-2 border-dashed border-brand-primary/10">
      <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mb-4">
        <SearchX className="text-gray-400" size={40} />
      </div>
      <h3 className="text-xl font-bold text-brand-black uppercase tracking-tight">
        No se encontraron pagos
      </h3>
      <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
        No hay registros para los filtros seleccionados. Intenta cambiando la fecha o el método de pago.
      </p>
      <button 
        onClick={() => window.location.href = window.location.pathname}
        className="mt-6 text-xs font-black uppercase tracking-widest bg-brand-primary text-brand-accent px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg"
      >
        Limpiar Filtros
      </button>
    </div>
  );
}