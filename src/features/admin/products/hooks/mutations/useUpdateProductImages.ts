import { useQueryClient, useMutation } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
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
  return useMutation<boolean, Error, UpdateProductImagesInput>({
    mutationFn: ({ data }) => adminProductsApi.updateImages(data),
    onSuccess: (_, variables) => {
      // Chỉ invalidate list để cập nhật khi quay lại trang products
      // Không invalidate detail vì đang ở trang detail và sẽ chuyển trang ngay
      // Điều này tránh refetch làm component re-render trước khi chuyển trang
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Cập nhật hình ảnh thành công");
    },
    onError: () => {
      toast.error("Cập nhật hình ảnh thất bại");
    },
  });
};
