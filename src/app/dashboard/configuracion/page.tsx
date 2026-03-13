// app/dashboard/configuracion/page.tsx
import { cookies } from "next/headers";
import { getServerUser } from '@/actions/useServer';
import { getPerfilBusiness} from '@/actions/business'
import { redirect } from 'next/navigation';
import ConfigPageClient from '@/components/config/ConfigForm'; // Importamos el formulario

// Esta función obtiene los datos de tu API de Express
async function getConfig() {
    const user = await getServerUser();
   // console.log("user desde getConfig: ", user?.configId);
     if(user?.role !== 'ADMIN'){
         redirect(`/unauthorized`);
     }


  try {
        const res:any = await getPerfilBusiness()

    if (res.success){
         console.log("Respuesta de config: ", res.content);
          const data = res;
    return data;
    } return null;
   
  } catch (error) {
    console.error("Error al obtener config:", error);
    return null;
  }
}

export default async function Page() {
  // 1. Obtenemos los datos en el servidor
  const configData = await getConfig();
  console.log("configData desde page configuracion: ", configData);

  // 2. Se los pasamos al componente cliente (el formulario)
  return (
    <main className="min-h-screen bg-brand-secondary">
      <ConfigPageClient initialData={configData.content} /> 
    </main>
  );
}