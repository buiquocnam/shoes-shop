"use client";

import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/layout/FormPageLayout";
import { ProductCreateForm } from "@/features/admin/products/components/forms/ProductCreateForm";

/**
 * Create Product Page - Real Route
 * Sau khi tạo thành công, redirect đến /admin/products/{id}/variants
 */
export default function CreateProductPage() {
  const router = useRouter();

  const handleSuccess = (productId: string) => {
    // Sau khi tạo product thành công, redirect đến edit variants
    router.push(`/admin/products/${productId}/variants`);
  };

  return (
    <FormPageLayout title="Tạo sản phẩm mới">
      <ProductCreateForm onSuccess={handleSuccess} />
    </FormPageLayout>
  );
}

