import { useQueryClient } from "@tanstack/react-query";
import {
  adminProductsApi,
  ImportStockInput,
} from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { useMutationWithToast } from "@/features/shared";

/**
 * Import Stock Mutation
 * Gọi API import stock riêng, không gộp với create/update variant
 */
export const useImportStock = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<boolean, ImportStockInput>({
    mutationFn: (data: ImportStockInput) => adminProductsApi.importStock(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
    },
    successMessage: "Stock imported successfully",
    errorMessage: "Failed to import stock",
  });
};


