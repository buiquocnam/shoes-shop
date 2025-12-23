'use client';

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { usePathname} from "next/navigation";
export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) {
    return null;
  }

  return (
    <footer className="border-t border-gray-200/50 ">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-2">Liên hệ với chúng tôi</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Số 123, Đường ABC, Quận XYZ, TP. HCM
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Email: support@shoeshop.com
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Điện thoại: (123) 456-7890
            </p>
          </div>

          {/* Follow Us */}
          <div className="justify-self-center text-center">
            <h3 className="font-bold text-lg mb-2">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
              <Link
                className="text-gray-500 hover:text-primary "
                href="#"
              >
                <Facebook className="w-6 h-6" />
              </Link>
              <Link
                className="text-gray-500 hover:text-primary "
                href="#"
              >
                <Twitter className="w-6 h-6" />
              </Link>
              <Link
                className="text-gray-500 hover:text-primary "
                href="#"
              >
                <Instagram className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200/50 dark:border-gray-700/50 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Shoe Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

