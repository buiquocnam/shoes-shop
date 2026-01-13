import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import { toast } from "sonner";

export interface DeleteVariantInput {
  variantId: string;
  productId: string;
}

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteVariantInput) =>
      adminProductsApi.deleteVariant(data.variantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(variables.productId),
      });
      toast.success("Xóa biến thể thành công");
    },
    onError: () => {
      toast.error("Xóa biến thể thất bại");
    },
  });
};
