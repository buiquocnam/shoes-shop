import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components';

export const metadata: Metadata = {
  title: 'Register - Shoe Shop',
  description: 'Create a new Shoe Shop account',
};

export default function RegisterPage() {
  return (
    <RegisterForm />
  );
}

