import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => adminProductsApi.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      toast.success("Xóa sản phẩm thành công");
    },
    onError: () => {
      toast.error("Xóa sản phẩm thất bại");
    },
  });
};



