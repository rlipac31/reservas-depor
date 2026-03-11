// src/lib/session.ts
import 'server-only'; 
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { UserData } from "@/context/UserContext";

export async function getSessionServer(): Promise<UserData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pukllay_session")?.value;

    if (!token) return null;

    const payload = decodeJwt(token) as any;

    return {
      id: payload.id,
      name: payload.name || payload.nameUser,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    return null;
  }
}