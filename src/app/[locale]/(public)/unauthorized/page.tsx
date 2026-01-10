"use client";

import { Link } from "@/i18n/routing";
import { Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function UnauthorizedPage() {
  const t = useTranslations('Unauthorized');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-warning/10">
            <ShieldAlert className="w-16 h-16 text-warning" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">
            Truy cập bị từ chối
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên hoặc quay lại trang chủ.
          </p>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="rounded-full px-8 font-bold border-border">
            <Link href="/">Trang chủ</Link>
          </Button>
          <Button asChild className="rounded-full px-8 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
