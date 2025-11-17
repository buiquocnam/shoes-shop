import { useAuthStore } from '@/store/useAuthStore';
import { isTokenExpired } from './jwt'; // Import từ utility file

export async function getAccessToken(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    // Client-side: get from Zustand store
    try {
      const storeToken = useAuthStore.getState().accessToken;
      if (storeToken && !isTokenExpired(storeToken)) {
        return storeToken;
      }
    } catch (error) {
      console.log("getAccessToken error", error);
    }
  } else {
    // Server-side: get from cookies using dynamic import
    try {
      const { getAccessTokenFromCookies, refreshAccessToken } = await import('./auth');
      let token = await getAccessTokenFromCookies();
      
      // Refresh token if expired
      if (token && isTokenExpired(token)) {
        token = await refreshAccessToken();
      }
      
      if (token) {
        console.log("getAccessToken error", token);
        return token;
      }
    } catch (error) {
      console.log("getAccessToken error", error);
    }
  }
  
  return null;
}