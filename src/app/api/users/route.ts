import { NextResponse } from "next/server";
import { UserService } from "@/services/user/service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dni = searchParams.get("dni");
  const email = searchParams.get("email");

  if (!dni && !email) return NextResponse.json({ exists: false });

  const user = await UserService.checkExistingUser(dni || undefined, email || undefined);

  return NextResponse.json({ exists: !!user });
}