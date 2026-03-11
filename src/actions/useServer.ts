'use server'
// lib/userServer.ts
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';


export async function getServerUser() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
 // console.log("Cookies disponibles en el servidor:", allCookies.map(c => c.name));

  const token = cookieStore.get('pukllay_session')?.value;

  if (!token) return null;

  try {
    // Decodificamos el payload que mostraste en TOKEN_CLAM.png
    const payload: any = decodeJwt(token);
   


    const user = {
      id: payload?.id,
      name: payload?.name,
      email:payload?.email,
      role: payload?.role
   
    };
   console.log("✅ getServerUser va a retornar:", user); // Verifica que esto NO sea null
    return user;
  } catch (error) {
    return null;
  }
}

