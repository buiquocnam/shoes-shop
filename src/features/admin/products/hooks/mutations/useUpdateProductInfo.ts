import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { UpdateProductInfoInput } from "../../types";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import { ProductType } from "@/features/product/types";
import { toast } from "sonner";

/**
 * Update Product Info Mutation
 * Chỉ update info, không xử lý variant hoặc image
 */
export const useUpdateProductInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductInfoInput) =>
      adminProductsApi.updateInfo(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(variables.productId),
      });
      toast.success("Cập nhật thông tin sản phẩm thành công");
    },
    onError: () => {
      toast.error("Cập nhật thông tin sản phẩm thất bại");
    },
  });
};
