
import { DollarSign, Smartphone, Banknote, CreditCard, CalendarDays, Wallet } from 'lucide-react';
import { getPagosConFiltro } from '@/actions/payments';
import { DatePicker } from '@/components/utils/DatePicker';
import { FilterTabs } from '@/components/utils/FilterTabs';
import { PaginationControls } from '@/components/utils/PaginationControls';
import { PagosTable } from '@/components/pagos/PagosTable';
import { MethodFilter } from '@/components/pagos/MethodFilter';
import { EmptyState } from '@/components/pagos/EmptyState';
import { getServerUser } from '@/actions/useServer';
import { redirect } from 'next/navigation';
import { paymentConFiltroResponse, paginationType, dataPaymentType, resumenPaymentType } from '@/types/payment';
export default async function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; date?: string; method?: string; page?: string; limit?: string }>;
}) {
  const user = await getServerUser();
 // if (!user || (user.role !== 'ADMIN' && user.role !== 'USER')) redirect("/unauthorized");

  const { filter, date, method, page = "1", limit = "10" } = await searchParams;
  const { data, pagination, resumen, error } = await getPagosConFiltro(filter, date, method, page, limit);
//  console.group("Datos de pago");
//   console.table(data);
//   console.table(resumen)
//   console.info("paginacion ", pagination)
// console.groupEnd();
const payments: dataPaymentType[] = data;
const paginationData: paginationType = pagination || { totalResults: 0, totalPages: 0, currentPage: 1, limit: 10 };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-4 animate-in fade-in duration-500">
      
      {/* STAT CARDS - Estilo Pukllay */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Recaudación Total" value={resumen.totalGlobal} icon="💰" color="bg-brand-primary text-brand-accent" />
        <StatCard title="Pago Móvil / Yape" value={resumen.porYape} icon="Smartphone" color="bg-white border border-brand-primary/10 text-brand-primary" />
        <StatCard title="Efectivo en Caja" value={resumen.porEfectivo} icon="💵" color="bg-white border border-brand-primary/10 text-brand-primary" />
        <StatCard title="Tarjetas" value={resumen.porTarjeta} icon="💳" color="bg-white border border-brand-primary/10 text-brand-primary" />
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Recaudación Total" 
            value={resumen.totalGlobal} 
            icon={<DollarSign size={30} strokeWidth={3} />} 
            color="bg-brand-primary text-brand-accent" 
          />
          <StatCard 
            title="Pago Móvil / Yape" 
            value={resumen.porYape} 
            icon={<Smartphone size={30} />} 
            color="bg-white border border-brand-primary/10 text-brand-primary" 
          />
          <StatCard 
            title="Efectivo en Caja" 
            value={resumen.porEfectivo} 
            icon={<Banknote size={30} />} 
            color="bg-white border border-brand-primary/10 text-brand-primary" 
          />
          <StatCard 
            title="Tarjetas" 
            value={resumen.porTarjeta} 
            icon={<CreditCard size={30} />} 
            color="bg-white border border-brand-primary/10 text-brand-primary" 
          />
    </div>

      <header className="bg-white p-6 rounded-[2.5rem] border border-brand-primary/5 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row  items-center gap-4 ">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center -rotate-3 shadow-lg">
              <Wallet className="text-brand-accent" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-brand-primary leading-none">
                Control de <span className="text-brand-accent">Caja</span>
              </h1>
              <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-[0.2em] mt-1">
                {pagination?.totalResults || 0} Operaciones Registradas
              </p>
            </div>
          </div>
          <div className='flex flex-col-reverse w-2/3 gap-4'>
              <div className='mx-auto'>
                  <MethodFilter  />
              </div>  
             
             <div className=' flex flex-row justify-between items-start'>
                 <FilterTabs />
                <DatePicker />  
             </div>
          </div>
       
        </div>

        {/* <div className="flex flex-row md:flex-row gap-4 items-center justify-start lg:justify-between lg:items-end border-t border-dashed border-brand-primary/10 pt-6">
          
           
        </div> */}
      </header>

      <div className="bg-white rounded-[2.5rem] border border-brand-primary/5 shadow-sm overflow-hidden">
        {data.length > 0 ? (
          <PagosTable datos={payments} />
        ) : (
          <EmptyState />
        )}
      </div>

      <PaginationControls
        totalResults={paginationData?.totalResults}
        totalPages={paginationData?.totalPages}
        currentPage={paginationData?.currentPage}
        limit={paginationData?.limit}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className={`p-6 rounded-[2rem] md:border-4 flex items-center justify-between shadow-sm transition-transform hover:scale-[1.02] ${color}`}>
      <div>
        <p className="text-[9px] uppercase font-black tracking-[0.2em] opacity-60">{title}</p>
        <p className="text-2xl font-black italic mt-1">S/ {value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
      </div>
      <div className="text-3xl grayscale-[0.5] opacity-80">{icon}</div>
    </div>
  );
}