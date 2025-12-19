import type { Metadata } from 'next';
import { ForgetForm } from '@/features/auth/components';

export const metadata: Metadata = {
  title: 'Quên mật khẩu - ShoeShop',
  description: 'Đặt lại mật khẩu tài khoản ShoeShop của bạn',
};

export default function ForgotPasswordPage() {
  return (

    <ForgetForm />
  );
}

