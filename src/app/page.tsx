import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Shoe Shop',
  description: 'Welcome to Shoe Shop - Your favorite shoe store',
};

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Shoe Shop</h1>
    </main>
  );
}

