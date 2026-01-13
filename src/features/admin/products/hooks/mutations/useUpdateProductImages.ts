import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { productQueryKeys } from "@/features/product/constants/queryKeys";
import { toast } from "sonner";

export interface UpdateProductImagesInput {
  productId: string;
  data: FormData;
}

/**
 * Update Images Mutation
 * Update danh sách name + primaryName qua JSON
 */
export const useUpdateProductImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: UpdateProductImagesInput) => adminProductsApi.updateImages(data),
    onSuccess: (_, variables) => {
      // Chỉ invalidate list để cập nhật khi quay lại trang products
      // Không invalidate detail vì đang ở trang detail và sẽ chuyển trang ngay
      // Điều này tránh refetch làm component re-render trước khi chuyển trang
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(variables.productId),
      });
      toast.success("Cập nhật hình ảnh thành công");
    },
    onError: () => {
      toast.error("Cập nhật hình ảnh thất bại");
    },
  });
};
