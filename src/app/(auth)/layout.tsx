import React from 'react';
import { AuthTabs } from '@/features/auth/components/AuthTabs';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Auth Content */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-100">
          <div className="mb-6">
            <AuthTabs />
          </div>
          <div className="mt-6">
            {children}
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600">
          <p>© 2024 Shoe Shop. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

