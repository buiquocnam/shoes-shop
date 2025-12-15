import { useMutationWithToast } from "@/features/shared";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { useQueryClient } from "@tanstack/react-query";

export interface DeleteVariantInput {
  variantId: string;
  productId: string;
}

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<boolean, DeleteVariantInput>({
    mutationFn: (data: DeleteVariantInput) =>
      adminProductsApi.deleteVariant(data.variantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
    },
    successMessage: "Variant deleted successfully",
    errorMessage: "Failed to delete variant",
  });
};
