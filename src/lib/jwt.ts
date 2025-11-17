// JWT utilities - can be used on both client and server
import { jwtDecode } from 'jwt-decode';

/**
 * Check if token is expired
 * Can be used on both client and server
 */
export function isTokenExpired(token?: string): boolean {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
