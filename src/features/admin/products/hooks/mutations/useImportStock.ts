import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../../services/products.api";
import { ImportStockInput } from "../../types";
import { queryKeys } from "@/features/shared";

/**
 * Hook để import/update stock cho variants
 */
export const useImportStock = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ImportStockInput>({
    mutationFn: (data: ImportStockInput) => adminProductsApi.importStock(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail(variables.productId),
      });
      toast.success("Stock updated successfully");
    },
    onError: (error) => {
      console.error("Error importing stock:", error);
      toast.error("Failed to update stock. Please try again.");
    },
  });
};
