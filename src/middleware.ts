import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAuthenticated,
  isAdmin,
  getTokenFromRequest,
} from "@/lib/middleware/auth";

// Gộp logic check auth chung
function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function handleAdminAuth(request: NextRequest): NextResponse {
  // Cache token once to avoid multiple calls
  const token = getTokenFromRequest(request);

  // Only redirect if no token at all - allow expired tokens to pass through
  // so client-side can refresh them
  if (!token) {
    return redirectToLogin(request);
  }

  // If token exists but expired, allow access so client can refresh
  // Only check role if token is valid
  // Pass token directly to avoid re-fetching
  if (isAuthenticated(token) && !isAdmin(token)) {
    const forbiddenUrl = new URL("/", request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

function handleProtectedAuth(request: NextRequest): NextResponse {
  const token = getTokenFromRequest(request);

  // Only redirect if no token at all - allow expired tokens to pass through
  // so client-side can refresh them
  if (!token) {
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

  // Protected routes: chỉ check auth (includes /checkout/success)
  const protectedRoutes = ["/profile", "/cart", "/checkout"];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
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
