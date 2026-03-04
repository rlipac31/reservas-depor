"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ListOrdered, Hash } from 'lucide-react';

interface Props {
  totalResults: number;
  totalPages:number;
  currentPage: number;
  limit: number;
}

export function PaginationControls({ totalResults,  totalPages, currentPage, limit }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();


 // console.log("total pages desde pagination ", totalPages, "total results ", totalResults, "current page ", currentPage, "limit ", limit)

  const updateURL = (paramsUpdate: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(paramsUpdate).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 bg-white p-4 rounded-2xl border border-brand-gray/50 shadow-sm">
      
      {/* Selector de Límite */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-gray/20 rounded-lg text-brand-gold">
         {/*  <ListOrdered size={16} /> */}
          <Hash size={16} />
        </div>
        <select 
          value={limit}
          onChange={(e) => updateURL({ limit: e.target.value, page: '1' })}
          className="bg-transparent text-xs font-bold outline-none border-b-2 border-brand-gray focus:border-brand-gold py-1"
        >

          <option value="8">8 por pág.</option>
          <option value="12">12 por pág.</option>
          <option value="24">24 por pág.</option>
          <option value="48">48 por pág.</option>
        </select>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Total: {totalResults}
        </span>
      </div>

      {/* Botones de Paginación */}
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => updateURL({ page: (currentPage - 1).toString() })}
          className="p-2 rounded-xl border border-brand-gray hover:bg-brand-gray/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1 px-4">
          <span className="text-sm font-black text-brand-black">{currentPage}</span>
          <span className="text-gray-300 text-xs font-bold">/</span>
          <span className="text-sm font-bold text-gray-400">{totalPages || 1}</span>
        </div>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => updateURL({ page: (currentPage + 1).toString() })}
          className="p-2 rounded-xl border border-brand-gray hover:bg-brand-gray/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}