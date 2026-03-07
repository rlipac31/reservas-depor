import { NextResponse } from "next/server";
import { CustomerService } from "@/services/customer/service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dni = searchParams.get("dni");
  const email = searchParams.get("email");

  //if (!dni && !email) return NextResponse.json({ exists: false });

// Buscamos de forma individual para dar una respuesta detallada
 // Ejecutamos ambas promesas en paralelo para mayor velocidad
  const [customerByDni, customerByEmail] = await Promise.all([
    dni ? CustomerService.checkExistingCustomer(dni, undefined) : null,
    email ? CustomerService.checkExistingCustomer(undefined, email) : null
  ]);

  return NextResponse.json({ 
    dniExists: !!customerByDni,
    emailExists: !!customerByEmail
  });
}