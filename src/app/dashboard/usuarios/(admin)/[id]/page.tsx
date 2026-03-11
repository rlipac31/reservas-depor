import { getSearchUserIdAction } from "@/actions/usuarios";
import { getSession } from "@/lib/jwt/auth-utils";

import EditUserForm from "@/components/usuarios/EditUserForm";
import { notFound, redirect } from "next/navigation";

export default async function EditUserPage({
    params
}: {
    params: Promise<{ id: string, businessSlug: string }>
}) {
    // En Next.js 15+, params es una promesa
    const { id } = await params;
//console.warn("id usuario ", id)
    const session = await getSession();

    // Validación de seguridad: Solo admin puede editar usuarios del staff
    if (session?.role !== 'ADMIN') {
        redirect(`/unauthorized`);
    }
  const result = await getSearchUserIdAction(id);

    // Si no tuvo éxito o no hay contenido, mostramos error
if (!result.success || !result.content) {
    console.error("Error:", result.error);
    return notFound();
}
 //   console.warn("usuario");
   // console.table(content);

 
  //  Mapeamos los datos para el componente
    const userData = {
        id: result.content.id || id,
        name: result.content.name || '',
        email: result.content.email || '',
        dni: result.content.dni || '',
        phone: result.content.phone || '',
        role: result.content.role || 'USER'
    };

    return (
        <div className="min-h-screen bg-brand-gray/10 py-12">
         <EditUserForm
                userData={userData}
               // businessSlug={businessSlug}
            /> 
        </div>
    );
}
