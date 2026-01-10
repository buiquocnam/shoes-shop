"use client";

import { useParams, useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/layout/FormPageLayout";
import { ProductInfoForm } from "@/features/admin/products/components/forms/ProductInfoForm";

/**
 * Edit Product Info Page - Real Route
 * Chỉ xử lý update product info, không xử lý variant hoặc image
 */
export default function EditProductInfoPage() {
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
    <FormPageLayout title="Chỉnh sửa thông tin sản phẩm">
      <ProductInfoForm
        productId={productId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </FormPageLayout>
  );
}

