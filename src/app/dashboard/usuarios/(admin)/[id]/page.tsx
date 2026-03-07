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
console.warn("id usuario ", id)
    const session = await getSession();

    // Validación de seguridad: Solo admin puede editar usuarios del staff
    if (session?.role !== 'ADMIN') {
        redirect(`/unauthorized`);
    }

    const { success, content, error } = await getSearchUserIdAction(id);

    if (!success || !content) {
        console.error("Error cargando usuario:", error);
        return notFound();
    }
    console.warn("usuario");
    console.table(content);

  //  Mapeamos los datos para el componente
    const userData = {
        id: content.id || id,
        name: content.name || '',
        email: content.email || '',
        dni: content.dni || '',
        phone: content.phone || '',
        role: content.role || 'USER'
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
