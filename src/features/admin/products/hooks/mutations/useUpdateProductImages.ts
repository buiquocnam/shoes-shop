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
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail(variables.productId),
      });
      toast.success("Images updated successfully");
    },
    onError: () => {
      toast.error("Failed to update images");
    },
  });
};
