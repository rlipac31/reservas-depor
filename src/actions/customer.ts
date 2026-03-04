"use server";

import { createCustomer, CustomerService } from "@/services/customer/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from 'bcryptjs';
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