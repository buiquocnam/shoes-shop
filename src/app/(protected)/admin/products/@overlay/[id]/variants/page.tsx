"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { DrawerOverlay } from "@/components/ui/drawer-overlay";
import { ProductVariantForm } from "@/features/admin/products/components/forms/ProductVariantForm";

/**
 * Edit Product Variants & Stock Page - Drawer Overlay
 * Xử lý create/update variant và import stock
 */
export default function EditProductVariantsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const productId = params.id as string;
  const [open, setOpen] = useState(false);

  // Sync open state với pathname
  useEffect(() => {
    const expectedPath = `/admin/products/${productId}/variants`;
    if (pathname === expectedPath) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pathname, productId]);

  const handleSuccess = () => {
    router.refresh();
    router.push("/admin/products");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.push("/admin/products");
    }
  };

  // Không render nếu pathname không match
  if (pathname !== `/admin/products/${productId}/variants`) {
    return null;
  }

  return (
    <DrawerOverlay
      title="Edit Product Variants & Stock"
      open={open}
      onOpenChange={handleOpenChange}
      side="right"
      className="w-full sm:max-w-2xl"
    >
      <ProductVariantForm
        productId={productId}
        onSuccess={handleSuccess}
        onCancel={() => router.push("/admin/products")}
      />
    </DrawerOverlay>
  );
}

