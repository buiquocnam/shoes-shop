'use server';
import { cookies } from 'next/headers';

// ✅ Lưu token vào cookie (Server Action)
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

// ✅ Xoá cookie (Server Action)
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

// ✅ Lấy token từ cookie (Server Action)
export async function getAccessTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || null;
}

// ✅ Refresh token (Server Action)
export async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const accessToken = data.result?.access_token;
    const newRefreshToken = data.result?.refresh_token;
    if (accessToken) {
      // Update cookies with new tokens
      await setAuthCookies(accessToken, newRefreshToken || refreshToken);
      console.log('[Server] Token refreshed successfully');
      return accessToken;
    }
    console.error('[Server] Invalid refresh token response format:', data);
    return null;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}
