import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { success } from "zod";

export async function validateUser(email: string, pass: string) {
  try {
    // 1. Buscamos al usuario en Supabase a través de Prisma
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    // 2. Si no existe el usuario, retornamos null
    if (!user) {
      return {success:false,error:`no existe usuario ${email} registrado`};
    }

    // 3. Verificamos si la cuenta está activa (campo 'state' que tienes en tu schema)
    if (!user.state) {
      return {success:false, error:`el usuario ${email} esta desabilitado`};
    }

    // 4. Comparamos la contraseña escrita con el hash guardado
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      return {success:false, error:`la contraseña es incorrecta`};
    }

    // 5. Si todo está bien, retornamos los datos del usuario 
    // pero OJO: quitamos el password del objeto por seguridad antes de mandarlo al Action
    const { password, ...userWithoutPassword } = user;
    
    return {success:true, userWithoutPassword};
    
  } catch (error) {
    console.error("Error en validateUser:", error);
    return {success:false, error:`error tipo ${error}`};
  }
}