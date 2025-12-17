import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  adminProductsApi,
  ImportStockInput,
} from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";

/**
 * Import Stock Mutation
 * Gọi API import stock riêng, không gộp với create/update variant
 */
export const useImportStock = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, ImportStockInput>({
    mutationFn: (data: ImportStockInput) => adminProductsApi.importStock(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Stock imported successfully");
    },
    onError: () => {
      toast.error("Failed to import stock");
    },
  });
};


