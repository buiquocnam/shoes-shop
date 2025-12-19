import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";

/**
 * Create Product Mutation
 * Payload: FormData với JSON body (info) + multipart files (images)
 */
import { ProductType } from "@/features/product/types";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductType, Error, FormData>({
    mutationFn: (data: FormData) => adminProductsApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(data.id),
      });
      toast.success("Tạo sản phẩm thành công");
    },
    onError: () => {
      toast.error("Tạo sản phẩm thất bại");
    },
  });
};
