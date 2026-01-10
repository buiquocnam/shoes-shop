import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
  title: 'Đăng ký - Cửa hàng giày',
  description: 'Tạo tài khoản Cửa hàng giày mới',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full"> <Spinner className='size-8' /></div>}>
      <RegisterForm />
    </Suspense>
  );
}

