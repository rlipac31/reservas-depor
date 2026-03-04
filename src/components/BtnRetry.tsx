
'use client';

export default function BtnRetry() {
  return (
    <button 
      onClick={() => window.location.reload()} 
      className="ml-auto text-[10px] font-black uppercase text-red-500 hover:underline"
    >
      Reintentar
    </button>
  );
}