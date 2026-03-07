import { CalendarDays, FolderDot, Plus } from 'lucide-react';
import BookingCard from '@/components/booking/BookingCard';
import { getBookingsConPagination } from '@/actions/booking';
import { DatePicker } from '@/components/utils/DatePicker';
import { FilterTabs } from '@/components/utils/FilterTabs';
import { PaginationControls } from '@/components/utils/PaginationControls';
import { getServerUser } from '@/actions/useServer';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionServer } from '@/lib/jwt/session';
import { getSession } from '@/lib/jwt/auth-utils';

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; date?: string; page?: string; limit?: string }>;
}) {
   const user = await getSession();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'USER')) {
    redirect("/unauthorized");
  } 

console.log("user desde page reservas °°°°°°°::::   ", user)

  const { filter, date, page = "1", limit = "10" } = await searchParams;
  const { data, meta, error } = await getBookingsConPagination(filter, date, page, limit);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Estilo Pukllay */}
      <header className="bg-white p-6 rounded-[2.5rem] border border-brand-primary/5 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-brand-accent/20">
              <CalendarDays className="text-brand-primary" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-brand-primary leading-none">
                Gestión de <span className="text-brand-accent">Reservas</span>
              </h1>
              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em] mt-1">
                {meta?.totalResults || 0} Registros • {meta?.appliedFilter}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/campos">
              <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-brand-primary transition-all shadow-lg active:scale-95">
                <Plus size={18} /> Nueva Reserva
              </button>
            </Link>
            {/* {user.role === 'ADMIN' && ( */}
              <Link href="/dashboard/reservas/admin">
                <button className="p-3 bg-brand-secondary/30 text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-white transition-all">
                  <FolderDot size={20} /> 
                </button>
              </Link>
            {/* // )} */}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-dashed border-brand-primary/10 pt-6">
          <FilterTabs />
          <DatePicker />
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] text-center">
          <p className="text-red-500 font-bold uppercase text-xs tracking-widest">{error}</p>
        </div>
      )}

      {/* Grid de Cards */}
      <div className="flex flex-col items-center justify-center md:flex-row md:flex-wrap md:justify-between  transition-all duration-300 gap-6 sm:gap-4 lg:gap-6">
        {data.length > 0 ? (
          data.map((booking: any) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-brand-primary/5 shadow-inner">
            <div className="inline-flex p-6 bg-brand-secondary/20 rounded-full mb-4">
              <CalendarDays className="text-brand-primary/20" size={48} />
            </div>
            <h3 className="text-xl font-black italic uppercase text-brand-primary">Sin reservas</h3>
            <p className="text-brand-primary/40 text-xs font-bold uppercase tracking-widest mt-2">
              No hay partidos programados para este filtro.
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {data.length > 0 && meta && (
        <div className="flex justify-center pt-8">
          <PaginationControls
            totalResults={meta.totalResults}
            totalPages={meta.totalPages}
            currentPage={meta.page}
            limit={meta.limit}
          />
        </div>
      )}
    </div>
  );
}