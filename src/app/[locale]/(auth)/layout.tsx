'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/forgot-password' || pathname === '/verify-otp') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <Link href="/" className="mb-8 transform transition-transform hover:scale-105">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={160}
            height={52}
            className="h-12 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="hidden md:block w-full max-h-6xl">
          <img
            className="w-full h-full object-cover rounded-xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcdaoKTbHBt3Zco6gmuc5zSFV9FzUoSY8aWCT8gD12jkKB2j4hEw73BhZgmhdrkJY_jk4l9-ohrkSHa7W4cu6ATBlptaFu6YqLM4DlBDU-n18eBCP69z8NsH1G5Z2pM7S2xcVstNc9C3UMFKCfHCoDbJCCnNKPInDnm1J5yHPbzM_dXDyVpCc_v9rA1pXjl_rmTiciO6T6p-VXfhgjsTjTc9mVQe3SLG2JwKlAEAquHiBQbcxGsmojq2_XeqnMO8d706C5T_eoFLLk"
            alt="Auth background"
          />
        </div>
        <div className="max-w-7xl space-y-8">
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="transform transition-transform hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={140}
                height={46}
                className="h-10 md:h-12 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

