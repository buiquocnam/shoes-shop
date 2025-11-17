import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '@/components/layout/Header';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Shoe Shop',
  description: 'Your favorite shoe shop',
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
          <Header />
          {children}
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}

