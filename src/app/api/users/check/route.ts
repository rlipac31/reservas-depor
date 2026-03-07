import { NextResponse } from "next/server";
import { UserService } from "@/services/user/service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dni = searchParams.get("dni");
  const email = searchParams.get("email");

  //if (!dni && !email) return NextResponse.json({ exists: false });

// Buscamos de forma individual para dar una respuesta detallada
 // Ejecutamos ambas promesas en paralelo para mayor velocidad
  const [userByDni, userByEmail] = await Promise.all([
    dni ? UserService.checkExistingUser(dni, undefined) : null,
    email ? UserService.checkExistingUser(undefined, email) : null
  ]);

  return NextResponse.json({ 
    dniExists: !!userByDni,
    emailExists: !!userByEmail
  });
}