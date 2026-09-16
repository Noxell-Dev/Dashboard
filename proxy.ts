import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "./lib/auth";

// Next.js 16: el antiguo middleware.ts se llama proxy.ts. Misma idea:
// toda la app exige sesión salvo /login y los archivos estáticos.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const valid = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!valid && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (valid && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.png|apple-icon.png).*)"],
};
