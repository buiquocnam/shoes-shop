"use client";

import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup } from "@/components/ui/field";
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

  useEffect(() => {
    if (data && !loadingProduct) {
      const newDefaultValues = {
        variants: transformVariantsToForm(data.variants || []),
      };
      form.reset(newDefaultValues);
    }
  }, [data, loadingProduct, productId, form]);

  const onSubmit = async (data: VariantsFormValues) => {
    const upsertPayload = data.variants.map((variant) => ({
      id: variant.id,
      color: variant.color,
      sizes: variant.sizes.map((size) => ({
        id: size.id,
        size: size.size.toString(),
      })),
    }));

    const result = await upsertVariants.mutateAsync({
      productId,
      variants: upsertPayload,
    });

    const allVariantSizes: Array<{ variantSizeId: string; count: number }> = [];

    data.variants.forEach((formVariant) => {
      formVariant.sizes.forEach((formSize) => {
        const responseItem = result.find(
          (item) => item.color === formVariant.color
        );

        if (responseItem) {
          const currentStock = formSize.currentStock ?? 0;
          const deltaStock = formSize.stock ?? 0;

          if (deltaStock < 0 && currentStock < Math.abs(deltaStock)) {
            toast.error(
              `Không thể giảm ${Math.abs(deltaStock)} sản phẩm. Stock hiện tại (${currentStock}) không đủ.`
            );
            return;
          }

          if (deltaStock !== 0) {
            allVariantSizes.push({
              variantSizeId: responseItem.id,
              count: deltaStock,
            });
          }
        }
      });
    });

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
      <FieldGroup className="gap-10">
        <ProductVariantsSection
          register={form.register}
          control={form.control}
          errors={form.formState.errors}
          productId={productId}
        />

        <div className="flex items-center justify-end gap-x-6">
          <Button
            variant="ghost"
            type="button"
            disabled={upsertVariants.isPending || importStock.isPending}
            onClick={onCancel}
            className="font-semibold text-muted-foreground hover:text-foreground"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={upsertVariants.isPending || importStock.isPending}
            className="px-10 py-3.5 font-bold shadow-lg"
          >
            {upsertVariants.isPending || importStock.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              "Lưu biến thể"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
