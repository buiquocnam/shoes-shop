import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { ImportStockInput } from "../../types";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import { toast } from "sonner";

/**
 * Import Stock Mutation
 * Gọi API import stock riêng, không gộp với create/update variant
 */
export const useImportStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ImportStockInput) => adminProductsApi.importStock(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(variables.productId),
      });
      // Invalidate variant-history queries to refresh history data
      queryClient.invalidateQueries({
        queryKey: [...productQueryKeys.detail(variables.productId), "variant-history"],
      });
      toast.success("Nhập kho thành công");
    },
    onError: () => {
      toast.error("Nhập kho thất bại");
    },
  });
};
