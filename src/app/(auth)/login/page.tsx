import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components';
import { Spinner } from '@/components/ui/spinner';
export const metadata: Metadata = {
  title: 'Login - ShoeShop',
  description: 'Login to your ShoeShop account',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full"> <Spinner className='size-8' /></div>}>
      <LoginForm />
    </Suspense>
  );
}

