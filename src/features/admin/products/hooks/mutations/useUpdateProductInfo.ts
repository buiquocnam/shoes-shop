import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../../services/products.api";
import { ProductDetailType } from "@/features/product/types";
import { ProductContentInput } from "../../types";
import { queryKeys } from "@/features/shared";

/**
 * Hook để cập nhật product info
 */
export const useUpdateProductInfo = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductDetailType, Error, ProductContentInput>({
    mutationFn: (data: ProductContentInput) =>
      adminProductsApi.updateContent(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail(data.product.id),
      });
      toast.success("Update product successfully");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    },
  });
};
