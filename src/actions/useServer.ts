'use server'
// lib/userServer.ts
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export async function getServerUser() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  //console.log("Cookies disponibles en el servidor:", allCookies.map(c => c.name));

  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    // Decodificamos el payload que mostraste en TOKEN_CLAM.png
    const payload: any = decodeJwt(token);
    // console.log("Payload decodificado: ", payload);



    const user = {
      uid: payload.uid,
      nameUser: payload.nameUser,
      role: payload.role,
      slug: payload.businessId?.slug,
    //   businessId: payload.businessId?._id,
    //   currency: payload.configBusiness.currency || null, // Si tu backend envía esta info, la capturamos
    //   zonaHoraria: payload.configBusiness.zonaHoraria || null,
    //   configId: payload.configBusiness._id || null,
    };
    // console.log("✅ getServerUser va a retornar:", user); // Verifica que esto NO sea null
    return user;
  } catch (error) {
    return null;
  }
}

