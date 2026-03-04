import { Suspense } from 'react';
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReservationForm from "@/components/booking/ReservationForm";
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface SavePageProps {
  searchParams: {
    fieldId?: string;
    date?: string;
    time?: string;
    name?: string;
  };
}

export default async function SaveBookingPage({ searchParams }: SavePageProps) {



  const { fieldId, date, time } = await searchParams;

    console.log("🔍 Parámetros recibidos en el servidor:","filedId", fieldId, date, time);

  if (!fieldId || !date || !time) {
    console.log("❌ Faltan parámetros, redirigiendo...");
    // COMENTA ESTA LÍNEA TEMPORALMENTE PARA VER EL ERROR REAL EN PANTALLA
    // redirect("/dashboard/campos"); 
  }

  // 1. Validaciones básicas de parámetros
  // if (!fieldId || !date || !time) {
  //   redirect("/dashboard/campos");
  // }

  // 2. Buscamos la cancha en la DB para tener el precio real y capacidad
 
// 3. Buscamos la cancha en la DB
  const campoDb = await prisma.fields.findUnique({
    where: { id: fieldId as string} // Aseguramos el tipo string para el UUID},
  });

  if (!campoDb) redirect("/dashboard/campos");

  // ✅ Convierte el objeto a un JSON plano para que sea compatible
 // 4. SERIALIZACIÓN: Convertimos tipos complejos (Decimal/Date) a tipos simples
  // Esto evita el error de Next.js al pasar datos de Server a Client
  const fieldDataSafe = {
    ...campoDb,
    price_per_hour: Number(campoDb.price_per_hour),
    created_at: campoDb.created_at.toISOString(),
    updated_at: campoDb.updated_at.toISOString(),
  };
  

  if (!campoDb) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-black text-brand-primary uppercase italic">Cancha no encontrada</h2>
        <Link href="/dashboard/campos" className="mt-4 text-brand-accent font-bold underline">Volver al listado</Link>
      </div>
    );
  }

  // Preparamos la data inicial para el formulario
  const initialData:any = {
    fieldId,
    fieldName: campoDb.name,
    date,
    time,
   // campo: JSON.parse(JSON.stringify(campo)), // Evita problemas de serialización con Decimal
    campo: fieldDataSafe, // Ahora sí es seguro pasarlo
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Botón Volver */}
      <Link 
        href="/dashboard/campos" 
        className="inline-flex items-center gap-2 text-brand-primary/40 hover:text-brand-primary font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Cambiar horario o cancha
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Columna Izquierda: Mensaje de Seguridad / Info */}
        <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
          <div className="bg-brand-secondary/20 p-10 rounded-[3rem] border border-brand-primary/5">
            <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center mb-6 rotate-3 shadow-lg shadow-brand-accent/20">
              <ShieldCheck className="text-brand-primary" size={32} />
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-brand-primary leading-none mb-4">
              Estás a un <br /> <span className="text-brand-accent text-5xl">paso</span>
            </h1>
            <p className="text-brand-primary/60 font-medium leading-relaxed">
              Tu reserva en <span className="font-bold text-brand-primary">{campoDb.name}</span> se mantendrá bloqueada temporalmente mientras completas el pago.
            </p>

            <ul className="mt-8 space-y-4">
               <li className="flex items-center gap-3 text-xs font-bold text-brand-primary/40 uppercase tracking-wider">
                 <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" /> Confirmación inmediata
               </li>
               <li className="flex items-center gap-3 text-xs font-bold text-brand-primary/40 uppercase tracking-wider">
                 <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" /> Pago 100% seguro
               </li>
            </ul>
          </div>

          <div className="px-6">
            <p className="text-[10px] text-brand-primary/30 font-bold uppercase tracking-[0.2em] leading-loose">
              Pukllay v3.0 - Gestión Deportiva Profesional <br />
              Lima, Perú - {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Columna Derecha: El Formulario */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <Suspense fallback={<div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-[2.5rem]" />}>
            <ReservationForm initialData={initialData} />
          </Suspense>
        </div>

      </div>
    </div>
  );
}