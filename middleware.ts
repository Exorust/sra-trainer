import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const password = process.env.AUTH_PASSWORD;
  if (!password) return NextResponse.next();

  const secret = process.env.AUTH_SECRET ?? "sra-trainer-secret";
  const expected = await sha256(`${password}:${secret}`);
  const cookie = req.cookies.get("sra_auth")?.value;

  if (cookie === expected) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
