"use client";
import { useRouter, useSearchParams } from 'next/navigation';

export function FilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Si no hay filtro ni fecha, el activo por defecto es '' (Todos)
  const currentFilter = searchParams.get('filter') || (searchParams.get('date') ? 'custom' : '');

  const filters = [
    { label: 'Hoy', value: 'today' },
    { label: '7 Días', value: '7days' },
    { label: 'Mes', value: 'month' },
    { label: 'Todos', value: 'all' },
  ];

  const handleFilter = (val: string) => {
    const params = new URLSearchParams(); // Limpiamos todo para un filtro limpio
    if (val) {
      params.set('filter', val);
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">
        Filtros Rápidos
      </label>
      {/*  <div className="flex bg-brand-gray/30 p-1 rounded-xl w-fit border border-brand-gray "> */}
      <div className="flex bg-brand-gray/30 p-1 rounded-xl w-fit">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilter(f.value)}
            className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-[11px] md:text-xs font-bold transition-all duration-200 ${currentFilter === f.value
              ? 'bg-brand-black text-brand-gold shadow-md scale-105'
              : 'text-gray-500 hover:text-brand-black hover:bg-white/50'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}