import type { Metadata } from 'next';
import { ForgetForm } from '@/features/auth/components';

export const metadata: Metadata = {
  title: 'Forgot Password - ShoeShop',
  description: 'Reset your ShoeShop account password',
};

export default function ForgotPasswordPage() {
  return (

          <ForgetForm />
  );
}

