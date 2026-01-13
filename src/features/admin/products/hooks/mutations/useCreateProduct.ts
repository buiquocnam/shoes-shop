import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import { toast } from "sonner";

/**
 * Create Product Mutation
 * Payload: FormData với JSON body (info) + multipart files (images)
 */
import { ProductType } from "@/features/product/types";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => adminProductsApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(data.id),
      });
      toast.success("Tạo sản phẩm thành công");
    },
    onError: () => {
      toast.error("Tạo sản phẩm thất bại");
    },
  });
};
