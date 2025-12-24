'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={33}
              className="h-8 w-auto object-contain"
              unoptimized
            />
          </div>
          <p className="text-sm text-gray-500">© 2024 Cửa hàng giày KICKS. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  );
}

