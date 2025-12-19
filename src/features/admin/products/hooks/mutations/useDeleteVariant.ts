import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { toast } from "sonner";

export interface DeleteVariantInput {
  variantId: string;
  productId: string;
}

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, DeleteVariantInput>({
    mutationFn: (data: DeleteVariantInput) =>
      adminProductsApi.deleteVariant(data.variantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Xóa biến thể thành công");
    },
    onError: () => {
      toast.error("Xóa biến thể thất bại");
    },
  });
};
