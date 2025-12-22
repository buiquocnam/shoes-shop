"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  className?: string;
}

/**
 * Layout component chung cho các trang form
 * Có nút quay lại, title, và padding/spacing đẹp
 */
export function FormPageLayout({
  children,
  title,
  backHref = "/admin/products",
  className,
}: FormPageLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(backHref);
  };

  return (
    <div className={cn("min-h-full", className)}>
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header với nút quay lại và title */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary w-fit mb-2"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </Button>
            {title && (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Điền thông tin chi tiết để quản lý sản phẩm.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">{children}</div>
      </div>
    </div>
  );
}

