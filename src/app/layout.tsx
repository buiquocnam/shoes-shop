import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '@/components/layout/Header';
import { CartProvider, QueryProvider, } from '@/providers';
import { Toaster } from 'sonner';
import { Footer } from '@/components/layout/Footer';
import { ChatProvider } from '@/features/chat/components';

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
    <html lang="en">
      <body>
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

