"use client";

import { useParams, useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/layout/FormPageLayout";
import { ProductImageForm } from "@/features/admin/products/components/forms/ProductImageForm";

/**
 * Edit Product Images Page - Real Route
 * Chỉ xử lý upload/update images
 */
export default function EditProductImagesPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const handleSuccess = () => {
    router.push("/admin/products");
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <FormPageLayout title="Chỉnh sửa hình ảnh sản phẩm">
      <ProductImageForm
        productId={productId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </FormPageLayout>
  );
}

