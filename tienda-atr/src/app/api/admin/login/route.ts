import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return NextResponse.json(
      { error: "El panel de administración no está configurado." },
      { status: 500 }
    );
  }

  const validUser = typeof username === "string" && safeEqual(username, adminUser);
  const validPassword =
    typeof password === "string" && safeEqual(password, adminPassword);

  if (!validUser || !validPassword) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  await createAdminSession(username);
  return NextResponse.json({ ok: true });
}
