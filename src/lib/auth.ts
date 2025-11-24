'use server';
import { cookies } from 'next/headers';
// ✅ Lưu OTP data vào cookie (Server Action)
export async function setOtpData(email: string, status: 'REGISTER' | 'FORGET_PASS') {
  const cookieStore = await cookies();
  cookieStore.set('otpEmail', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 600, // 10 phút
  });
  cookieStore.set('otpStatus', status, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 600, // 10 phút
  });
}

// ✅ Lấy OTP data từ cookie (Server Action)
export async function getOtpData(): Promise<{ email: string; status: 'REGISTER' | 'FORGET_PASS' } | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get('otpEmail')?.value;
  const status = cookieStore.get('otpStatus')?.value as 'REGISTER' | 'FORGET_PASS';
  
  return { email: email || '', status: status || 'REGISTER' };
}


// ✅ Xóa OTP data cookie (Server Action)
export async function clearOtpData() {
  const cookieStore = await cookies();
  cookieStore.delete('otpEmail');
  cookieStore.delete('otpStatus');
}


