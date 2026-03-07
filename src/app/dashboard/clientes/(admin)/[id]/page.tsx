import { getCustomerIdAction } from "@/actions/customer";
import { getSession } from "@/lib/jwt/auth-utils";

import EditCustomerForm from "@/components/customer/EditCustomerForm";
import { notFound, redirect } from "next/navigation";

export default async function EditUserPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // En Next.js 15+, params es una promesa
    const { id } = await params;
console.warn("id usuario ", id)
    const session = await getSession();

    // Validación de seguridad: Solo admin puede editar usuarios del staff
    if (session?.role !== 'ADMIN') {
        redirect(`/unauthorized`);
    }

    const { success, content, error } = await getCustomerIdAction(id);

    if (!success || !content) {
        console.error("Error cargando usuario:", error);
        return notFound();
    }
    console.warn("usuario");
    console.table(content);

  //  Mapeamos los datos para el componente
    const customerData = {
        id: content.id || id,
        name: content.name || '',
        email: content.email || '',
        dni: content.dni || '',
        phone: content.phone || ''
    };

    return (
        <div className="min-h-screen bg-brand-gray/10 py-12">
         <EditCustomerForm
                customerData={customerData}
               // businessSlug={businessSlug}
            /> 
        </div>
    );
}
