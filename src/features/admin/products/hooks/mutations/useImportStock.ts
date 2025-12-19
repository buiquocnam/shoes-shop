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
      // Invalidate variant-history queries to refresh history data
      queryClient.invalidateQueries({
        queryKey: [...sharedQueryKeys.product.key, "variant-history"],
      });
      toast.success("Nhập kho thành công");
    },
    onError: () => {
      toast.error("Nhập kho thất bại");
    },
  });
};
