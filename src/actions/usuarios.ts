"use server";

import { createUser, UserService } from "@/services/user/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from 'bcryptjs';
import { UserIdResponse } from "@/types/user";
// validacion
import { success, z } from "zod";


// export async function registerUserAction(formData: FormData) {
//     // Extraemos los datos del FormData
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;
//     const name = formData.get("name") as string;
//     const dni = formData.get("dni") as string;
//     const phone = formData.get("phone") as string;

//     // Validación básica
//     if (!email || !password || !name) {
//         return { error: "Faltan campos obligatorios" };
//     }
//     console.log("Datos recibidos en registerUserAction:", { email, name, dni, phone, password });

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

//         await createUser({
//             email,
//             password: hashedPassword, // Nota: En producción, usa bcrypt.hash(password, 10)
//             name:name.toLocaleLowerCase(),
//             dni:dni.trim(),
//             phone:phone.trim(),
//             role: "USER",
//             state: true,
//             updated_at: new Date(),
//         });

//         return { success:true, mensage:"se guardo el usuario con exito"}
//     } catch (error) {
//       console.error("Error al crear el usuario:", error);
//         return { error: "El correo ya está registrado o hubo un error técnico." };
//     }

//     // Si todo sale bien, refrescamos y redirigimos
//     revalidatePath("/");
//     redirect("/login?success=account-created");
// }

// listar suaurios



// Usamos el mismo Schema para validar en el servidor (Seguridad)
const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  dni: z.string().length(8),
  phone: z.string().length(9),
});

export async function registerUserAction(data: any) {
  // 1. Validar que los datos lleguen y cumplan el Schema
  const validation = registerSchema.safeParse(data);
  
  if (!validation.success) {
    return { success: false, message: "Datos de formulario inválidos" };
  }

  const { email, password, name, dni, phone } = validation.data;

  try {
    // 2. Verificar si el usuario ya existe (Opcional pero recomendado)
    // const existingUser = await getUserByEmail(email);
    // if (existingUser) return { success: false, message: "El correo ya existe" };

    const hashedPassword = await bcrypt.hash(password, 10);

   const res = await createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.toLowerCase(),
      dni: dni.trim(),
      phone: phone.trim(),
      role: "USER",
      state: true,
      updated_at: new Date(),
    });

   if(res.success){
    return { success:true}
   } 
   else{
    return { success:false, error:"erro: no se guardo el usuario"}
   }

  } catch (error: any) {
    console.error("Error al crear el usuario:", error);
    // Error de Prisma para campos únicos (P2002)
    if (error.code === 'P2002') {
      return { success: false, message: "El correo o DNI ya están registrados" };
    }
    return { success: false, message: `Error técnico al crear la cuenta ${error}` };
  }

  // 3. Éxito: Revalidar y Redirigir (FUERA del try/catch)
  revalidatePath("/");
  redirect("/login?success=account-created");
}

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


// bsucra usuario y actualizar

export async function getSearchUserIdAction(userId:string) {
  try {
    const data:any = await UserService.getById(userId);

     if (!data) {
      return { success: false, content: null, error: "Cliente no encontrado" };
    }
    const { password, ...resteDeCampos } = data;

    const safeUser = {
      ...resteDeCampos,
// Formateamos las fechas como ya lo estabas haciendo
  created_at: data.created_at.toISOString(),
  updated_at: data.updated_at.toISOString(),
    }

  

    return { success: true, content: data, error: null };
  } catch (e) {
    return { success: false, content: [], error: e };
  }
}



// Definimos el esquema de validación
const UserSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto").optional(),
  dni: z.string()
    .length(8, "El DNI debe tener exactamente 8 dígitos")
    .regex(/^\d+$/, "El DNI solo puede contener números").optional(),
  phone: z.string()
        .length(9, "el numeor de telefono tiene que ser  de 9 digitos")
        .regex(/^\d+$/, "El DNI solo puede contener números").optional()
});




export async function updateUserAction(id: string, formData: { name: string; phone?: string; dni?: string }) {
  try {

    const validatedData = UserSchema.parse(formData);
    console.log(" formdata desde action: ", formData)
        // Quitamos campos undefined para no enviarlos a Prisma
    const cleanData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, v]) => v !== undefined)
    );
    // Aquí podrías agregar validación con Zod
    await UserService.update(id, cleanData);

    // Esto refresca los datos en la pantalla sin recargar la página
    revalidatePath('/usuarios'); 
    
    return { success: true, message: "Usuario actualizado correctamente" };
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
    return { success: false, message: "No se pudo actualizar el usuario" };
  }
}



// toggle state user

export async function toggleUserStatusAction(id: string, currentState: boolean) {
  try {
    await UserService.toggleState(id, currentState);
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


export async function getUserIdAction() {
  try {
    const data = await UserService.getMeUser();

    return { success: true, content: data, error: null };
  } catch (e) {
    return { success: false, content: [], error: e };
  }
}