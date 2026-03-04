

import { Users, UserPlus } from 'lucide-react';
import UserCard from '@/components/usuarios/UserCard';
import { getCustomersPaginated } from '@/actions/customer';
import { PaginationControls } from '@/components/utils/PaginationControls';

import Link from 'next/link';

export default async function ClientesPage({

  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;
  const { data: customers, meta, success } = await getCustomersPaginated(page, limit);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <header className="bg-white p-6 rounded-[2.5rem] border border-brand-primary/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center -rotate-3 shadow-lg shadow-brand-primary/20">
            <Users className="text-brand-accent" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-brand-primary leading-none">
              Gestión de <span className="text-brand-accent">Personal</span>
            </h1>
            <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em] mt-1">
              {meta?.totalCount || 0} Usuarios registrados
            </p>
          </div>
        </div>
        <Link href="/dashboard/clientes/save" >
        <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-brand-primary transition-all shadow-lg active:scale-95">
          <UserPlus size={18} /> Nuevo Cliente
        </button>
      </Link>  
      </header>

      {/* Grid de Usuarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {success && customers?.map((customer: any) => (
          <UserCard key={customer.id} user={customer} />
        ))}
      </div>

      {meta && (
        <PaginationControls
          totalResults={meta.totalCount}
          totalPages={meta.totalPages}
          currentPage={meta.page}
          limit={10}
        />
      )}
    </div>
  );
}