"use client";
import { useRouter, useSearchParams } from 'next/navigation';

export function DatePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = searchParams.get('date') || "";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (selectedDate) {
      params.set('date', selectedDate);
      params.delete('filter'); // Evita conflictos con filtros rápidos
      params.set('page', '1'); // Resetear a página 1 al filtrar
    } else {
      params.delete('date');
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">
        Fecha Específica
      </label>
      <input 
        type="date"
        value={currentDate}
        onChange={handleDateChange}
        className="border-2 border-brand-gray rounded-xl px-3 py-2 text-xs font-bold outline-none 
                   focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-white 
                   transition-all shadow-sm text-brand-black cursor-pointer"
      />
    </div>
  );
}