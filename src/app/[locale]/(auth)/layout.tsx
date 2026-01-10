'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/forgot-password' || pathname === '/verify-otp') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="hidden md:block w-full max-h-6xl">
          <img
            className="w-full h-full object-cover rounded-xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcdaoKTbHBt3Zco6gmuc5zSFV9FzUoSY8aWCT8gD12jkKB2j4hEw73BhZgmhdrkJY_jk4l9-ohrkSHa7W4cu6ATBlptaFu6YqLM4DlBDU-n18eBCP69z8NsH1G5Z2pM7S2xcVstNc9C3UMFKCfHCoDbJCCnNKPInDnm1J5yHPbzM_dXDyVpCc_v9rA1pXjl_rmTiciO6T6p-VXfhgjsTjTc9mVQe3SLG2JwKlAEAquHiBQbcxGsmojq2_XeqnMO8d706C5T_eoFLLk"
            alt="Auth background"
          />
        </div>
        <div className="max-w-7xl space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

