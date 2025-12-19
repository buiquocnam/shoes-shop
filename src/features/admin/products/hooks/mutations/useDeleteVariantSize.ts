import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";

export interface DeleteVariantSizeInput {
  sizeId: string;
  productId: string;
}

export const useDeleteVariantSize = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, DeleteVariantSizeInput>({
    mutationFn: (data: DeleteVariantSizeInput) =>
      adminProductsApi.deleteVariantSize(data.sizeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Xóa size thành công");
    },
    onError: () => {
      toast.error("Xóa size thất bại");
    },
  });
};
