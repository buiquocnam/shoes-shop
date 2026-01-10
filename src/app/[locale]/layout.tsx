import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
// Header and Footer are client components, so they can be imported here
import Header from '@/components/layout/Header';
import { QueryProvider, SocketProvider, ChatProvider } from '@/providers';
import { Toaster } from 'sonner';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from 'next';

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin', 'vietnamese'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
});

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'HomePage' });

    return {
        title: t('title'),
        description: t('description'),
        metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
        alternates: {
            languages: {
                'en': '/en',
                'vi': '/vi',
            },
        }
    };
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} style={{ fontSize: '90%' }}>
            <body className={`${plusJakarta.className} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <QueryProvider>
                        <SocketProvider>
                            <Header />
                            {children}
                            <Footer />
                            <ChatProvider />
                            <Toaster position="top-right" />
                        </SocketProvider>
                    </QueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
