"use server";

import { validateUser } from "@/services/auth.service";
import { createToken } from "@/lib/jwt/auth-utils"; // Importamos la nueva función
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export async function logout() {
  const cookieStore = await cookies();

  // 1. Borramos las cookies de sesión
  cookieStore.delete("pukllay_session");  // cookieStore.delete("user_name");
  // cookieStore.delete("user_role");
  // cookieStore.delete("user_slug");

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Error al notificar al backend logout");
  }

  // 2. Redirigir SIEMPRE fuera del try/catch
  redirect("/login");
}



export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await validateUser(email, password);

  if (!result.success) {
    redirect("/login");
    return { error: `error tipo: ${result.error}` };
  }



  // Creamos el JWT seguro
  const token = await createToken({
    id: result.userWithoutPassword?.id,
    name: result.userWithoutPassword?.name,
    role: result.userWithoutPassword?.role,
    email:result.userWithoutPassword?.email
  });

  const cookieStore = await cookies();
  cookieStore.set("pukllay_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  

  if (result.userWithoutPassword?.role === "ADMIN" || result.userWithoutPassword?.role==='USER'){
       //setTimeout(() =>  redirect("/dashboard"), 3000);
      // redirect(`/dashboard`)
      revalidatePath(`/dashboard`)
      return { success:true, content:result.userWithoutPassword }
  } 
    redirect("/login");
  
 
}