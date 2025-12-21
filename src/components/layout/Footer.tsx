'use client';

import { Facebook, Twitter, Instagram, FacebookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useIsAdmin } from "@/store";
import { Role } from "@/types/global";
export function Footer() {
  const isAdmin = useIsAdmin();
  if (isAdmin) {
    return null;
  }
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
  };

  return (
    <footer className="border-t border-gray-200/50 ">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-2">Liên hệ với chúng tôi</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              123 Shoe Lane, Style City, 45678
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Email: support@solestyle.com
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Điện thoại: (123) 456-7890
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-2">Bản tin</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Đăng ký nhận bản tin để nhận các cập nhật và ưu đãi mới nhất.
            </p>
            <form className="flex" onSubmit={handleNewsletterSubmit}>
              <Input
                placeholder="Nhập email của bạn"
                type="email"
                className="w-full mr-2"
                required
              />
              <Button type="submit">Đăng ký</Button>
            </form>
          </div>

          {/* Follow Us */}
          <div className="justify-self-center text-center">
            <h3 className="font-bold text-lg mb-2">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
              <Link
                className="text-gray-500 hover:text-primary "
                href="#"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fillRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                className="text-gray-500 hover:text-primary "
                href="#"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                className="text-gray-500 hover:text-primary "
                href="#"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.802 2.013 10.156 2 12.315 2h.004zM12 6.848a5.152 5.152 0 100 10.304 5.152 5.152 0 000-10.304zM12 15.362a3.362 3.362 0 110-6.724 3.362 3.362 0 010 6.724zM16.802 6.11a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"
                    fillRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200/50 dark:border-gray-700/50 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 SoleStyle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

