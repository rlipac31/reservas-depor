"use server";

import { createUser, UserService } from "@/services/user/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from 'bcryptjs';



export async function registerUserAction(formData: FormData) {
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
    console.log("Datos recibidos en registerUserAction:", { email, name, dni, phone, password });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser({
            email,
            password: hashedPassword, // Nota: En producción, usa bcrypt.hash(password, 10)
            name:name.toLocaleLowerCase(),
            dni:dni.trim(),
            phone:phone.trim(),
            role: "USER",
            state: true,
            updated_at: new Date(),
        });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
        return { error: "El correo ya está registrado o hubo un error técnico." };
    }

    // Si todo sale bien, refrescamos y redirigimos
    revalidatePath("/");
    redirect("/login?success=account-created");
}

// listar suaurios

export async function getUsersPaginated(page: string = "1", limit: string = "10") {
  try {
    const { users, totalCount, totalPages } = await UserService.getAll(
      parseInt(page), 
      parseInt(limit)
    );

    // Quitamos el password antes de enviar al cliente por seguridad
    const safeUsers = users.map(({ password, ...user }) => ({
      ...user,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    }));

    return { success: true, data: safeUsers, meta: { totalCount, totalPages, page: parseInt(page) } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
// tole state user

export async function toggleUserStatusAction(id: string, currentState: boolean) {
  try {
    await UserService.toggleState(id, currentState);
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}