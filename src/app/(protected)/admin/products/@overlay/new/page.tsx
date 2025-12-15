"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DrawerOverlay } from "@/components/ui/drawer-overlay";
import { ProductCreateForm } from "@/features/admin/products/components/forms/ProductCreateForm";

/**
 * Create Product Page - Drawer Overlay
 * Sau khi tạo thành công, redirect đến /admin/products/{id}/variants
 */
export default function CreateProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sync open state với pathname
  useEffect(() => {
    if (pathname === "/admin/products/new") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pathname]);

  const handleSuccess = (productId: string) => {
    // Sau khi tạo product thành công, redirect đến edit variants
    router.push(`/admin/products/${productId}/variants`);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.push("/admin/products");
    }
  };

  // Không render nếu pathname không match
  if (pathname !== "/admin/products/new") {
    return null;
  }

  return (
    <DrawerOverlay
      title="Create New Product"
      open={open}
      onOpenChange={handleOpenChange}
      side="right"
      className="w-full sm:max-w-2xl"
    >
      <ProductCreateForm onSuccess={handleSuccess} />
    </DrawerOverlay>
  );
}

