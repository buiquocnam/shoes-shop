import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  adminProductsApi,
  UpsertVariantsInput,
  VariantSizeResponse,
} from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";

/**
 * Upsert Variants Mutation
 * Gọi một lần để CREATE/UPDATE nhiều variants
 * Có id → UPDATE, không có id → CREATE
 */
export const useUpsertVariants = () => {
  const queryClient = useQueryClient();
  return useMutation<VariantSizeResponse[], Error, UpsertVariantsInput>({
    mutationFn: (data: UpsertVariantsInput) =>
      adminProductsApi.upsertVariants(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Variants updated successfully");
    },
    onError: () => {
      toast.error("Failed to update variants");
    },
  });
};
