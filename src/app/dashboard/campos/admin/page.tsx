import { FolderDot, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { getFieldsAdmin } from '@/actions/fields'; // El action que creamos
import { getSession } from '@/lib/jwt/auth-utils'; // Para obtener el user del JWT
import { redirect } from 'next/navigation';
import { CamposTable } from '@/components/campos/CamposTable';
import { EmptyState } from '@/components/pagos/EmptyState';

export default async function AdminCamposPage() {
    // 1. Validamos la sesión y el rol
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    // 2. Obtenemos los campos de la base de datos (PostgreSQL)
    const { success, content: fields, error } = await getFieldsAdmin();

    console.log("Campos session: ", session);;
    console.log("campos ", fields)


    return (
        // <div className="space-y-10 px-8 ">
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Estilo Pukllay */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ">
                {/* HEADER */}
                <div className="w-full mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-brand-primary uppercase italic tracking-tighter">
                            Gestión de <span className="text-brand-accent">Campos</span>
                        </h1>
                        <p className="text-brand-primary/40 font-bold text-xs uppercase tracking-widest mt-1">
                            {fields?.length || 0} Canchas registradas en el sistema
                        </p>
                    </div>

                    <Link href={`/dashboard/campos/admin/nuevo`}>
                        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-accent-hover hover:bg-brand-accent text-brand-primary font-bold py-2.5 px-6 rounded-lg transition-all shadow-sm active:scale-95">
                            <Plus size={20} />
                            Crear Nuevo Campo
                        </button>
                    </Link>
                </div>

                {/* FILTROS */}
                <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar campo por nombre o ubicación..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-brand-gray rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-gray rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        <Filter size={18} />
                        Filtros
                    </button>
                </div>

            </header>

            {/* 2. Grid de Canchas */}
            {!error ? (
                <div className="bg-white rounded-[2.5rem] border border-brand-primary/5 shadow-sm overflow-hidden">
                    {fields && fields.length > 0 ? (
                        <CamposTable datos={fields} />
                    ) : (
                        <EmptyState />
                    )}
                </div>
            ) : (
                <div>Existe un error</div>
            )}


        </div>
    );
}