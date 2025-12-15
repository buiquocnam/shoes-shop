import { useQueryClient } from "@tanstack/react-query";
import {
  adminProductsApi,
  UpdateImagesInput,
} from "../../services/products.api";
import { sharedQueryKeys } from "@/features/shared/constants/shared-queryKeys";
import { useMutationWithToast } from "@/features/shared";


/**
 * Update Images Mutation
 * Update danh sách name + primaryName qua JSON
 */
export const useUpdateProductImages = () => {
  const queryClient = useQueryClient();
  return useMutationWithToast<boolean, FormData>({
    mutationFn: (data: FormData) => adminProductsApi.updateImages(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: sharedQueryKeys.product.detail((data as any).productId),
      });
    },
    successMessage: "Images updated successfully",
    errorMessage: "Failed to update images",
  });
};









