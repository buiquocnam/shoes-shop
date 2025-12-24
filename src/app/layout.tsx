import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/layout/Header';
import { CartProvider, QueryProvider, } from '@/providers';
import { Toaster } from 'sonner';
import { Footer } from '@/components/layout/Footer';
import { ChatProvider } from '@/features/chat/components';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cửa hàng giày',
  description: 'Cửa hàng giày yêu thích của bạn',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" style={{ fontSize: '90%' }}>
      <body className={`${plusJakarta.className} antialiased`}>
        <QueryProvider>
          <CartProvider />
          <Header />
          {children}
          <Footer />
          <ChatProvider />
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}

