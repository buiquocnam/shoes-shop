import { jwtDecode } from "jwt-decode";
import { Role } from "@/types";

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
 * Check if token is expired
 * Can be used on both client and server
 */
export function isTokenExpired(token?: string | null): boolean {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
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
 * Get role from token (client-side only)
 * Alias for getUserRoleFromToken for consistency
 */
export function getRoleFromToken(token?: string | null): Role | null {
  if (!token) return null;
  return getUserRoleFromToken(token);
}

/**
 * Get user role from token
 * Can be used on both client and server
 */
export function getUserRoleFromToken(token: string): Role | null {
  const payload = decodeToken(token);
  if (!payload?.roles) return null;

  // Validate role
  if (payload.roles === "ADMIN" || payload.roles === "USER") {
    return payload.roles;
  }

  return null;
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
