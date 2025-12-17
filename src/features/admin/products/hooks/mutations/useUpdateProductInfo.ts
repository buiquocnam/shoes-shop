import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  adminProductsApi,
  UpdateProductInfoInput,
} from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { ProductType } from "@/features/product/types";
import { toast } from "sonner";

/**
 * Update Product Info Mutation
 * Chỉ update info, không xử lý variant hoặc image
 */
export const useUpdateProductInfo = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductType, Error, UpdateProductInfoInput>({
    mutationFn: (data: UpdateProductInfoInput) =>
      adminProductsApi.updateInfo(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Product info updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product info");
    },
  });
};
