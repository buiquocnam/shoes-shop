"use client";

import { useParams, useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/layout/FormPageLayout";
import { ProductVariantForm } from "@/features/admin/products/components/forms/ProductVariantForm";

/**
 * Edit Product Variants & Stock Page - Real Route
 * Xử lý create/update variant và import stock
 */
export default function EditProductVariantsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const handleSuccess = () => {
    router.refresh();
    router.push("/admin/products");
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <FormPageLayout title="Chỉnh sửa biến thể và tồn kho sản phẩm">
      <ProductVariantForm
        productId={productId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </FormPageLayout>
  );
}

