import { FolderDot, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { getFields } from '@/actions/fields'; // El action que creamos
import { getSession } from '@/lib/jwt/auth-utils'; // Para obtener el user del JWT
import FieldCard from '@/components/campos/FieldCard';
import { redirect } from 'next/navigation';

export default async function CamposPage() {
  // 1. Validamos la sesión y el rol
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  // 2. Obtenemos los campos de la base de datos (PostgreSQL)
  const { success, content: fields, error } = await getFields();

console.log("Campos session: ", session );;
console.log("campos ", fields)

  return (
    // <div className="space-y-10 px-8 ">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Estilo Pukllay */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-primary uppercase italic tracking-tighter">
            Gestión de <span className="text-brand-accent-hover">Campos</span>
          </h1>
          <p className="text-brand-primary/40 font-bold text-xs uppercase tracking-widest mt-1">
            {fields?.length || 0} Canchas registradas en el sistema
          </p>
        </div>

        <div className="flex gap-3">
          {/* Solo ADMIN puede crear o administrar masivamente */}
          {session.role === 'ADMIN' && (
            <>
              {/* <Link href={`/dashboard/campos/nuevo`}>
                <button className="flex items-center gap-2 bg-brand-primary text-brand-white font-black py-4 px-6 rounded-2xl hover:bg-brand-primary/90 transition-all shadow-lg text-xs uppercase tracking-widest">
                  <Plus size={18} className="text-brand-accent" />
                  Nuevo Campo
                </button>
              </Link> */}
              <Link href={`/dashboard/campos/admin`}>
                <button className="flex items-center gap-2 bg-brand-accent-hover text-brand-primary font-black py-4 px-6 rounded-2xl hover:scale-105 transition-all shadow-lg text-xs uppercase tracking-widest">
                  <FolderDot size={18} />
                  Ajustes
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 2. Grid de Canchas */}
      {error ? (
        <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] text-center">
          <p className="text-red-500 font-bold">{error}</p>
          <button className="mt-4 text-brand-primary underline font-black uppercase text-xs">Reintentar conexión</button>
        </div>
      ) : (
        <div className="flex flex-col  lg:flex-row flex-wrap lg:justify-between  gap-8">
          {fields && fields.length > 0 ? (
            fields.map((field: any) => (
              <FieldCard 
                key={field.id} 
                field={field} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-brand-secondary/20 rounded-[3rem] border-2 border-dashed border-brand-primary/10">
              <p className="text-brand-primary/30 font-black uppercase tracking-widest">
                No hay canchas disponibles. ¡Empieza registrando una!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}