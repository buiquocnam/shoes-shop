import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components';

export const metadata: Metadata = {
  title: 'Login - Shoe Shop',
  description: 'Login to your Shoe Shop account',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

