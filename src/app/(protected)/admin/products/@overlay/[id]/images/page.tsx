"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { DrawerOverlay } from "@/components/ui/drawer-overlay";
import { ProductImageForm } from "@/features/admin/products/components/forms/ProductImageForm";

/**
 * Edit Product Images Page - Drawer Overlay
 * Chỉ xử lý upload/update images
 */
export default function EditProductImagesPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const productId = params.id as string;
  const [open, setOpen] = useState(false);

  // Sync open state với pathname
  useEffect(() => {
    const expectedPath = `/admin/products/${productId}/images`;
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
  if (pathname !== `/admin/products/${productId}/images`) {
    return null;
  }

  return (
    <DrawerOverlay
      title="Edit Product Images"
      open={open}
      onOpenChange={handleOpenChange}
      side="right"
      className="w-full sm:max-w-2xl"
    >
      <ProductImageForm
        productId={productId}
        onSuccess={handleSuccess}
        onCancel={() => router.push("/admin/products")}
      />
    </DrawerOverlay>
  );
}

