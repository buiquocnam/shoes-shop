"use client";

import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { productVariantsSchema, VariantsFormValues } from "../../schemas";
import { ProductVariantsSection } from "../sections/ProductVariantsSection";
import { useProduct } from "../../hooks";
import { useUpsertVariants, useImportStock } from "../../hooks/mutations";
import { transformVariantsToForm } from "../../utils/productFormHelpers";

interface ProductVariantFormProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Form riêng cho product variants & stock
 * Tự quản lý useForm, defaultValues, submit logic
 */
export const ProductVariantForm: React.FC<ProductVariantFormProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const { data, isLoading: loadingProduct } = useProduct(productId);
  const upsertVariants = useUpsertVariants();
  const importStock = useImportStock();

  const defaultValues = useMemo<VariantsFormValues>(() => {
    const variants = data?.variants || [];
    return {
      variants: transformVariantsToForm(variants),
    };
  }, [data]);

  const form = useForm<VariantsFormValues>({
    resolver: zodResolver(productVariantsSchema),
    defaultValues,
  });

  // Reset form khi data thay đổi (khi productId thay đổi hoặc data được fetch)
  useEffect(() => {
    if (data && !loadingProduct) {
      const newDefaultValues = {
        variants: transformVariantsToForm(data.variants || []),
      };
      form.reset(newDefaultValues);
    }
  }, [data, loadingProduct, productId, form]);

  const onSubmit = async (data: VariantsFormValues) => {
    // Step 1: Upsert Variants (CREATE/UPDATE tất cả variants trong một lần gọi)
    // Chuẩn bị payload: có id → UPDATE, không có id → CREATE
    const upsertPayload = data.variants.map((variant) => ({
      id: variant.id, // Có id → UPDATE variant này
      color: variant.color,
      sizes: variant.sizes.map((size) => ({
        id: size.id, // Có id → UPDATE size này
        size: size.size,
        // Không gửi stock ở đây, stock sẽ được import riêng
      })),
    }));

    const result = await upsertVariants.mutateAsync({
      productId,
      variants: upsertPayload,
    });

    // Step 2: Import Stock (gọi API riêng)
    // Response là array flat của variant sizes, cần map lại với form data
    const allVariantSizes: Array<{ variantSizeId: string; count: number }> = [];

    // Map response (flat array) với form variants
    // Response được sắp xếp theo thứ tự: variant1.size1, variant1.size2, variant2.size1, ...
    let responseIndex = 0;

    data.variants.forEach((formVariant) => {
      formVariant.sizes.forEach((formSize) => {
        // Tìm variant size trong response theo color và size
        const responseItem = result.find(
          (item) =>
            item.color === formVariant.color &&
            String(item.size) === String(formSize.size)
        );

        if (responseItem) {
          const currentStock = formSize.currentStock ?? 0;
          const deltaStock = formSize.stock ?? 0;

          // Validation: Nếu deltaStock âm, currentStock phải >= |deltaStock|
          if (deltaStock < 0 && currentStock < Math.abs(deltaStock)) {
            toast.error(
              `Không thể giảm ${Math.abs(deltaStock)} sản phẩm. Stock hiện tại (${currentStock}) không đủ.`
            );
            return; // Dừng submit
          }

          // Chỉ import nếu có thay đổi (delta !== 0)
          if (deltaStock !== 0) {
            allVariantSizes.push({
              variantSizeId: responseItem.id, // variantSizeId từ response
              count: deltaStock, // API nhận delta (số lượng thay đổi)
            });
          }
        }
      });
    });



    console.log("allVariantSizes", allVariantSizes);
    // Import stock nếu có thay đổi
    if (allVariantSizes.length > 0) {
      await importStock.mutateAsync({
        productId,
        items: allVariantSizes,
      });
    }

    onSuccess();
  };

  if (loadingProduct) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ProductVariantsSection control={form.control} productId={productId} />

      <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
        <Button
          variant="outline"
          type="button"
          disabled={upsertVariants.isPending || importStock.isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={upsertVariants.isPending || importStock.isPending}
        >
          {upsertVariants.isPending || importStock.isPending ? (
            <Spinner />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
};


