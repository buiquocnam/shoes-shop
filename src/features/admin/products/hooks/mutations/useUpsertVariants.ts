import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { UpsertVariantsInput, VariantResponse } from "../../types";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
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
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Cập nhật biến thể thành công");
    },
    onError: () => {
      toast.error("Cập nhật biến thể thất bại");
    },
  });
};
