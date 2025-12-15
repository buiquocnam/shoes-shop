import { useQueryClient } from "@tanstack/react-query";
import {
  adminProductsApi,
  UpdateProductInfoInput,
} from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { useMutationWithToast } from "@/features/shared";
import { ProductType } from "@/features/product/types";

/**
 * Update Product Info Mutation
 * Chỉ update info, không xử lý variant hoặc image
 */
export const useUpdateProductInfo = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<ProductType, UpdateProductInfoInput>({
    mutationFn: (data: UpdateProductInfoInput) =>
      adminProductsApi.updateInfo(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
    },
    successMessage: "Product info updated successfully",
    errorMessage: "Failed to update product info",
  });
};
