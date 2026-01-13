import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import { toast } from "sonner";

export interface DeleteVariantSizeInput {
  sizeId: string;
  productId: string;
}

export const useDeleteVariantSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteVariantSizeInput) =>
      adminProductsApi.deleteVariantSize(data.sizeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(variables.productId),
      });
      toast.success("Xóa size thành công");
    },
    onError: () => {
      toast.error("Xóa size thất bại");
    },
  });
};
