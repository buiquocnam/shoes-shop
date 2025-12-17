import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { Role } from "@/types/global";
import { isTokenExpired } from "../jwt";

/**
 * JWT Payload interface
 */
interface JWTPayload {
  exp: number;
  iat?: number;
  sub?: string;
  roles?: Role;
  email?: string;
  [key: string]: unknown;
}

/**
 * Get access token from request
 * Priority: Cookie > Authorization Header
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get from cookie first
  const tokenFromCookie = request.cookies.get("accessToken")?.value;
  if (tokenFromCookie) {
    console.log("🔍 Token found in cookie:", tokenFromCookie);
    return tokenFromCookie;
  }

  // Try to get from Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    console.log("🔍 Token found in authorization header:", authHeader.substring(7));
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Decode JWT token and return payload
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

/**
 * Get user role from token
 */
export function getUserRoleFromToken(token: string): Role | null {
  const payload = decodeToken(token);
  if (!payload?.roles) return null;

  // Validate role
  if (payload.roles === Role.ADMIN || payload.roles === Role.USER) {
    return payload.roles;
  }

  return null;
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  if (!token) return false;

  return !isTokenExpired(token);
}

/**
 * Check if user has ADMIN role
 */
export function isAdmin(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  if (!token) return false;

  if (isTokenExpired(token)) return false;

  const role = getUserRoleFromToken(token);
  return role === Role.ADMIN;
}

/**
 * Get user info from token (for logging/debugging)
 */
export function getUserFromToken(
  token: string
): { roles?: Role; sub?: string } | null {
  const payload = decodeToken(token);
  if (!payload) return null;

  return {
    roles: payload.roles,
    sub: payload.sub,
  };
}
