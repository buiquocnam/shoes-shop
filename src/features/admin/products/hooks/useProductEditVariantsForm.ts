import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../services/products.api";
import { ProductFormValues } from "../schema";
import { ProductDetailType } from "@/features/product/types";
import { queryKeys } from "@/features/shared";

export const useProductEditVariantsForm = (productId: string) => {
  const queryClient = useQueryClient();

  const updateVariantsMutation = useMutation<
    ProductDetailType,
    Error,
    {
      productId: string;
      variants: Array<{
        color: string;
        sizes: Array<{ size: number; stock: number }>;
      }>;
    }
  >({
    mutationFn: async ({ productId, variants }) => {
      // Step 1: Create variants (flatten variants with sizes)
      const variantRequests: Array<{ color: string; size: number }> = [];

      variants.forEach((variant) => {
        variant.sizes.forEach((sizeData) => {
          variantRequests.push({
            color: variant.color,
            size: sizeData.size,
          });
        });
      });

      const variantResults = await adminProductsApi.createVariants({
        productId,
        variants: variantRequests,
      });

      // Step 2: Import stock
      let variantIndex = 0;
      const stockItems: Array<{ variantId: string; count: number }> = [];

      variants.forEach((variant) => {
        variant.sizes.forEach((sizeData) => {
          if (variantResults[variantIndex]) {
            stockItems.push({
              variantId: variantResults[variantIndex].id,
              count: sizeData.stock,
            });
            variantIndex++;
          }
        });
      });

      if (stockItems.length > 0) {
        await adminProductsApi.importStock({
          productId,
          items: stockItems,
        });
      }

      // Return product detail by fetching it
      return await adminProductsApi.getById(productId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail(data.product.id),
      });
    },
    onError: (error) => {
      console.error("Error updating product variants:", error);
      toast.error("Failed to update product variants. Please try again.");
    },
  });

  const handleSubmit = useCallback(
    async (data: ProductFormValues) => {
      try {
        if (!data.variants || data.variants.length === 0) {
          toast.error("Please add at least one variant.");
          return;
        }
        await updateVariantsMutation.mutateAsync({
          productId,
          variants: data.variants!,
        });

        toast.success("Update product variants successfully");
      } catch (error) {
        // Error handled by mutation's onError
      }
    },
    [productId, updateVariantsMutation]
  );

  return {
    handleSubmit,
    isLoading: updateVariantsMutation.isPending,
  };
};
