import type { Metadata } from 'next';
import { ForgetForm } from '@/features/auth/components';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth.forgotPassword' });
  return {
    title: `${t('title')} - ShoeShop`,
    description: t('description'),
  };
}

export default function ForgotPasswordPage() {
  return (

    <ForgetForm />
  );
}

