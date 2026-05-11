import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";

function tokenFor(password: string) {
  const secret = process.env.AUTH_SECRET ?? "sra-trainer-secret";
  return createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.AUTH_PASSWORD;

  if (!expected) {
    return NextResponse.json({ error: "AUTH_PASSWORD not configured" }, { status: 500 });
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = tokenFor(expected);
  const cookieStore = await cookies();
  cookieStore.set("sra_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("sra_auth");
  return NextResponse.json({ ok: true });
}
