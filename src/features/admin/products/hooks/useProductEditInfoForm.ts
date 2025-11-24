import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../services/products.api";
import { ProductFormValues } from "../schema";
import { generateSlug } from "../utils/productFormHelpers";
import { ProductDetailType } from "@/features/product/types";
import { ProductContentInput } from "../types";
import { queryKeys } from "@/features/shared";

export const useProductEditInfoForm = (productId: string) => {
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation<
    ProductDetailType,
    unknown,
    ProductContentInput
  >({
    mutationFn: (data: ProductContentInput) =>
      adminProductsApi.updateContent(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail(data.product.id),
      });
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    },
  });

  const handleSubmit = useCallback(
    async (data: ProductFormValues) => {
      try {
        await updateProductMutation.mutateAsync({
          productId,
          name: data.name,
          slug: generateSlug(data.name),
          description: data.description,
          price: data.price,
          discount: data.discount,
          categoryId: data.category,
          brandId: data.brand,
        });

        toast.success("Update product successfully");
      } catch (error) {
        // Error handled by mutation's onError
      }
    },
    [productId, updateProductMutation]
  );

  return {
    handleSubmit,
    isLoading: updateProductMutation.isPending,
  };
};
