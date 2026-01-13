import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import { toast } from "sonner";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => adminProductsApi.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.lists(),
      });
      toast.success("Xóa sản phẩm thành công");
    },
    onError: () => {
      toast.error("Xóa sản phẩm thất bại");
    },
  });
};



