import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_token";

/** SHA-256 hex usando Web Crypto (compatible con el runtime edge). */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // La página de login es pública.
  if (pathname === "/admin/login") return NextResponse.next();

  const pw = process.env.ADMIN_PASSWORD;
  // Sin contraseña configurada, redirige a login (que mostrará el aviso).
  if (!pw) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const expected = await sha256Hex(pw);

  if (!token || token !== expected) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
