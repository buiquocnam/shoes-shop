import { useQueryClient } from "@tanstack/react-query";
import {
  adminProductsApi,
  UpsertVariantsInput,
  UpsertVariantsResponse,
} from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { useMutationWithToast } from "@/features/shared";

/**
 * Upsert Variants Mutation
 * Gọi một lần để CREATE/UPDATE nhiều variants
 * Có id → UPDATE, không có id → CREATE
 */
export const useUpsertVariants = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<UpsertVariantsResponse, UpsertVariantsInput>({
    mutationFn: (data: UpsertVariantsInput) =>
      adminProductsApi.upsertVariants(data),
    onSuccess: (_, variables) => {
      // Invalidate cả product list và product detail
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
    },
    successMessage: "Variants updated successfully",
    errorMessage: "Failed to update variants",
  });
};
