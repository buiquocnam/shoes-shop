import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated, isAdmin } from "@/lib/middleware/auth";

// Gộp logic check auth chung
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function handleAdminAuth(request: NextRequest): NextResponse {
  if (!isAuthenticated(request)) {
    return redirectToLogin(request);
  }

  if (!isAdmin(request)) {
    const forbiddenUrl = new URL("/", request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

function handleProtectedAuth(request: NextRequest): NextResponse {
  if (!isAuthenticated(request)) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin routes: check auth + role
  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }

  // Protected routes: chỉ check auth
  const protectedRoutes = ["/profile", "/cart", "/checkout"];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    return handleProtectedAuth(request);
  }

  // Public routes: allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};