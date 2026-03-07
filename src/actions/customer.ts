"use server";

import { createCustomer, CustomerService } from "@/services/customer/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from 'bcryptjs';


// validacion
import { z } from "zod";
import { CustomerIdTypeResponse } from "@/types/customer";

//creando campo
export async function registerCustomerAction(formData: FormData) {

    // Extraemos los datos del FormData
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const dni = formData.get("dni") as string;
    const phone = formData.get("phone") as string;

    // Validación básica
    if (!email || !password || !name) {
        return { error: "Faltan campos obligatorios" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await createCustomer({
            email,
            password: hashedPassword, // Nota: En producción, usa bcrypt.hash(password, 10)
            name,
            dni,
            phone,
            state: true,
            updated_at: new Date(),
        });
    } catch (error) {
        return { error: "El correo ya está registrado o hubo un error técnico." };
    }

    // Si todo sale bien, refrescamos y redirigimos
    revalidatePath("/");
    redirect("/dashboard/clientes?success=account-created");
}

export async function getCustomersPaginated(page: string = "1", limit: string = "10") {
  try {
    const { customers, totalCount, totalPages } = await CustomerService.getAll(
      parseInt(page), 
      parseInt(limit)
    );

    // Quitamos el password antes de enviar al cliente por seguridad
    const safeCustomers = customers.map(({ password, ...customer }) => ({
      ...customer,
      created_at: customer.created_at.toISOString(),
      updated_at: customer.updated_at.toISOString(),
    }));

    return { success: true, data: safeCustomers, meta: { totalCount, totalPages, page: parseInt(page) } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


// bsucra usuario y actualizar

export async function getCustomerIdAction(customerId:string) {
  try {
    const data:any = await CustomerService.getById(customerId);
    if (!data) {
      return { success: false, content: null, error: "Cliente no encontrado" };
    }
     const { password, ...resteDeCampos } = data;

    const safeCustomer = {
      ...data,
// Formateamos las fechas como ya lo estabas haciendo
  created_at: data.created_at.toISOString(),
  updated_at: data.updated_at.toISOString(),
    }

  

    return { success: true, content: safeCustomer, error: null };
  } catch (e) {
    return { success: false, content: [], error: e };
  }
}



// Definimos el esquema de validación
const updateCustomerSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto").optional(),
  dni: z.string()
    .length(8, "El DNI debe tener exactamente 8 dígitos")
    .regex(/^\d+$/, "El DNI solo puede contener números").optional(),
  phone: z.string()
        .length(9, "el numeor de telefono tiene que ser  de 9 digitos")
        .regex(/^\d+$/, "El DNI solo puede contener números").optional()
});




export async function updateCustomerAction(id: string, formData: { name: string; phone?: string; dni?: string }) {
  try {

    const validatedData = updateCustomerSchema.parse(formData);

    // Quitamos campos undefined para no enviarlos a Prisma
    const cleanData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, v]) => v !== undefined)
    );
    // Aquí podrías agregar validación con Zod
    await CustomerService.update(id, cleanData);

    // Esto refresca los datos en la pantalla sin recargar la página
    revalidatePath('/customers'); 
    
    return { success: true, message: "Customer actualizado correctamente" };
 } catch (err: unknown) { // Usamos unknown por seguridad
    // Verificamos si es un error de Zod de forma explícita
    if (err instanceof z.ZodError) {
      // Usamos .issues que es la propiedad estándar de Zod para los errores
      const firstIssue = err.issues[0];
      return { 
        success: false, 
        message: firstIssue?.message || "Error de validación" 
      };
    }
    console.error("Error updating user:", err);
    return { success: false, message: "No se pudo actualizar el Customer" };
  }
}




// tole state user

export async function toggleCustomerStatusAction(id: string, currentState: boolean) {
  try {
    await CustomerService.toggleState(id, currentState);
    revalidatePath("/dashboard/clientes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}