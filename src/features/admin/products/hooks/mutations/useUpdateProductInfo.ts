import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { UpdateProductInfoInput } from "../../types";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
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
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Cập nhật thông tin sản phẩm thành công");
    },
    onError: () => {
      toast.error("Cập nhật thông tin sản phẩm thất bại");
    },
  });
};
