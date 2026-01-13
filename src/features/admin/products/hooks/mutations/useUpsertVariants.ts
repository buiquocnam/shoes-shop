import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { UpsertVariantsInput, VariantResponse } from "../../types";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import { toast } from "sonner";

/**
 * Upsert Variants Mutation
 * Gọi một lần để CREATE/UPDATE nhiều variants
 * Có id → UPDATE, không có id → CREATE
 */
export const useUpsertVariants = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertVariantsInput) =>
      adminProductsApi.upsertVariants(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(variables.productId),
      });
      toast.success("Cập nhật biến thể thành công");
    },
    onError: () => {
      toast.error("Cập nhật biến thể thất bại");
    },
  });
};
