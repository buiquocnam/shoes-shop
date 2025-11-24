import { jwtDecode } from 'jwt-decode';

/**
 * Check if token is expired
 * Can be used on both client and server
 */
export function isTokenExpired(token?: string): boolean {
  if (!token) return true;
    const decoded: { exp: number } = jwtDecode(token);  
    return decoded.exp * 1000 < Date.now(); 
}
