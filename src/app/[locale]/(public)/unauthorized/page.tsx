"use client";

import { Link } from "@/i18n/routing";
import { Home, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function UnauthorizedPage() {
  const t = useTranslations('Unauthorized');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4 max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-100">
            <ShieldX className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">
          {t('description')}
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              {t('backHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
